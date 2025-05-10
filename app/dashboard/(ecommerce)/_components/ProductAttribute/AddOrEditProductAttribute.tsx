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
  FormControl
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

import ProductAttributeModel, { AttributeType } from '../../_types/Product/ProductAttributeModel';
import ProductAttributeService from '../../_service/ProductAttributeService';
import ImageUpload from '@dashboard/_components/FileUpload/ImageUpload';

// Create array of AttributeType enum options for the select
const attributeTypeOptions = [
  { value: AttributeType.Color, label: 'Color' },
  { value: AttributeType.Size, label: 'Size' },
  { value: AttributeType.Weight, label: 'Weight' },
  { value: AttributeType.Length, label: 'Length' },
  { value: AttributeType.Width, label: 'Width' },
  { value: AttributeType.Height, label: 'Height' },
  { value: AttributeType.Material, label: 'Material' },
  { value: AttributeType.Style, label: 'Style' },
  { value: AttributeType.Pattern, label: 'Pattern' },
  { value: AttributeType.Brand, label: 'Brand' },
  { value: AttributeType.Model, label: 'Model' }
];

export default function AddOrEditProductAttribute({ productAttributeId, isNew, open, setOpen, refetch }:
  { productAttributeId: number, isNew: boolean, open: boolean, setOpen: (open: boolean) => void, refetch: () => void }) {
  const [t] = useTranslation();
  const [fieldsName, validation, buttonName] = ['fields.product-attribute.', 'validation.product-attribute.', 'buttons.product-attribute.'];
  const [productAttribute, setProductAttribute] = useState<ProductAttributeModel>();
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let productAttributeService = new ProductAttributeService(jwt ?? '');

  const loadProductAttribute = () => {
    productAttributeService.getProductAttributeById(productAttributeId).then((result) => {
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
        .then(() => {
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
        .then(() => {
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
    value: productAttribute?.value ?? '',
    attributeType: productAttribute?.attributeType ?? AttributeType.Weight,
    pictureId: productAttribute?.pictureId ?? null,
    displayOrder: productAttribute?.displayOrder ?? 0,
    description: productAttribute?.description ?? ''
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
            value: Yup.string().required('Value is required'),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              debugger
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
                      <InputLabel htmlFor="value">{t(fieldsName + 'value')}</InputLabel>
                      <OutlinedInput
                        id="value"
                        type="text"
                        value={values?.value || ''}
                        name="value"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'value')}
                        fullWidth
                        error={Boolean(touched.value && errors.value)}
                      />
                      {touched.value && errors.value && (
                        <FormHelperText error id="helper-text-value">
                          {errors.value}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="attributeType">{t(fieldsName + 'attributeType')}</InputLabel>
                      <FormControl fullWidth error={Boolean(touched.attributeType && errors.attributeType)}>
                        <Select
                          id="attributeType"
                          value={values?.attributeType ?? AttributeType.Color}
                          name="attributeType"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          displayEmpty
                        >
                          {attributeTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.attributeType && errors.attributeType && (
                          <FormHelperText error id="helper-text-attributeType">
                            {errors.attributeType}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                  </Grid>

                  <Grid item>
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

                  <Grid item>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="pictureId">{t(fieldsName + 'pictureId')}</InputLabel>
                      <ImageUpload
                        id="pictureId"
                        setFieldValue={setFieldValue}
                        value={values?.pictureId ?? ''}
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

