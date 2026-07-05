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
  Checkbox,
  Select,
  MenuItem,
  FormControl
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
import CategoryService from '../../_service/CategoryService';
import CategoryModel from '../../_types/Product/CategoryModel';
import ImageUpload from '@dashboard/_components/FileUpload/ImageUpload';
import { MRT_Row } from 'material-react-table';
import MenuModel from '@root/app/dashboard/(cms)/_types/Menu/MenuModel';

interface AddOrEditCategoryProps {
  row?: MRT_Row<CategoryModel>;
  isNew: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}

const AddOrEditCategory = ({ row, isNew, open, setOpen, refetch }: AddOrEditCategoryProps) => {
  const t = useTranslations("");
  const [fieldsName, validation, buttonName] = ['fields.category.', 'validation.category.', 'buttons.category.'];
  const [category, setCategory] = useState<CategoryModel | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let categoryService = new CategoryService(jwt ?? '');

  const loadCategory = () => {
    row && categoryService.getCategoryById(row?.original?.id).then((result) => {
      setCategory(result.data);
    });
  };


  useEffect(() => {
    if (isNew == false && row) {
      loadCategory();
    } else {
      setCategory(undefined);
    }
  }, [row, isNew, open]);

  const onClose = () => {
    setOpen(false);
    setCategory(undefined);
  };

  const handleSubmit = (category: CategoryModel, setErrors: (errors: any) => void) => {
    if (isNew == true) {
      categoryService
        .addCategory(category)
        .then(() => {
          refetch();
          onClose();
          setNotify({ open: true });
        })
        .catch((error) => {
          setNotify({ open: true, type: 'error', description: error });
          setErrors(setServerErrors(error));
        });
    } else {
      categoryService
        .updateCategory(category)
        .then(() => {
          refetch();
          onClose();
          setNotify({ open: true });
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
  const initialValues: CategoryModel = {
    id: category?.id ?? 0,
    name: category?.name ?? '',
    key: category?.key ?? '',
    color: category?.color ?? '',
    metaKeywords: category?.metaKeywords ?? '',
    metaTitle: category?.metaTitle ?? '',
    description: category?.description ?? '',
    metaDescription: category?.metaDescription ?? '',
    parentCategoryId: row && isNew == true ? row?.original?.id : category?.parentCategoryId ?? null,
    imagePreviewId: category?.imagePreviewId ?? null,
    imagePreview: category?.imagePreview ?? null,
    showOnHomepage: category?.showOnHomepage ?? false,
    published: category?.published ?? true,
    displayOrder: category?.displayOrder ?? 0,
    deleted: category?.deleted ?? false,
    createdOnUtc: category?.createdOnUtc ?? new Date(),
    updatedOnUtc: category?.updatedOnUtc ?? new Date(),
    discounts: 0,
    isEdited: false,
    childs: [],
  }
  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <Dialog open={open} fullWidth>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(70, t("validation.category.maxLengthName")).required(t("validation.category.requiredName")),
            metaKeywords: Yup.string().max(250, t("validation.category.maxLengthMetaKeywords")),
            metaTitle: Yup.string().max(250, t("validation.category.maxLengthMetaTitle")),
            metaDescription: Yup.string().max(300, t("validation.category.maxLengthMetaDescription")),
            description: Yup.string().max(300, t("validation.category.maxLengthDescription")),
            displayOrder: Yup.number().required(t("validation.category.requiredDisplayOrder"))
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              handleSubmit(values, setErrors);
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
                {isNew == true
                  ? row
                    ? t('dialog.category.addSub', { parentTitle: `"${row?.original?.name}"` })
                    : t('dialog.category.addMain')
                  : t('dialog.edit.title', { item: values.name })}
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
                      <InputLabel htmlFor="metaKeywords">{t(fieldsName + 'metaKeywords')}</InputLabel>
                      <OutlinedInput
                        id="metaKeywords"
                        type="text"
                        value={values?.metaKeywords || ''}
                        name="metaKeywords"
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

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="metaTitle">{t(fieldsName + 'metaTitle')}</InputLabel>
                      <OutlinedInput
                        id="metaTitle"
                        type="text"
                        value={values?.metaTitle || ''}
                        name="metaTitle"
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
                      <InputLabel htmlFor="metaDescription">{t(fieldsName + 'metaDescription')}</InputLabel>
                      <OutlinedInput
                        id="metaDescription"
                        type="text"
                        value={values?.metaDescription || ''}
                        name="metaDescription"
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

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="imagePreviewId">{t(fieldsName + 'imagePreviewId')}</InputLabel>
                      <ImageUpload
                        name="imagePreviewId"
                        setFieldValue={setFieldValue}
                        value={values?.imagePreviewId ?? ''}
                        filePosterMaxHeight={400}
                      />
                    </Stack>
                  </Grid>

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="color">{t(fieldsName + 'color')}</InputLabel>
                      <OutlinedInput
                        id="color"
                        type="text"
                        value={values?.color || ''}
                        name="color"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'color')}
                        fullWidth
                        error={Boolean(touched.color && errors.color)}
                      />
                      {touched.color && errors.color && (
                        <FormHelperText error id="helper-text-color">
                          {errors.color}
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
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values?.published || false}
                            onChange={handleChange}
                            name="published"
                            color="primary"
                          />
                        }
                        label={t(fieldsName + 'published')}
                      />
                    </Stack>
                  </Grid>

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="displayOrder">{t(fieldsName + 'displayOrder')}</InputLabel>
                      <OutlinedInput
                        id="displayOrder"
                        type="number"
                        value={values?.displayOrder || ''}
                        name="displayOrder"
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
                <Button onClick={onClose}>{t('buttons.cancel')}</Button>
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

export default AddOrEditCategory; 