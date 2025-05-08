import { useEffect, useState } from 'react';

// material-ui
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// third party
import * as Yup from 'yup';
import { Formik, FormikErrors } from 'formik';
import { useSession } from 'next-auth/react';

import AnimateButton from '@dashboard/_components/@extended/AnimateButton';

// assets
import { useTranslation } from 'react-i18next';
import Notify from '@dashboard/_components/@extended/Notify';
import setServerErrors from '@root/utils/setServerErrors';
import AddIcon from '@mui/icons-material/Add';
import CountryService from '@dashboard/(ecommerce)/_service/CountryService';

import CountryModel from '../../_types/Common/CountryModel';

const AddOrEditCountry = ({ countryId, isNew, open, setOpen, refetch }: 
  { countryId: number, isNew: boolean, open: boolean, setOpen: (open: boolean) => void, refetch: () => void }) => {
  const [t] = useTranslation();
  const [fieldsName, validation, buttonName] = ['fields.country.', 'validation.country.', 'buttons.country.'];
const [country, setCountry] = useState<CountryModel | undefined>();
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let countryService = new CountryService(jwt ?? '');

  const loadCountry = () => {
    countryService.getCountryById(countryId).then((result) => {
      setCountry(result.data);
    });
  };

  useEffect(() => {
    if (isNew == false && countryId > 0) {
      loadCountry();
    } else {
      setCountry(undefined);
    }
  }, [countryId, isNew, open]);

  const onClose = () => {
    setOpen(false);
    setCountry(undefined);
  };

  const handleSubmit = (Country : CountryModel , setErrors: (errors: FormikErrors<CountryModel>) => void, setSubmitting: (open: boolean) => void) => {
    if (isNew == true) {
      countryService
        .addCountry(Country)
        .then(() => {
          onClose();
          setCountry(undefined);
          setNotify({ open: true });
          refetch();
        })
        .catch((error) => {
          setNotify({ open: true, type: 'error', description: error });
          setErrors(setServerErrors(error));
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      countryService
        .updateCountry(Country)
        .then(() => {
          onClose();
          setCountry(undefined);
          setNotify({ open: true });
          refetch();
        })
        .catch((error) => {
          setErrors(setServerErrors(error));
          setNotify({ open: true, type: 'error', description: error });
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };
  const CloseDialog = ({ onClose }: { onClose: () => void }) => (
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: (theme) => theme.palette.grey[500]
      }}
    >
      <CloseIcon />
    </IconButton>
  );

const initialValues: CountryModel = {
    id: country?.id ?? 0,
    name: country?.name ?? '',
    twoLetterIsoCode: country?.twoLetterIsoCode ?? '',
    threeLetterIsoCode: country?.threeLetterIsoCode ?? '',
    allowsBilling: country?.allowsBilling ?? false,
    allowsShipping: country?.allowsShipping ?? false,
    numericIsoCode: country?.numericIsoCode ?? 0,
    subjectToVat: country?.subjectToVat ?? false,
    published: country?.published ?? true,
    limitedToStores: country?.limitedToStores ?? false,
    displayOrder: country?.displayOrder ?? 0,
    addresses: country?.addresses ?? 0,
    stateProvinces: country?.stateProvinces ?? 0,
    taxRates: country?.taxRates ?? 0
};
  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <Dialog open={open} fullWidth>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            Name: Yup.string().max(100).required('Name is required'),
            TwoLetterIsoCode: Yup.string().max(2).required('TwoLetterIsoCode is required'),
            ThreeLetterIsoCode: Yup.string().max(3).required('ThreeLetterIsoCode is required'),
            AllowsBilling: Yup.boolean().required('AllowsBilling is required'),
            AllowsShipping: Yup.boolean().required('AllowsShipping is required'),
            NumericIsoCode: Yup.number().required('NumericIsoCode is required'),
            SubjectToVat: Yup.boolean().required('SubjectToVat is required'),
            Published: Yup.boolean().required('Published is required'),
            LimitedToStores: Yup.boolean().required('LimitedToStores is required'),
            DisplayOrder: Yup.number().required('DisplayOrder is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              setSubmitting(true);
              handleSubmit(values, setErrors, setSubmitting);
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              
            }
          }}
        >
          {({ errors, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogTitle>
                {t('dialog.' + (isNew == true ? 'add' : 'edit') + '.title', { item: 'Country' })}
                <CloseDialog onClose={onClose} />
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3} direction="column">
                  <Grid item>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name">{t(fieldsName + 'name')}</InputLabel>
                      <OutlinedInput
                        id="name"
                        type="text"
                        value={values?.name || ''}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'name')}
                        fullWidth
                        error={Boolean(touched.name && errors.name)}
                      />
                      {touched.name && errors.name && (
                        <FormHelperText error id="helper-text-name">
                          {errors.name}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: '1.25rem' }}>
                <AnimateButton>
                  <Button onClick={onClose}>Cancel</Button>
                </AnimateButton>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                  >
                    {t(buttonName + (isNew == true ? 'add' : 'edit'))}
                  </Button>
                </AnimateButton>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default AddOrEditCountry;
