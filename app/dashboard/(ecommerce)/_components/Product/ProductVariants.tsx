import { FormHelperText, Grid, TextField, Stack, Button, Typography, Divider, IconButton, Paper, Box, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Add, Delete } from '@mui/icons-material';
import SelectProductAttribute from '../ProductAttribute/SelectProductAttribute';
import ProductModel from '../../_types/Product/ProductModel';
import ProductVariantModel from '../../_types/Product/ProductVariantModel';
import InventoryModel from '../../_types/Product/InventoryModel';
import ProductAttributeModel from '../../_types/Product/ProductAttributeModel';
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
  const fieldsName = 'fields.product.';
  const variants = values.variants || [];

  const createDefaultVariant = (): ProductVariantModel => ({
    id: 0,
    sku: '',
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

  const handleAttributeChange = (variantIndex: number, attributeId: number, attributeData: { name: string; value: string; attributeType: number; imagePreviewId: number | null; displayOrder: number; description: string | null; showOnHomepage: boolean }) => {
    const updated = variants.map((v: ProductVariantModel, i: number) => {
      if (i !== variantIndex) return v;

      const existingIndex = v.productAttributes.findIndex((a: ProductAttributeModel) => a.id === attributeId);
      let newAttributes: ProductAttributeModel[];

      if (existingIndex >= 0) {
        newAttributes = v.productAttributes.filter((_: any, idx: number) => idx !== existingIndex);
      } else {
        const newAttr: ProductAttributeModel = {
          id: attributeId,
          name: attributeData.name,
          value: attributeData.value,
          attributeType: attributeData.attributeType,
          imagePreviewId: attributeData.imagePreviewId,
          displayOrder: attributeData.displayOrder,
          description: attributeData.description,
          showOnHomepage: attributeData.showOnHomepage,
        };
        newAttributes = [...v.productAttributes, newAttr];
      }

      return { ...v, productAttributes: newAttributes };
    });
    setFieldValue('variants', updated);
  };

  const handleAttributeSelectChange = (variantIndex: number, event: any, options: any) => {
    const selectedIds = event.target.value as number[];
    const variant = variants[variantIndex];

    const updatedVariants = variants.map((v: ProductVariantModel, i: number) => {
      if (i !== variantIndex) return v;

      const newAttributes = selectedIds.map((attrId: number) => {
        const existing = v.productAttributes.find((a: ProductAttributeModel) => a.id === attrId);
        if (existing) return existing;

        const option = options.find((o: any) => o.id === attrId);
        return {
          id: attrId,
          name: option?.name || '',
          value: option?.value || '',
          attributeType: option?.attributeType || 0,
          imagePreviewId: option?.imagePreviewId || null,
          displayOrder: option?.displayOrder || 0,
          description: option?.description || null,
          showOnHomepage: option?.showOnHomepage || false,
        };
      });

      return { ...v, productAttributes: newAttributes };
    });

    setFieldValue('variants', updatedVariants);
  };

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }} >
          <Typography variant="h6">{t(fieldsName + 'variants.title')}</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddVariant}
            color="primary"
          >
            {t(fieldsName + 'variants.addVariant')}
          </Button>
        </Stack>
      </Grid>

      {variants.length === 0 && (
        <Grid size={12}>
          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {t(fieldsName + 'variants.noVariants')}
            </Typography>
          </Paper>
        </Grid>
      )}

      {variants.map((variant: ProductVariantModel, index: number) => (
        <Grid size={12} key={variant.id || index}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {t(fieldsName + 'variants.variant')} #{index + 1}
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

            <Grid container spacing={2}>
              {/* SKU */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  name={`variant-sku-${index}`}
                  label={t(fieldsName + 'sku')}
                  value={variant.sku || ''}
                  onChange={(e) => handleVariantFieldChange(index, 'sku', e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>

              {/* Sell Price */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <CurrencyInput
                  id={`variant-sellPrice-${index}`}
                  name={`variant-sellPrice-${index}`}
                  value={variant.sellPrice || 0}
                  label={t(fieldsName + 'sellPrice')}
                  fullWidth
                  currencyType={CONFIG.DEFAULT_CURRENCY}
                  onChange={(value: number) => handleVariantFieldChange(index, 'sellPrice', value)}
                />
              </Grid>

              {/* Old Sell Price */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <CurrencyInput
                  id={`variant-oldSellPrice-${index}`}
                  name={`variant-oldSellPrice-${index}`}
                  value={variant.oldSellPrice || 0}
                  label={t(fieldsName + 'oldSellPrice')}
                  fullWidth
                  currencyType={CONFIG.DEFAULT_CURRENCY}
                  onChange={(value: number) => handleVariantFieldChange(index, 'oldSellPrice', value)}
                />
              </Grid>

              {/* Stock Quantity */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  name={`variant-stockQuantity-${index}`}
                  label={t(fieldsName + 'inventory.stockQuantity')}
                  type="number"
                  value={variant.productInventory?.stockQuantity || ''}
                  onChange={(e) => handleInventoryChange(index, 'stockQuantity', parseFloat(e.target.value) || 0)}
                  fullWidth
                  size="small"
                />
              </Grid>

              {/* Reserved Quantity */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  name={`variant-reservedQuantity-${index}`}
                  label={t(fieldsName + 'inventory.reservedQuantity')}
                  type="number"
                  value={variant.productInventory?.reservedQuantity || ''}
                  onChange={(e) => handleInventoryChange(index, 'reservedQuantity', parseFloat(e.target.value) || 0)}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>

            {/* Attributes */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <SelectProductAttribute
                defaultValues={variant.productAttributes?.map((a: ProductAttributeModel) => a.id) || []}
                id={`variant-attributes-${index}`}
                name={`variant-attributes-${index}`}
                label={t(fieldsName + 'attributeIds')}
                onChange={(event: any, options: any) => handleAttributeSelectChange(index, event, options)}
                setFieldValue={setFieldValue}
                error={false}
                disabled={false}
              />
              {variant.productAttributes.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                  {variant.productAttributes.map((attr: ProductAttributeModel) => (
                    <Chip
                      key={attr.id}
                      label={`${attr.name}: ${attr.value}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              )}
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
