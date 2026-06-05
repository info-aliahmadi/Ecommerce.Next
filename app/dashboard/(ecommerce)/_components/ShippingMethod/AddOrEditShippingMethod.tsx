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
import ShippingMethodService from '../../_service/ShippingMethodService';
import ShippingMethodModel from '../../_types/Common/ShippingMethodModel';

const AddOrEditShippingMethod = ({
  shippingMethodId,
  isNew,
  open,
  setOpen,
  refetch
}: {
  shippingMethodId: number;
  isNew: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}) => {
  const t = useTranslations('');
  const [fieldsName, buttonName] = ['fields.shippingMethod.', 'buttons.shippingMethod.'];
  const dialogName = t('pages.shippingMethod');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodModel | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const shippingMethodService = new ShippingMethodService(jwt ?? '');

  const loadShippingMethod = () => {
    shippingMethodService.getShippingMethodById(shippingMethodId).then((result) => {
      setShippingMethod(result.data);
    });
  };

  useEffect(() => {
    if (!isNew && shippingMethodId > 0) {
      loadShippingMethod();
    } else {
      setShippingMethod(undefined);
    }
  }, [shippingMethodId, isNew, open]);

  const onClose = () => {
    setOpen(false);
    setShippingMethod(undefined);
  };

  const handleSubmit = (shippingMethod: ShippingMethodModel, setErrors: (errors: any) => void) => {
    const submit = isNew ? shippingMethodService.addShippingMethod : shippingMethodService.updateShippingMethod;

    submit(shippingMethod)
      .then(() => {
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
            id: shippingMethod?.id,
            name: shippingMethod?.name,
            description: shippingMethod?.description,
            displayOrder: shippingMethod?.displayOrder ?? 0
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(70).required('Name is required'),
            description: Yup.string(),
            displayOrder: Yup.number().required('Display order is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              handleSubmit(values as ShippingMethodModel, setErrors);
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
                      <InputLabel htmlFor="description">{t(fieldsName + 'description')}</InputLabel>
                      <OutlinedInput id="description" type="text" value={values?.description || ''} name="description" onBlur={handleBlur} onChange={handleChange} placeholder={t(fieldsName + 'description')} fullWidth error={Boolean(touched.description && errors.description)} />
                      {touched.description && errors.description && <FormHelperText error>{errors.description}</FormHelperText>}
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

export default AddOrEditShippingMethod;
