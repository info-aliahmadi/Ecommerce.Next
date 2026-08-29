import { useEffect, useState } from 'react';

// material-ui
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
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
import { Formik } from 'formik';
import { useSession } from 'next-auth/react';

// project import
import AnimateButton from '@dashboard/_components/@extended/AnimateButton';
import Notify from '@dashboard/_components/@extended/Notify';
import setServerErrors from '@root/utils/setServerErrors';
import AddIcon from '@mui/icons-material/Add';
import { useTranslations } from 'next-intl';
import StateProvinceService from '../../_service/StateProvinceService';
import StateProvinceModel from '../../_types/Common/StateProvinceModel';
import SelectCountry from '../Country/SelectCountry';

const AddOrEditStateProvince = ({
  stateProvinceId,
  isNew,
  open,
  setOpen,
  refetch
}: {
  stateProvinceId: number;
  isNew: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}) => {
  const t = useTranslations('');
  const [fieldsName, buttonName] = ['fields.stateProvince.', 'buttons.stateProvince.'];
  const dialogName = t('pages.stateProvince');
  const [stateProvince, setStateProvince] = useState<StateProvinceModel | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const stateProvinceService = new StateProvinceService(jwt ?? '');

  const loadStateProvince = () => {
    stateProvinceService.getStateProvinceById(stateProvinceId).then((result) => {
      if (!result.succeeded) {
        setNotify({ open: true, type: 'error', title: result.message, description: result.errors.map(x => x.description).join('\n') });
        return;
      }
      setStateProvince(result.data);
    });
  };

  useEffect(() => {
    if (!isNew && stateProvinceId > 0) {
      loadStateProvince();
    } else {
      setStateProvince(undefined);
    }
  }, [stateProvinceId, isNew, open]);

  const onClose = () => {
    setOpen(false);
    setStateProvince(undefined);
  };

  const handleSubmit = (stateProvince: StateProvinceModel, setErrors: (errors: any) => void) => {
    const submit = isNew ? stateProvinceService.addStateProvince : stateProvinceService.updateStateProvince;

    submit(stateProvince)
      .then((result) => {
        if (!result.succeeded) {
          setNotify({ open: true, type: 'error', title: result.message, description: result.errors.map(x => x.description).join('\n') });
          return;
        }
        onClose();
        setNotify({ open: true });
        refetch();
      })
      .catch((error) => {
        setErrors(setServerErrors(error));
        setNotify({ open: true, type: 'error', description: error });
      });
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

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <Dialog open={open} fullWidth>
        <Formik
          initialValues={{
            id: stateProvince?.id,
            name: stateProvince?.name,
            abbreviation: stateProvince?.abbreviation,
            countryId: stateProvince?.countryId,
            published: stateProvince?.published ?? true,
            displayOrder: stateProvince?.displayOrder ?? 0
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(70).required('Name is required'),
            abbreviation: Yup.string().max(10).required('Abbreviation is required'),
            countryId: Yup.number().required('Country is required'),
            displayOrder: Yup.number().required('Display order is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              handleSubmit(values as StateProvinceModel, setErrors);
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, setFieldValue, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogTitle>
                {t('dialog.' + (isNew ? 'add' : 'edit') + '.title', { item: dialogName })}
                <CloseDialog onClose={onClose} />
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="countryId">{t(fieldsName + 'countryId')}</InputLabel>
                      <SelectCountry
                        defaultValue={values?.countryId || 0}
                        id="countryId"
                        name="countryId"
                        label={t(fieldsName + 'countryId')}
                        setFieldValue={setFieldValue}
                        error={Boolean(touched.countryId && errors.countryId)} />
                      {touched.countryId && errors.countryId && <FormHelperText error>{errors.countryId}</FormHelperText>}
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name">{t(fieldsName + 'name')}</InputLabel>
                      <OutlinedInput id="name" type="text" value={values?.name || ''} name="name" onBlur={handleBlur} onChange={handleChange} placeholder={t(fieldsName + 'name')} fullWidth error={Boolean(touched.name && errors.name)} />
                      {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="abbreviation">{t(fieldsName + 'abbreviation')}</InputLabel>
                      <OutlinedInput id="abbreviation" type="text" value={values?.abbreviation || ''} name="abbreviation" onBlur={handleBlur} onChange={handleChange} placeholder={t(fieldsName + 'abbreviation')} fullWidth error={Boolean(touched.abbreviation && errors.abbreviation)} />
                      {touched.abbreviation && errors.abbreviation && <FormHelperText error>{errors.abbreviation}</FormHelperText>}
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="displayOrder">{t(fieldsName + 'displayOrder')}</InputLabel>
                      <OutlinedInput id="displayOrder" type="number" value={values?.displayOrder || ''} name="displayOrder" onBlur={handleBlur} onChange={handleChange} placeholder={t(fieldsName + 'displayOrder')} fullWidth error={Boolean(touched.displayOrder && errors.displayOrder)} />
                      {touched.displayOrder && errors.displayOrder && <FormHelperText error>{errors.displayOrder}</FormHelperText>}
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <FormControlLabel control={<Checkbox checked={values?.published || false} name="published" onChange={handleChange} />} label={t(fieldsName + 'published')} />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: '1.25rem' }}>
                <AnimateButton>
                  <Button onClick={onClose}>{t('buttons.cancel')}</Button>
                </AnimateButton>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary" startIcon={<AddIcon />}>
                    {t(buttonName + (isNew ? 'add' : 'edit'))}
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

export default AddOrEditStateProvince;
