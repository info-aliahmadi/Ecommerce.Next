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
import { useTranslation } from 'react-i18next';
import Notify from '@dashboard/_components/@extended/Notify';
import setServerErrors from '@root/utils/setServerErrors';
import AddIcon from '@mui/icons-material/Add';
import CategoryService from '../../_service/CategoryService';
import CategoryModel from '../../_types/Product/CategoryModel';
import ImageUpload from '@dashboard/_components/FileUpload/ImageUpload';

interface AddOrEditCategoryProps {
  categoryId: number;
  isNew: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
  parentCategory?: CategoryModel;
}

const AddOrEditCategory = ({ categoryId, isNew, open, setOpen, refetch, parentCategory }: AddOrEditCategoryProps) => {
  const [t] = useTranslation();
  const [fieldsName, validation, buttonName] = ['fields.category.', 'validation.category.', 'buttons.category.'];
  const [category, setCategory] = useState<CategoryModel | undefined>(undefined);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let categoryService = new CategoryService(jwt ?? '');

  const loadCategory = () => {
    categoryService.getCategoryById(categoryId).then((result) => {
      setCategory(result.data);
    });
  };

  const loadCategories = () => {
    categoryService.getCategoryListForSelect().then((result) => {
      setCategories(result.data || []);
    });
  };

  useEffect(() => {
    loadCategories();
    if (isNew == false && categoryId > 0) {
      loadCategory();
    } else {
      setCategory(undefined);
    }
  }, [categoryId, isNew, open]);

  const onClose = () => {
    setOpen(false);
    setCategory(undefined);
  };

  const handleSubmit = (category: CategoryModel, setErrors: (errors: any) => void) => {
    if (isNew == true) {
      categoryService
        .addCategory(category)
        .then(() => {
          onClose();
          setCategory(undefined);
          setNotify({ open: true });
          refetch();
        })
        .catch((error) => {
          setNotify({ open: true, type: 'error', description: error });
          setErrors(setServerErrors(error));
        });
    } else {
      categoryService
        .updateCategory(category)
        .then(() => {
          onClose();
          setCategory(undefined);
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
            id: category?.id ?? 0,
            name: category?.name ?? '',
            metaKeywords: category?.metaKeywords ?? '',
            metaTitle: category?.metaTitle ?? '',
            description: category?.description ?? '',
            metaDescription: category?.metaDescription ?? '',
            parentCategoryId: parentCategory?.id ?? category?.parentCategoryId ?? null,
            pictureId: category?.pictureId ?? null,
            showOnHomepage: category?.showOnHomepage ?? false,
            published: category?.published ?? true,
            displayOrder: category?.displayOrder ?? 0
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(70).required('Name is required'),
            metaKeywords: Yup.string().max(250).required('MetaKeywords is required'),
            metaTitle: Yup.string().max(250).required('MetaTitle is required'),
            description: Yup.string().max(300).required('Description is required'),
            metaDescription: Yup.string().max(300).required('MetaDescription is required'),
            displayOrder: Yup.number().required('DisplayOrder is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              handleSubmit(values as CategoryModel, setErrors);
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
                {parentCategory
                  ? t('dialog.add.title', { item: 'Sub-Category for ' + parentCategory.name })
                  : t('dialog.' + (isNew == true ? 'add' : 'edit') + '.title', { item: 'Category' })}
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

                  {!parentCategory && (
                    <Grid item>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="parentCategoryId">{t(fieldsName + 'parentCategoryId')}</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="parentCategoryId"
                            value={values?.parentCategoryId || ''}
                            name="parentCategoryId"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {categories.map((category) => (
                              <MenuItem key={category.id} value={category.id}>
                                {category.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>
                  )}

                  <Grid item>
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

                  <Grid item>
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

                  <Grid item>
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

                  <Grid item>
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

                  <Grid item>
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
                <Button onClick={onClose}>Cancel</Button>
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