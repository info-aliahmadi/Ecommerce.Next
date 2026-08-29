import { useEffect, useState } from 'react';

// material-ui
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
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
import TaxRateService from '../../_service/TaxRateService';
import TaxRateModel from '../../_types/Common/TaxRateModel';
import SelectCountry from '../Country/SelectCountry';
import SelectTaxCategory from '../TaxCategory/SelectTaxCategory';

const AddOrEditTaxRate = ({
  taxRateId,
  isNew,
  open,
  setOpen,
  refetch
}: {
  taxRateId: number;
  isNew: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}) => {
  const t = useTranslations('');
  const [fieldsName, buttonName] = ['fields.taxRate.', 'buttons.taxRate.'];
  const dialogName = t('pages.taxRate');
  const [taxRate, setTaxRate] = useState<TaxRateModel | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const taxRateService = new TaxRateService(jwt ?? '');

  const loadTaxRate = () => {
    taxRateService.getTaxRateById(taxRateId).then((result) => {
      if (!result.succeeded) {
        setNotify({ open: true, type: 'error', title: result.message, description: result.errors.map(x => x.description).join('\n') });
        return;
      }
      setTaxRate(result.data);
    });
  };

  useEffect(() => {
    if (!isNew && taxRateId > 0) {
      loadTaxRate();
    } else {
      setTaxRate(undefined);
    }
  }, [taxRateId, isNew, open]);

  const onClose = () => {
    setOpen(false);
    setTaxRate(undefined);
  };

  const handleSubmit = (taxRate: TaxRateModel, setErrors: (errors: any) => void) => {
    const submit = isNew ? taxRateService.addTaxRate : taxRateService.updateTaxRate;

    submit(taxRate)
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
            id: taxRate?.id,
            taxCategoryId: taxRate?.taxCategoryId,
            countryId: taxRate?.countryId,
            percentage: taxRate?.percentage ?? 0
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            taxCategoryId: Yup.number().required('Tax category is required'),
            countryId: Yup.number().required('Country is required'),
            percentage: Yup.number().required('Percentage is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              handleSubmit(values as TaxRateModel, setErrors);
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
                      <InputLabel htmlFor="taxCategoryId">{t(fieldsName + 'taxCategoryId')}</InputLabel>
                      <SelectTaxCategory
                        defaultValue={values?.taxCategoryId || 0}
                        id="taxCategoryId"
                        name="taxCategoryId"
                        label={t(fieldsName + 'taxCategoryId')}
                        setFieldValue={setFieldValue}
                        error={Boolean(touched.taxCategoryId && errors.taxCategoryId)}
                      />
                      {touched.taxCategoryId && errors.taxCategoryId && <FormHelperText error>{errors.taxCategoryId}</FormHelperText>}
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="countryId">{t(fieldsName + 'countryId')}</InputLabel>
                      <SelectCountry
                        defaultValue={values?.countryId || 0}
                        id="countryId"
                        name="countryId"
                        label={t(fieldsName + 'countryId')}
                        setFieldValue={setFieldValue}
                        error={Boolean(touched.countryId && errors.countryId)}
                      />
                      {touched.countryId && errors.countryId && <FormHelperText error>{errors.countryId}</FormHelperText>}
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="percentage">{t(fieldsName + 'percentage')}</InputLabel>
                      <OutlinedInput id="percentage" type="number" value={values?.percentage || ''} name="percentage" onBlur={handleBlur} onChange={handleChange} placeholder={t(fieldsName + 'percentage')} fullWidth error={Boolean(touched.percentage && errors.percentage)} />
                      {touched.percentage && errors.percentage && <FormHelperText error>{errors.percentage}</FormHelperText>}
                    </Stack>
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

export default AddOrEditTaxRate;
