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
import { Formik } from 'formik';
import { useSession } from 'next-auth/react';

import AnimateButton from '@dashboard/_components/@extended/AnimateButton';

// assets
import { useTranslation } from 'react-i18next';
import Notify from '@dashboard/_components/@extended/Notify';
import setServerErrors from '@root/utils/setServerErrors';
import AddIcon from '@mui/icons-material/Add';
import ManufacturerService from '../../_service/ManufacturerService';
import ManufacturerModel from '../../_types/Product/ManufacturerModel';


const AddOrEditManufacturer = ({ manufacturerId, isNew, open, setOpen, refetch }: { manufacturerId: number, isNew: boolean, open: boolean, setOpen: (open: boolean) => void, refetch: () => void }) => {
  const [t] = useTranslation();
  const [fieldsName, validation, buttonName] = ['fields.manufacturer.', 'validation.manufacturer.', 'buttons.manufacturer.'];
  const [manufacturer, setManufacturer] = useState<ManufacturerModel | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let manufacturerService = new ManufacturerService(jwt ?? '');

  const loadManufacturer = () => {
    manufacturerService.getManufacturerById(manufacturerId).then((result) => {
      setManufacturer(result.data);
    });
  };


  useEffect(() => {
    if (isNew == false && manufacturerId > 0) {
      loadManufacturer();
    } else {
      setManufacturer(undefined);
    }
  }, [manufacturerId, isNew, open]);

  const onClose = () => {
    setOpen(false);
    setManufacturer(undefined);
  };

  const handleSubmit = (Manufacturer: ManufacturerModel, setErrors: (errors: any) => void) => {
    if (isNew == true) {
      manufacturerService
        .addManufacturer(Manufacturer)
        .then(() => {
          onClose();
          setManufacturer(undefined);
          setNotify({ open: true });
          refetch();
        })
        .catch((error) => {
          setNotify({ open: true, type: 'error', description: error });
          setErrors(setServerErrors(error));
        });
    } else {
      manufacturerService
        .updateManufacturer(Manufacturer)
        .then(() => {
          onClose();
          setManufacturer(undefined);
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
            id: manufacturer?.id,
            name: manufacturer?.name,
            metaKeywords: manufacturer?.metaKeywords,
            metaTitle: manufacturer?.metaTitle,
            description: manufacturer?.description,
            metaDescription: manufacturer?.metaDescription,
            //published: manufacturer?.published,
            //pictureId: manufacturer?.pictureId,
            displayOrder: manufacturer?.displayOrder
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(70).required('Name is required'),
            metaKeywords: Yup.string().max(250).required('MetaKeywords is required'),
            metaTitle: Yup.string().max(250).required('MetaTitle is required'),
            description: Yup.string().max(300).required('Description is required'),
            metaDescription: Yup.string().max(300).required('MetaDescription is required'),
            //published: Yup.bool().required('Published is required'),
            //pictureId: Yup.strin.max()g().required('PictureId is required'),
            displayOrder: Yup.number().required('DisplayOrder is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              handleSubmit(values as ManufacturerModel, setErrors);
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
                {t('dialog.' + (isNew == true ? 'add' : 'edit') + '.title', { item: 'Manufacturer' })}
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

                  <Grid item>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="metaKeywords">{t(fieldsName + 'metaKeywords')}</InputLabel>
                      <OutlinedInput
                        id="metaKeywords"
                        type="text"
                        value={values?.metaKeywords || ''}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'metaKeywords')}
                        fullWidth
                        error={Boolean(touched.metaKeywords && errors.metaKeywords)}
                      />
                      {touched.metaKeywords && errors.metaKeywords && (
                        <FormHelperText error id="helper-text-metaKeywords">
                          {errors.metaKeywords}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="metaTitle">{t(fieldsName + 'metaTitle')}</InputLabel>
                      <OutlinedInput
                        id="metaTitle"
                        type="text"
                        value={values?.metaTitle || ''}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'metaTitle')}
                        fullWidth
                        error={Boolean(touched.metaTitle && errors.metaTitle)}
                      />
                      {touched.metaTitle && errors.metaTitle && (
                        <FormHelperText error id="helper-text-metaTitle">
                          {errors.metaTitle}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item>
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

                  <Grid item>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="metaDescription">{t(fieldsName + 'metaDescription')}</InputLabel>
                      <OutlinedInput
                        id="metaDescription"
                        type="text"
                        value={values?.metaDescription || ''}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'metaDescription')}
                        fullWidth
                        error={Boolean(touched.metaDescription && errors.metaDescription)}
                      />
                      {touched.metaDescription && errors.metaDescription && (
                        <FormHelperText error id="helper-text-metaDescription">
                          {errors.metaDescription}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item>
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

export default AddOrEditManufacturer;
