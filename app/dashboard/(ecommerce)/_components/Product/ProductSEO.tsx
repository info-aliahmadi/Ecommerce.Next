import { FormHelperText, Grid, TextField, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import SelectProductTag from '../ProductTag/SelectProductTag';
import ProductModel from '../../_types/Product/ProductModel';

export default function ProductSEO({
  values,
  setFieldValue,
  handleBlur,
  handleChange,
  errors
}:
  Readonly<{
    operation: 'add' | 'edit',
    values: ProductModel, setFieldValue: (field: string, value: any) => void,
    handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    errors: any,
  }>) {
  const t = useTranslations("");
  const fieldsName = 'fields.product.';
  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(event.target.id, event.target.checked);
  };
  return (
    <Grid container columnSpacing={3}>
      <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 8, xl: 8 }}>
     
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
          <Stack>
            <TextField
              id="metaTitle"
              name="metaTitle"
              type="text"
              value={values?.metaTitle || ''}
              label={t(fieldsName + 'metaTitle')}
              onBlur={handleBlur}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.metaTitle)}
            />
            {errors.metaTitle && (
              <FormHelperText error id="helper-text">
                {errors.metaTitle}
              </FormHelperText>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
          <Stack>
            <TextField
              id="metaKeywords"
              name="metaKeywords"
              type="text"
              value={values?.metaKeywords || ''}
              label={t(fieldsName + 'metaKeywords')}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder={t(fieldsName + 'metaKeywords')}
              fullWidth
              error={Boolean(errors.metaKeywords)}
            />
            {errors.metaKeywords && (
              <FormHelperText error id="helper-text">
                {errors.metaKeywords}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
          <Stack>
            <TextField
              id="metaDescription"
              name="metaDescription"
              type="text"
              value={values?.metaDescription || ''}
              label={t(fieldsName + 'metaDescription')}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder={t(fieldsName + 'metaDescription')}
              fullWidth
              error={Boolean(errors.metaDescription)}
            />
            {errors.metaDescription && (
              <FormHelperText error id="helper-text">
                {errors.metaDescription}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}
