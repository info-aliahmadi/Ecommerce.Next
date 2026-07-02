'use client'
import { Avatar, Chip, FormHelperText, Grid, InputLabel, TextField, Stack } from '@mui/material';
import { EventNote } from '@mui/icons-material';

// assets
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';

import moment from 'moment';
import ImageUpload from '@dashboard/_components/FileUpload/ImageUpload';
import DateTimeInput from '@dashboard/_components/DateTime/DateTimeInput';
import SelectDeliveryDate from '../DeliveryDate/SelectDeliveryDate';
import SelectTaxCategory from '../TaxCategory/SelectTaxCategory';
import SelectProductAttribute from '../ProductAttribute/SelectProductAttribute';
import SelectCategory from '../Category/SelectCategory';
import SelectManufacturer from '../Manufacturer/SelectManufacturer';
import Editor from '@root/app/dashboard/_components/Editor/Editor';
import ProductsAutoComplete from './ProductAutoComplete';
import ProductModel from '../../_types/Product/ProductModel';
import nextIntlService from '@root/locales/nextIntlService';
import CurrencyInput from '@root/app/dashboard/_components/Currency/CurrencyInput';

export default function ProductBaseInfo({
  operation,
  values,
  handleBlur,
  handleChange,
  setFieldValue,
  errors
}:
  Readonly<{
    operation: string,
    values: ProductModel,
    handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    setFieldValue: (field: string, value: any) => void,
    errors: any
  }>) {
  const t = useTranslations("");
  let language = nextIntlService.getNextIntlLocale();

  const fieldsName = 'fields.product.';

  return (
    <Grid container columnSpacing={3} sx={{ alignItems: "flex-start" }} >
      <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 8, xl: 8 }}>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Stack>
            <TextField
              id="name"
              type="text"
              value={values?.name || ''}
              label={t(fieldsName + 'name')}
              name="name"
              onBlur={handleBlur}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.name)}
            />
            {errors.name && (
              <FormHelperText error id="helper-text">
                {errors.name}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Stack>
            <TextField
              id="shortDescription"
              name="shortDescription"
              type="text"
              value={values?.shortDescription || ''}
              label={t(fieldsName + 'shortDescription')}
              onBlur={handleBlur}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Stack>
            <Editor
              name='fullDescription'
              setFieldValue={setFieldValue}
              placeholder={t("fields.product.fullDescription")}
              locale={language}
            />
            {operation == 'edit' && (
              <Grid size={12}>
                {t(fieldsName + 'createdBy') + ' : '}
                <Chip
                  avatar={<Avatar src={CONFIG.AVATAR_BASEPATH + values.createUser?.avatar} />}
                  title={values.createUser?.name}
                  label={values.createUser?.userName}
                  variant="filled"
                  size="small"
                  sx={{ borderRadius: '16px' }}
                />{' '}
                <Chip
                  icon={<EventNote />}
                  title={t(fieldsName + 'createdOnUtc')}
                  label={values.createdOnUtc
                    ? new Intl.DateTimeFormat(language, {
                      dateStyle: 'long',
                      timeStyle: CONFIG.TIME_STYLE as "short" | "full" | "long" | "medium" | undefined,
                      hour12: false
                    }).format(moment(values.createdOnUtc).toDate()) : ''}
                  variant="filled"
                  size="small"
                  sx={{ borderRadius: '16px' }}
                />{' '}
                {values.updateUser?.userName && (
                  <span>
                    {t(fieldsName + 'editedBy') + ' : '}
                    <Chip
                      title={t(fieldsName + 'editor')}
                      avatar={<Avatar src={CONFIG.AVATAR_BASEPATH + values.updateUser?.avatar} />}
                      label={values.updateUser?.userName}
                      variant="filled"
                      size="small"
                      sx={{ borderRadius: '16px' }}
                    />{' '}
                    <Chip
                      icon={<EventNote />}
                      title={t(fieldsName + 'updatedOnUtc')}
                      label={values.updatedOnUtc
                        ? new Intl.DateTimeFormat(language, {
                          dateStyle: 'long',
                          timeStyle: CONFIG.TIME_STYLE as "short" | "full" | "long" | "medium" | undefined,
                          hour12: false
                        }).format(moment(values.updatedOnUtc).toDate()) : ''}
                      variant="filled"
                      size="small"
                      sx={{ borderRadius: '16px' }}
                    />{' '}
                  </span>
                )}
              </Grid>
            )}
            {errors.fullDescription && (
              <FormHelperText error id="helper-text">
                {errors.fullDescription}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
          <SelectDeliveryDate
            defaultValue={values?.deliveryDateType ?? null}
            id="deliveryDateType"
            label={t(fieldsName + 'deliveryDateId')}
            setFieldValue={setFieldValue}
            error={Boolean(errors.deliveryDateType)}
          />
          {errors.deliveryDateType && (
            <FormHelperText error id="helper-text">
              {errors.deliveryDateType}
            </FormHelperText>
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
          <SelectTaxCategory
            defaultValue={values?.taxCategoryId || undefined}
            id="taxCategoryId"
            name="taxCategoryId"
            label={t(fieldsName + 'taxCategoryId')}
            setFieldValue={setFieldValue}
            error={Boolean(errors.taxCategoryId)}
          />
          {errors.taxCategoryId && (
            <FormHelperText error id="helper-text">
              {errors.taxCategoryId}
            </FormHelperText>
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
          <Stack>
            <CurrencyInput
              id="sellUnitPrice"
              name="sellUnitPrice"
              label={t(fieldsName + 'sellUnitPrice')}
              fullWidth
              currencyType={CONFIG.DEFAULT_CURRENCY}
              value={values?.sellUnitPrice ?? values?.sellUnitPrice ?? 0}
              onChange={(v: any) => setFieldValue('sellUnitPrice', Number(v))}
              error={Boolean(errors.sellUnitPrice)}
            />
            {errors.sellUnitPrice && (
              <FormHelperText error id="helper-text">
                {errors.sellUnitPrice}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
          <Stack>
            <CurrencyInput
              id="oldSellUnitPrice"
              name="oldSellUnitPrice"
              label={t(fieldsName + 'oldSellUnitPrice')}
              fullWidth
              currencyType={CONFIG.DEFAULT_CURRENCY}
              value={values?.oldSellUnitPrice ?? values?.oldSellUnitPrice ?? 0}
              onChange={(v: any) => setFieldValue('oldSellUnitPrice', Number(v))}
              error={Boolean(errors.oldSellUnitPrice)}
            />
            {errors.oldSellUnitPrice && (
              <FormHelperText error id="helper-text">
                {errors.oldSellUnitPrice}
              </FormHelperText>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
          <Stack>
            <SelectCategory
              defaultValues={values?.categoryIds || []}
              id="categoryIds"
              name="categoryIds"
              label={t(fieldsName + 'categoryIds')}
              setFieldValue={setFieldValue}
              error={Boolean(errors.categoryIds)}
            />
            {errors.categoryIds && (
              <FormHelperText error id="helper-text">
                {errors.categoryIds}
              </FormHelperText>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
          <Stack>
            <SelectManufacturer
              defaultValues={values?.manufacturerIds || []}
              id="manufacturerIds"
              name="manufacturerIds"
              label={t(fieldsName + 'manufacturerIds')}
              setFieldValue={setFieldValue}
              error={Boolean(errors.manufacturerIds)}
            />
            {errors.manufacturerIds && (
              <FormHelperText error id="helper-text">
                {errors.manufacturerIds}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
          <Stack>
            <DateTimeInput
              name="availableStartDateTimeUtc"
              label={t(fieldsName + 'availableStartDateTimeUtc')}
              setFieldValue={setFieldValue}
              defaultValue={values?.availableStartDateTimeUtc || undefined}
              error={Boolean(errors.availableStartDateTimeUtc)}
            />
            {errors.availableStartDateTimeUtc && (
              <FormHelperText error id="helper-text">
                {errors.availableStartDateTimeUtc}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
          <Stack>
            <DateTimeInput
              name="availableEndDateTimeUtc"
              label={t(fieldsName + 'availableEndDateTimeUtc')}
              setFieldValue={setFieldValue}
              defaultValue={values?.availableEndDateTimeUtc || undefined}
              error={Boolean(errors.availableEndDateTimeUtc)}
            />
            {errors.availableEndDateTimeUtc && (
              <FormHelperText error id="helper-text">
                {errors.availableEndDateTimeUtc}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Stack>
            <SelectProductAttribute
              defaultValues={values?.attributeIds || []}
              id="attributeIds"
              name="attributeIds"
              label={t(fieldsName + 'attributeIds')}
              setFieldValue={setFieldValue}
              error={Boolean(errors.attributeIds)}
              disabled={false}
            />
            {errors.attributeIds && (
              <FormHelperText error id="helper-text">
                {errors.attributeIds}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Stack>
            <ProductsAutoComplete
              id="relatedProductIds"
              name="relatedProductIds"
              defaultValues={values?.relatedProductIds || []}
              label={t(fieldsName + 'relatedProductIds')}
              setFieldValue={setFieldValue}
            />
            {errors.relatedProductIds && (
              <FormHelperText error id="helper-text">
                {errors.relatedProductIds}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4, xl: 4 }}>
        <Stack>
          <InputLabel htmlFor="picturePreviewId" sx={{ textAlign: 'center', mb: '5px' }}>{t(fieldsName + 'picturePreviewId')}</InputLabel>
          <ImageUpload
            name="picturePreviewId"
            setFieldValue={setFieldValue}
            value={values?.picturePreviewId || null}
            filePosterMaxHeight={200}
            allowMultiple={false}
          />
          {errors.picturePreviewId && (
            <FormHelperText error id="helper-text">
              {errors.picturePreviewId}
            </FormHelperText>
          )}
        </Stack>
        <Stack>
          <InputLabel htmlFor="pictureIds" sx={{ textAlign: 'center', mb: '5px' }}>{t(fieldsName + 'pictureIds')}</InputLabel>
          <ImageUpload
            name="pictureIds"
            setFieldValue={setFieldValue}
            value={values?.pictureIds || []}
            filePosterMaxHeight={200}
            allowMultiple={true}
          />
        </Stack>
      </Grid>
    </Grid>
  );
}
