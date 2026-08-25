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
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// third party
import * as Yup from 'yup';
import { Formik, FormikErrors } from 'formik';
import { useSession } from 'next-auth/react';

import AnimateButton from '@dashboard/_components/@extended/AnimateButton';

// assets
import { useTranslations } from 'next-intl';
import Notify from '@dashboard/_components/@extended/Notify';
import setServerErrors from '@root/utils/setServerErrors';
import AddIcon from '@mui/icons-material/Add';

import ProductAttributeModel from '../../_types/Product/ProductAttributeModel';
import ProductAttributeService from '../../_service/ProductAttributeService';
import ImageUpload from '@dashboard/_components/FileUpload/ImageUpload';
import SelectAttributeType from './SelectAttributeType';
import AttributeType from '@root/app/types/enums/AttributeType';


export default function AddOrEditProductAttribute(
  { productAttributeId,
    isNew,
    open,
    setOpen,
    refetch
  }:
    Readonly<{
      productAttributeId: number,
      isNew: boolean,
      open: boolean,
      setOpen: (open: boolean) => void,
      refetch: () => void
    }>) {
  const t = useTranslations("");
  const [fieldsName, validation, buttonName] = ['fields.productAttribute.', 'validation.productAttribute.', 'buttons.productAttribute.'];
  const dialogName = t('pages.productAttribute');
  const [productAttribute, setProductAttribute] = useState<ProductAttributeModel>();
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let productAttributeService = new ProductAttributeService(jwt ?? '');

  const loadProductAttribute = () => {
    productAttributeService.getProductAttributeById(productAttributeId).then((result) => {
      if (!result.succeeded) {
        setNotify({ open: true, type: 'error', title: result.message, description: result.errors.map(x => x.description).join('\n') });
        return;
      }
      setProductAttribute(result.data);
    });
  };


  useEffect(() => {
    if (isNew == false && productAttributeId > 0) {
      loadProductAttribute();
    } else {
      setProductAttribute(undefined);
    }
  }, [productAttributeId, isNew, open]);

  const onClose = () => {
    setOpen(false);
    setProductAttribute(undefined);
  };

  const handleSubmit = (productAttribute: ProductAttributeModel, setErrors: (errors: FormikErrors<ProductAttributeModel>) => void, setSubmitting: (open: boolean) => void) => {
    if (isNew == true) {
      productAttributeService
        .addProductAttribute(productAttribute)
        .then((result) => {
          if (!result.succeeded) {
            setNotify({ open: true, type: 'error', title: result.message, description: result.errors.map(x => x.description).join('\n') });
            return;
          }
          onClose();
          setProductAttribute(undefined);
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
      productAttributeService
        .updateProductAttribute(productAttribute)
        .then((result) => {
          if (!result.succeeded) {
            setNotify({ open: true, type: 'error', title: result.message, description: result.errors.map(x => x.description).join('\n') });
            return;
          }
          onClose();
          setProductAttribute(undefined);
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

  const initialValues: ProductAttributeModel = {
    id: productAttribute?.id ?? 0,
    name: productAttribute?.name ?? '',
    key: productAttribute?.key ?? '',
    attributeType: productAttribute?.attributeType ?? AttributeType.Color,
    imagePreviewId: productAttribute?.imagePreviewId ?? null,
    displayOrder: productAttribute?.displayOrder ?? 0,
    description: productAttribute?.description ?? '',
    showOnHomepage: productAttribute?.showOnHomepage ?? false
  };

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <Dialog open={open} fullWidth>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(70).required('Name is required'),
            attributeType: Yup.string().required('AttributeType is required'),
            key: Yup.string().required('Key is required'),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {

              setSubmitting(true);
              handleSubmit(values as ProductAttributeModel, setErrors, setSubmitting);
            } catch (err) {
              console.error(err);
              setStatus({ success: false });

            }
          }}
        >
          {({ errors, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogTitle>
                {t('dialog.' + (isNew == true ? 'add' : 'edit') + '.title', { item: dialogName })}
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
                      <InputLabel htmlFor="key">{t(fieldsName + 'key')}</InputLabel>
                      <OutlinedInput
                        id="key"
                        type="text"
                        value={values?.key || ''}
                        name="key"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'key')}
                        fullWidth
                        error={Boolean(touched.key && errors.key)}
                      />
                      {touched.key && errors.key && (
                        <FormHelperText error id="helper-text-key">
                          {errors.key}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="attributeType">{t(fieldsName + 'attributeType')}</InputLabel>
                      <FormControl fullWidth error={Boolean(touched.attributeType && errors.attributeType)}>
                        <SelectAttributeType
                          name="attributeType"
                          defaultValue={values?.attributeType}
                          setFieldValue={setFieldValue}
                          label={t("fields.productAttribute.attributeType")}
                          error={Boolean(touched.attributeType && errors.attributeType)}
                          showNoneOption={true}
                        />
                        {touched.attributeType && errors.attributeType && (
                          <FormHelperText error id="helper-text-attributeType">
                            {errors.attributeType}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                  </Grid>

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="description">{t(fieldsName + 'description')}</InputLabel>
                      <OutlinedInput
                        id="description"
                        type="text"
                        value={values?.description || ''}
                        name="description"
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
                            checked={values?.showOnHomepage || false}
                            onChange={handleChange}
                            name="showOnHomepage"
                            color="primary"
                          />
                        }
                        label={t(fieldsName + 'showOnHomepage')}
                      />
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="imagePreviewId">{t(fieldsName + 'imagePreviewId')}</InputLabel>
                      <ImageUpload
                        name="imagePreviewId"
                        setFieldValue={setFieldValue}
                        value={values?.imagePreviewId ?? 0}
                        filePosterMaxHeight={400}
                      />
                    </Stack>
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

