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
  Stack,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSession } from 'next-auth/react';

import AnimateButton from '@dashboard/_components/@extended/AnimateButton';

// assets
import { useTranslations } from 'next-intl';
import Notify from '@dashboard/_components/@extended/Notify';
import setServerErrors from '@root/utils/setServerErrors';
import AddIcon from '@mui/icons-material/Add';
import BundleService from '../../_service/BundleService';
import BundleModel from '../../_types/Product/BundleModel';
import ProductBundleEditor from './ProductBundleEditor';


const AddOrEditBundle = ({ bundleId, isNew, open, setOpen, refetch }:
  {
    bundleId: number,
    isNew: boolean,
    open: boolean,
    setOpen: (open: boolean) => void,
    refetch: () => void
  }) => {
  const t = useTranslations("");
  const [fieldsName, buttonName] = ['fields.bundle.', 'buttons.bundle.'];
  const [bundle, setBundle] = useState<BundleModel | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let bundleService = new BundleService(jwt ?? '');

  const loadBundle = () => {
    bundleService.getBundleById(bundleId).then((result) => {
      setBundle(result.data);
    });
  };

  useEffect(() => {
    if (isNew == false && bundleId > 0) {
      loadBundle();
    } else {
      setBundle(undefined);
    }
  }, [bundleId, isNew, open]);

  const onClose = () => {
    setOpen(false);
    setBundle(undefined);
  };

  const handleSubmit = (Bundle: BundleModel, setErrors: (errors: any) => void) => {
    if (isNew == true) {
      bundleService
        .addBundle(Bundle)
        .then(() => {
          onClose();
          setBundle(undefined);
          setNotify({ open: true });
          refetch();
        })
        .catch((error) => {
          setNotify({ open: true, type: 'error', description: error });
          setErrors(setServerErrors(error));
        });
    } else {
      bundleService
        .updateBundle(Bundle)
        .then(() => {
          onClose();
          setBundle(undefined);
          setNotify({ open: true });
          refetch();
        })
        .catch((error) => {
          setErrors(setServerErrors(error));
          setNotify({ open: true, type: 'error', description: error });
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

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <Dialog open={open} fullWidth>
        <Formik
          initialValues={{
            id: bundle?.id,
            name: bundle?.name,
            description: bundle?.description,
            showOnHomepage: bundle?.showOnHomepage ?? false,
            displayOrder: bundle?.displayOrder,
            products: bundle?.products ?? []
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(70).required('Name is required'),
            description: Yup.string().max(300).required('Description is required'),
            showOnHomepage: Yup.boolean(),
            displayOrder: Yup.number().required('DisplayOrder is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              handleSubmit(values as BundleModel, setErrors);
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogTitle>
                {isNew === true ? t('buttons.bundle.add') : t('dialog.edit.title', { item: `"${values.name}"` })}
                <CloseDialog onClose={onClose} />
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3} >
                  <Grid size={12}>
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

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="description">{t(fieldsName + 'description')}</InputLabel>
                      <OutlinedInput
                        id="description"
                        type="text"
                        value={values?.description || ''}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'description')}
                        fullWidth
                        error={Boolean(touched.description && errors.description)}
                      />
                      {touched.description && errors.description && (
                        <FormHelperText error id="helper-text-description">
                          {errors.description}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values?.showOnHomepage ?? false}
                            onChange={handleChange}
                            name="showOnHomepage"
                          />
                        }
                        label={t(fieldsName + 'showOnHomepage')}
                      />
                    </Stack>
                  </Grid>

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="displayOrder">{t(fieldsName + 'displayOrder')}</InputLabel>
                      <OutlinedInput
                        id="displayOrder"
                        type="text"
                        value={values?.displayOrder || ''}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'displayOrder')}
                        fullWidth
                        error={Boolean(touched.displayOrder && errors.displayOrder)}
                      />
                      {touched.displayOrder && errors.displayOrder && (
                        <FormHelperText error id="helper-text-displayOrder">
                          {errors.displayOrder}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <ProductBundleEditor
                      products={values?.products ?? []}
                      setFieldValue={setFieldValue}
                    />
                  </Grid>

                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: '1.25rem' }}>
                <AnimateButton>
                  <Button onClick={onClose}>{t('buttons.cancel')}</Button>
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

export default AddOrEditBundle;
