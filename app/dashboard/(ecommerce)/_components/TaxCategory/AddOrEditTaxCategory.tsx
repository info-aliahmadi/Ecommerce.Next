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
import TaxCategoryService from '../../_service/TaxCategoryService';
import TaxCategoryModel from '../../_types/Common/TaxCategoryModel';

const AddOrEditTaxCategory = ({
  taxCategoryId,
  isNew,
  open,
  setOpen,
  refetch
}: {
  taxCategoryId: number;
  isNew: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}) => {
  const t = useTranslations('');
  const [fieldsName, buttonName] = ['fields.taxCategory.', 'buttons.taxCategory.'];
  const dialogName = t('pages.taxCategory');
  const [taxCategory, setTaxCategory] = useState<TaxCategoryModel | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const taxCategoryService = new TaxCategoryService(jwt ?? '');

  const loadTaxCategory = () => {
    taxCategoryService.getTaxCategoryById(taxCategoryId).then((result) => {
      if (!result.succeeded) {
        setNotify({ open: true, type: 'error', title: result.message, description: result.errors.map(x => x.description).join('\n') });
        return;
      }
      setTaxCategory(result.data);
    });
  };

  useEffect(() => {
    if (!isNew && taxCategoryId > 0) {
      loadTaxCategory();
    } else {
      setTaxCategory(undefined);
    }
  }, [taxCategoryId, isNew, open]);

  const onClose = () => {
    setOpen(false);
    setTaxCategory(undefined);
  };

  const handleSubmit = (taxCategory: TaxCategoryModel, setErrors: (errors: any) => void) => {
    const submit = isNew ? taxCategoryService.addTaxCategory : taxCategoryService.updateTaxCategory;

    submit(taxCategory)
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
            id: taxCategory?.id,
            name: taxCategory?.name,
            displayOrder: taxCategory?.displayOrder ?? 0
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(70).required('Name is required'),
            displayOrder: Yup.number().required('Display order is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              handleSubmit(values as TaxCategoryModel, setErrors);
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogTitle>
                {t('dialog.' + (isNew ? 'add' : 'edit') + '.title', { item: dialogName })}
                <CloseDialog onClose={onClose} />
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name">{t(fieldsName + 'name')}</InputLabel>
                      <OutlinedInput id="name" type="text" value={values?.name || ''} name="name" onBlur={handleBlur} onChange={handleChange} placeholder={t(fieldsName + 'name')} fullWidth error={Boolean(touched.name && errors.name)} />
                      {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="displayOrder">{t(fieldsName + 'displayOrder')}</InputLabel>
                      <OutlinedInput id="displayOrder" type="number" value={values?.displayOrder || ''} name="displayOrder" onBlur={handleBlur} onChange={handleChange} placeholder={t(fieldsName + 'displayOrder')} fullWidth error={Boolean(touched.displayOrder && errors.displayOrder)} />
                      {touched.displayOrder && errors.displayOrder && <FormHelperText error>{errors.displayOrder}</FormHelperText>}
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

export default AddOrEditTaxCategory;
