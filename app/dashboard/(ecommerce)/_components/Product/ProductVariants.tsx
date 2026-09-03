import {  Grid, TextField, Stack, Button, Typography, Divider, IconButton, Paper, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Add, Delete } from '@mui/icons-material';
import SelectProductAttribute from '../ProductAttribute/SelectProductAttribute';
import ProductModel from '../../_types/Product/ProductModel';
import ProductVariantModel from '../../_types/Product/ProductVariantModel';
import InventoryModel from '../../_types/Product/InventoryModel';
import ProductAttributeModel from '../../_types/Product/ProductAttributeModel';
import ProductAttributeService from '../../_service/ProductAttributeService';
import AttributeType from '@root/app/types/enums/AttributeType';
import CurrencyInput from '@root/app/dashboard/_components/Currency/CurrencyInput';
import CONFIG from '@root/config';

interface ProductVariantsProps {
  operation: 'add' | 'edit';
  values: ProductModel;
  setFieldValue: (field: string, value: any) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  errors: any;
}

export default function ProductVariants({ operation, values, setFieldValue, handleBlur, errors }: ProductVariantsProps) {
  const t = useTranslations('');
  const fieldsName = 'fields.';
  const variants = values.variants || [];
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const productAttributeService = new ProductAttributeService(jwt ?? '');

  const [allAttributes, setAllAttributes] = useState<ProductAttributeModel[]>([]);

  useEffect(() => {
    productAttributeService.getProductAttributeListForSelect().then((result) => {
      if (result.succeeded && result.data) {
        setAllAttributes(result.data);
      }
    });
  }, []);

  const createDefaultVariant = (): ProductVariantModel => ({
    id: 0,
    sku: values.sku || '',
    productId: values.id || 0,
    sellPrice: 0,
    oldSellPrice: 0,
    productInventory: {
      id: 0,
      variantId: 0,
      stockQuantity: 0,
      reservedQuantity: 0,
    },
    productAttributes: [],
  });

  const generateVariantSku = (attributes: ProductAttributeModel[]): string => {
    const baseSku = values.sku || '';
    const sizeAttr = attributes.find((a) => a.attributeType === AttributeType.Size);
    const colorAttr = attributes.find((a) => a.attributeType === AttributeType.Color);
    const patternAttr = attributes.find((a) => a.attributeType === AttributeType.Pattern);
    const materialAttr = attributes.find((a) => a.attributeType === AttributeType.Material);
    const heightAttr = attributes.find((a) => a.attributeType === AttributeType.Height);
    const widthAttr = attributes.find((a) => a.attributeType === AttributeType.Width);
    const lengthAttr = attributes.find((a) => a.attributeType === AttributeType.Length);
    const weightAttr = attributes.find((a) => a.attributeType === AttributeType.Weight);
    const brandAttr = attributes.find((a) => a.attributeType === AttributeType.Brand);
    const modelAttr = attributes.find((a) => a.attributeType === AttributeType.Model);

    const parts = [baseSku];
    if (sizeAttr?.key) parts.push(sizeAttr.key);
    if (colorAttr?.key) parts.push(colorAttr.key);
    if (patternAttr?.key) parts.push(patternAttr.key);
    if (materialAttr?.key) parts.push(materialAttr.key);
    if (heightAttr?.key) parts.push(heightAttr.key);
    if (widthAttr?.key) parts.push(widthAttr.key);
    if (weightAttr?.key) parts.push(weightAttr.key);
    if (brandAttr?.key) parts.push(brandAttr.key);
    if (modelAttr?.key) parts.push(modelAttr.key);

    return parts.join('-');
  };

  const handleAddVariant = () => {
    const newVariant = createDefaultVariant();
    setFieldValue('variants', [...variants, newVariant]);
  };

  const handleRemoveVariant = (index: number) => {
    const updated = variants.filter((_: any, i: number) => i !== index);
    setFieldValue('variants', updated);
  };

  const handleVariantFieldChange = (index: number, field: keyof ProductVariantModel, value: any) => {
    const updated = variants.map((v: ProductVariantModel, i: number) => {
      if (i !== index) return v;
      return { ...v, [field]: value };
    });
    setFieldValue('variants', updated);
  };

  const handleInventoryChange = (index: number, field: keyof InventoryModel, value: number) => {
    const updated = variants.map((v: ProductVariantModel, i: number) => {
      if (i !== index) return v;
      return {
        ...v,
        productInventory: {
          ...v.productInventory,
          [field]: value,
        },
      };
    });
    setFieldValue('variants', updated);
  };

  const handleAttributeSelectChange = (variantIndex: number, event: any, options: any) => {
    const selectedIds = event.target.value as number[];

    const updatedVariants = variants.map((v: ProductVariantModel, i: number) => {
      if (i !== variantIndex) return v;

      const newAttributes = selectedIds.map((attrId: number) => {
        const existing = v.productAttributes.find((a: ProductAttributeModel) => a.id === attrId);
        if (existing) return existing;

        const attrData = allAttributes.find((a) => a.id === attrId);
        return {
          id: attrId,
          displayName: attrData?.displayName || '',
          key: attrData?.key || '',
          attributeType: attrData?.attributeType || 0,
          imagePreviewId: attrData?.imagePreviewId || null,
          displayOrder: attrData?.displayOrder || 0,
          description: attrData?.description || null,
          showOnHomepage: attrData?.showOnHomepage || false,
        };
      });

      return { ...v, productAttributes: newAttributes, sku: generateVariantSku(newAttributes) };
    });

    setFieldValue('variants', updatedVariants);
  };

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }} >
          {/* <Typography variant="h6">{t(fieldsName + 'product.variants.title')}</Typography> */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddVariant}
            color="primary"
          >
            {t('buttons.product.variants.addVariant')}
          </Button>
        </Stack>
      </Grid>

      {variants.length === 0 && (
        <Grid size={12}>
          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {t(fieldsName + 'product.variants.noVariants')}
            </Typography>
          </Paper>
        </Grid>
      )}

      {variants.map((variant: ProductVariantModel, index: number) => (
        <Grid size={12} key={variant.id || index}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {t(fieldsName + 'product.variants.variant',{ index: index + 1 })}
                {variant.sku && ` - ${variant.sku}`}
              </Typography>
              <IconButton
                color="error"
                onClick={() => handleRemoveVariant(index)}
                size="small"
              >
                <Delete />
              </IconButton>
            </Stack>

            {/* Attributes */}
            <Grid size={12} sx={{ mt: 2 }}>
              <SelectProductAttribute
                defaultValues={variant.productAttributes?.map((a: ProductAttributeModel) => a.id) || []}
                id={`variant-attributes-${index}`}
                name={`variant-attributes-${index}`}
                label={t(fieldsName + 'product.variants.attributeIds')}
                onChange={(event: any, options: any) => handleAttributeSelectChange(index, event, options)}
                error={false}
                disabled={false}
              />
              {variant.productAttributes.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                  {variant.productAttributes.map((attr: ProductAttributeModel) => (
                    <Chip
                      key={attr.id}
                      label={`${attr.displayName}: ${attr.key}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              )}
              
              <Divider sx={{ mb: 2, pt: 2 }} />
            </Grid>
            <Grid container size={12} columns={{ xs: 4, sm: 8, md: 12, lg: 15, xl: 15 }} spacing={2}>
              {/* SKU */}
              <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl : 3 }}>
                <TextField
                  name={`variant-sku-${index}`}
                  label={t(fieldsName + 'product.variants.sku')}
                  value={variant.sku || ''}
                  onChange={(e) => handleVariantFieldChange(index, 'sku', e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>

              {/* Sell Price */}
              <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl : 3 }}>
                <CurrencyInput
                  id={`variant-sellPrice-${index}`}
                  name={`variant-sellPrice-${index}`}
                  value={variant.sellPrice || 0}
                  label={t(fieldsName + 'product.variants.sellPrice')}
                  fullWidth
                  currencyType={CONFIG.DEFAULT_CURRENCY}
                  onChange={(value: number) => handleVariantFieldChange(index, 'sellPrice', value)}
                />
              </Grid>

              {/* Old Sell Price */}
              <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl : 3 }}>
                <CurrencyInput
                  id={`variant-oldSellPrice-${index}`}
                  name={`variant-oldSellPrice-${index}`}
                  value={variant.oldSellPrice || 0}
                  label={t(fieldsName + 'product.variants.oldSellPrice')}
                  fullWidth
                  currencyType={CONFIG.DEFAULT_CURRENCY}
                  onChange={(value: number) => handleVariantFieldChange(index, 'oldSellPrice', value)}
                />
              </Grid>

              {/* Stock Quantity */}
              <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl : 3 }}>
                <TextField
                  name={`variant-stockQuantity-${index}`}
                  label={t(fieldsName + 'product.variants.inventory.stockQuantity')}
                  type="number"
                  value={variant.productInventory?.stockQuantity || ''}
                  onChange={(e) => handleInventoryChange(index, 'stockQuantity', parseFloat(e.target.value) || 0)}
                  fullWidth
                  size="small"
                />
              </Grid>

              {/* Reserved Quantity */}
              <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl : 3 }}>
                <TextField
                  name={`variant-reservedQuantity-${index}`}
                  label={t(fieldsName + 'product.variants.inventory.reservedQuantity')}
                  type="number"
                  value={variant.productInventory?.reservedQuantity || ''}
                  onChange={(e) => handleInventoryChange(index, 'reservedQuantity', parseFloat(e.target.value) || 0)}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>

          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
