import { FormHelperText, Grid, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import DateTimeInput from '@dashboard/_components/DateTime/DateTimeInput';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

interface ProductSettingsProps {
  operation: 'add' | 'edit',
  values: any,
  setFieldValue: (field: string, value: any) => void,
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  errors: any,
}


export default function ProductSettings({
  operation,
  values,
  setFieldValue,
  handleBlur,
  handleChange,
  errors
}:
  Readonly<ProductSettingsProps>) {
  const t = useTranslations("");
  const fieldsName = 'fields.product.';
  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(event.target.id, event.target.checked);
  };
  return (
    <Grid container columnSpacing={3}>
      <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 8, xl: 8 }}>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  id="hasDiscountsApplied"
                  name="hasDiscountsApplied"
                  checked={values?.hasDiscountsApplied ?? false}
                  onChange={handleCheckedChange}
                />
              }
              label="Has Discounts Applied"
            />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  id="notReturnable"
                  name="notReturnable"
                  checked={values?.notReturnable ?? true}
                  onChange={handleCheckedChange}
                />
              }
              label="Not Returnable"
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  id="isTaxExempt"
                  name="isTaxExempt"
                  checked={values?.isTaxExempt ?? false}
                  onChange={handleCheckedChange}
                />
              }
              label="Tax Exempt"
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  id="showOnHomepage"
                  name="showOnHomepage"
                  checked={values?.showOnHomepage ?? true}
                  onChange={handleCheckedChange}
                />
              }
              label="Show On Homepage"
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  id="isFreeShipping"
                  name="isFreeShipping"
                  checked={values?.isFreeShipping ?? false}
                  onChange={handleCheckedChange}
                />
              }
              label="Free Shipping"
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  id="allowCustomerReviews"
                  name="allowCustomerReviews"
                  checked={values?.allowCustomerReviews ?? true}
                  onChange={handleCheckedChange}
                />
              }
              label="Allow Customer Reviews"
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  id="disableBuyButton"
                  name="disableBuyButton"
                  checked={values?.disableBuyButton ?? false}
                  onChange={handleCheckedChange}
                />
              }
              label="Disable Buy Button"
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  id="disableWishlistButton"
                  name="disableWishlistButton"
                  checked={values?.disableWishlistButton ?? false}
                  onChange={handleCheckedChange}
                />
              }
              label="Disable Wishlist Button"
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  id="availableForPreOrder"
                  name="availableForPreOrder"
                  checked={values?.availableForPreOrder ?? false}
                  onChange={handleCheckedChange}
                />
              }
              label="Available For Pre Order"
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  id="callForPrice"
                  name="callForPrice"
                  checked={values?.callForPrice ?? false}
                  onChange={handleCheckedChange}
                />
              }
              label="Call For Price"
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  id="markAsNew"
                  name="markAsNew"
                  checked={values?.markAsNew ?? false}
                  onChange={handleCheckedChange}
                />
              }
              label="Mark As New"
            />
          </Stack>
        </Grid>
        {values?.markAsNew && <>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
            <Stack>
              <DateTimeInput
                name="markAsNewStartDateTimeUtc"
                label={t(fieldsName + 'markAsNewStartDateTimeUtc')}
                setFieldValue={setFieldValue}
                defaultValue={values?.markAsNewStartDateTimeUtc || ''}
                error={Boolean(errors.markAsNewStartDateTimeUtc)}
              />
              {errors.markAsNewStartDateTimeUtc && (
                <FormHelperText error id="helper-text">
                  {errors.markAsNewStartDateTimeUtc}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
            <Stack>
              <DateTimeInput
                name="markAsNewEndDateTimeUtc"
                label={t(fieldsName + 'markAsNewEndDateTimeUtc')}
                setFieldValue={setFieldValue}
                defaultValue={values?.markAsNewEndDateTimeUtc || ''}
                error={Boolean(errors.markAsNewEndDateTimeUtc)}
              />
              {errors.markAsNewEndDateTimeUtc && (
                <FormHelperText error id="helper-text">
                  {errors.markAsNewEndDateTimeUtc}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
        </>}
      </Grid>
    </Grid>
  );
}
