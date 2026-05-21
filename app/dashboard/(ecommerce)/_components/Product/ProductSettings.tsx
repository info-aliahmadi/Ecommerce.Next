// material-ui
import { FormHelperText, Grid, Stack } from '@mui/material';

// assets
import { useTranslations } from 'next-intl';

// import Editor from '@dashboard/_components/Editor/Editor';
import DateTimeInput from '@dashboard/_components/DateTime/DateTimeInput';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function ProductSettings({ operation, values, setFieldValue, handleBlur, handleChange, errors, touched }:
  {
    operation: 'add' | 'edit', values: any, setFieldValue: (field: string, value: any) => void, handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void, errors: any, touched: any
  }) {
  const t = useTranslations("");
  const fieldsName = 'fields.product.';
  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(event.target.id, event.target.checked);
  };
  return (
    <Grid container columnSpacing={3}>
      <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 8, xl: 8}}>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  id="hasDiscountsApplied"
                  name="hasDiscountsApplied"
                  checked={values?.hasDiscountsApplied != undefined ? values?.hasDiscountsApplied : false}
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
                  checked={values?.notReturnable != undefined ? values?.notReturnable : true}
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
                  checked={values?.isTaxExempt != undefined ? values?.isTaxExempt : false}
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
                  checked={values?.showOnHomepage != undefined ? values?.showOnHomepage : true}
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
                  checked={values?.isFreeShipping != undefined ? values?.isFreeShipping : false}
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
                  checked={values?.allowCustomerReviews != undefined ? values?.allowCustomerReviews : true}
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
                  checked={values?.disableBuyButton != undefined ? values?.disableBuyButton : false}
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
                  checked={values?.disableWishlistButton != undefined ? values?.disableWishlistButton : false}
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
                  checked={values?.availableForPreOrder != undefined ? values?.availableForPreOrder : false}
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
                  checked={values?.callForPrice != undefined ? values?.callForPrice : false}
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
                  checked={values?.markAsNew != undefined ? values?.markAsNew : false}
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
                id="markAsNewStartDateTimeUtc"
                name="markAsNewStartDateTimeUtc"
                label={t(fieldsName + 'markAsNewStartDateTimeUtc')}
                setFieldValue={setFieldValue}
                placeholder={t(fieldsName + 'markAsNewStartDateTimeUtc')}
                defaultValue={values?.markAsNewStartDateTimeUtc || ''}
                error={Boolean(touched.markAsNewStartDateTimeUtc && errors.markAsNewStartDateTimeUtc)}
              />
              {touched.markAsNewStartDateTimeUtc && errors.markAsNewStartDateTimeUtc && (
                <FormHelperText error id="helper-text">
                  {errors.markAsNewStartDateTimeUtc}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
            <Stack>
              <DateTimeInput
                id="markAsNewEndDateTimeUtc"
                name="markAsNewEndDateTimeUtc"
                label={t(fieldsName + 'markAsNewEndDateTimeUtc')}
                setFieldValue={setFieldValue}
                placeholder={t(fieldsName + 'markAsNewEndDateTimeUtc')}
                defaultValue={values?.markAsNewEndDateTimeUtc || ''}
                error={Boolean(touched.markAsNewEndDateTimeUtc && errors.markAsNewEndDateTimeUtc)}
              />
              {touched.markAsNewEndDateTimeUtc && errors.markAsNewEndDateTimeUtc && (
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
