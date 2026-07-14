// material-ui
import {
  FormHelperText,
  Grid,
  TextField,
  Stack,
  Divider,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse
} from '@mui/material';
import { Add, Delete, ExpandMore, ExpandLess } from '@mui/icons-material';

// assets
import { useTranslations } from 'next-intl';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ProductModel from '../../_types/Product/ProductModel';
import ProductVariantModel from '../../_types/Product/ProductVariantModel';
import InventoryModel from '../../_types/Product/InventoryModel';
import ProductAttributeModel from '../../_types/Product/ProductAttributeModel';
import { useState } from 'react';
import CurrencyInput from '@root/app/dashboard/_components/Currency/CurrencyInput';
import CONFIG from '@root/config';
import SelectMeasureType from '../MeasureType/SelectMeasureType';
import SelectProductAttribute from '../ProductAttribute/SelectProductAttribute';

interface ProductInventoryProps {
  operation: 'add' | 'edit',
  values: ProductModel,
  setFieldValue: (field: string, value: any) => void,
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  errors: any,
}

const fullWidthGridSize = { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 };

interface VariantCardProps {
  variant: ProductVariantModel;
  index: number;
  onRemove: (index: number) => void;
  onFieldChange: (index: number, field: string, value: any) => void;
  onInventoryChange: (index: number, field: keyof InventoryModel, value: any) => void;
  onAttributesChange: (index: number, attributes: ProductAttributeModel[]) => void;
  fieldsName: string;
  t: any;
}

function VariantCard({
  variant,
  index,
  onRemove,
  onFieldChange,
  onInventoryChange,
  onAttributesChange,
  fieldsName,
  t
}: VariantCardProps) {
  const [expanded, setExpanded] = useState(true);

  const handleAttributeSelect = (event: any, options: any) => {
    const selectedIds = event.target.value as number[];
    const newAttributes: ProductAttributeModel[] = selectedIds.map((id) => {
      const existing = variant.productAttributes?.find((a) => a.id === id);
      if (existing) return existing;
      const option = options.find((o: any) => o.id === id);
      return {
        id: option.id,
        name: option.name,
        value: option.value || '',
        attributeType: option.attributeType || 0,
        imagePreviewId: null,
        displayOrder: 0,
        description: null,
        showOnHomepage: false
      };
    });
    onAttributesChange(index, newAttributes);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <Typography variant="subtitle1" fontWeight="bold">
              {variant.sku || `Variant ${index + 1}`}
            </Typography>
          </Stack>
          <IconButton color="error" size="small" onClick={() => onRemove(index)}>
            <Delete />
          </IconButton>
        </Stack>

        <Collapse in={expanded}>
          <Grid container spacing={2}>
            {/* SKU */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                size="small"
                label={t(fieldsName + 'sku')}
                value={variant.sku || ''}
                onChange={(e) => onFieldChange(index, 'sku', e.target.value)}
                fullWidth
              />
            </Grid>

            {/* Sell Price */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <CurrencyInput
                size="small"
                id={`sellPrice-${index}`}
                name={`sellPrice-${index}`}
                label={t(fieldsName + 'sellUnitPrice')}
                value={variant.sellPrice || 0}
                onChange={(value) => onFieldChange(index, 'sellPrice', value)}
                currencyType={CONFIG.DEFAULT_CURRENCY}
                fullWidth
              />
            </Grid>

            {/* Old Sell Price */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <CurrencyInput
                size="small"
                id={`oldSellPrice-${index}`}
                name={`oldSellPrice-${index}`}
                label={t(fieldsName + 'oldSellUnitPrice')}
                value={variant.oldSellPrice || 0}
                onChange={(value) => onFieldChange(index, 'oldSellPrice', value)}
                currencyType={CONFIG.DEFAULT_CURRENCY}
                fullWidth
              />
            </Grid>

            {/* Attributes */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <SelectProductAttribute
                defaultValues={variant.productAttributes?.map((a) => a.id) || []}
                id={`variantAttributes-${index}`}
                name={`variantAttributes-${index}`}
                label={t(fieldsName + 'attributeIds')}
                setFieldValue={(field, value) => {
                  // Simulate event for compatibility
                  handleAttributeSelect({ target: { value } }, []);
                }}
                onChange={handleAttributeSelect}
                error={false}
                disabled={false}
              />
            </Grid>

            {/* Inventory Section */}
            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                Inventory
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                size="small"
                type="number"
                label={t(fieldsName + 'inventory.stockQuantity')}
                value={variant.productInventory?.stockQuantity || ''}
                onChange={(e) => onInventoryChange(index, 'stockQuantity', parseFloat(e.target.value) || 0)}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                size="small"
                type="number"
                label={t(fieldsName + 'inventory.reservedQuantity')}
                value={variant.productInventory?.reservedQuantity || 0}
                onChange={(e) => onInventoryChange(index, 'reservedQuantity', parseFloat(e.target.value) || 0)}
                fullWidth
              />
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default function ProductInventory({ operation, values, setFieldValue, handleBlur, handleChange, errors }:
  Readonly<ProductInventoryProps>) {
  const t = useTranslations("");
  const fieldsName = 'fields.product.';
  const variantsError = errors?.variants;

  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(event.target.id, event.target.checked);
  };

  const addVariant = () => {
    const newVariant: ProductVariantModel = {
      id: 0,
      sku: '',
      productId: values.id || 0,
      sellPrice: 0,
      oldSellPrice: 0,
      productInventory: {
        id: 0,
        variantId: 0,
        stockQuantity: 0,
        reservedQuantity: 0
      },
      productAttributes: []
    };
    const updatedVariants = [...(values.variants || []), newVariant];
    setFieldValue('variants', updatedVariants);
  };

  const removeVariant = (index: number) => {
    const updatedVariants = values.variants.filter((_, i) => i !== index);
    setFieldValue('variants', updatedVariants);
  };

  const handleVariantFieldChange = (index: number, field: string, value: any) => {
    const updatedVariants = values.variants.map((variant, i) => {
      if (i === index) {
        return { ...variant, [field]: value };
      }
      return variant;
    });
    setFieldValue('variants', updatedVariants);
  };

  const handleInventoryChange = (index: number, field: keyof InventoryModel, value: any) => {
    const updatedVariants = values.variants.map((variant, i) => {
      if (i === index) {
        return {
          ...variant,
          productInventory: {
            ...variant.productInventory,
            [field]: value
          }
        };
      }
      return variant;
    });
    setFieldValue('variants', updatedVariants);
  };

  const handleAttributesChange = (index: number, attributes: ProductAttributeModel[]) => {
    const updatedVariants = values.variants.map((variant, i) => {
      if (i === index) {
        return { ...variant, productAttributes: attributes };
      }
      return variant;
    });
    setFieldValue('variants', updatedVariants);
  };

  return (
    <Grid container spacing={3}>
      <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 10, xl: 8 }}>
        <Grid container size={fullWidthGridSize}>
          <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
            <Stack>
              <SelectMeasureType
                defaultValue={values.measureType}
                id="measureType"
                setFieldValue={setFieldValue}
                error={Boolean(errors.measureType)}
                label={t(fieldsName + 'measureType')}
              />
            </Stack>
          </Grid>
        </Grid>
      </Grid>

      <Grid container size={{ xs: 12, sm: 12, md: 12, lg: 10, xl: 8 }}>
        {/* Variant List */}
        {values.variants?.map((variant, index) => (
          <Grid size={12} key={variant.id || index}>
            <VariantCard
              variant={variant}
              index={index}
              onRemove={removeVariant}
              onFieldChange={handleVariantFieldChange}
              onInventoryChange={handleInventoryChange}
              onAttributesChange={handleAttributesChange}
              fieldsName={fieldsName}
              t={t}
            />
          </Grid>
        ))}

        {/* Add Variant Button */}
        <Grid size={12}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addVariant}
            fullWidth
          >
            Add Variant
          </Button>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          {variantsError ? (
            <FormHelperText error id="variants-helper-text">
              {variantsError}
            </FormHelperText>
          ) : null}
        </Grid>
      </Grid>

      <Divider />

      <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
        <Grid size={12}>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  id="notifyAdminForQuantityBelow"
                  name="notifyAdminForQuantityBelow"
                  checked={values?.notifyAdminForQuantityBelow ?? false}
                  onChange={handleCheckedChange}
                />
              }
              label={t(fieldsName + "notifyAdminForQuantityBelow")}
            />
          </Stack>
        </Grid>
        <Grid size={8} sx={{ display: values?.notifyAdminForQuantityBelow ? 'block' : 'none' }}>
          <Stack>
            <TextField
              id="minStockQuantity"
              name="minStockQuantity"
              type="number"
              value={values?.minStockQuantity || ''}
              label={t(fieldsName + 'minStockQuantity')}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder={t(fieldsName + 'minStockQuantity')}
              fullWidth
              error={Boolean(errors.minStockQuantity)}
            />
            {errors.minStockQuantity && (
              <FormHelperText error id="helper-text">
                {errors.minStockQuantity}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
        <Grid size={12}>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  id="allowedQuantities"
                  name="allowedQuantities"
                  checked={values?.allowedQuantities ?? true}
                  onChange={handleCheckedChange}
                />
              }
              label={t(fieldsName + "allowedQuantities")}
            />
          </Stack>
        </Grid>
        <Grid size={8} sx={{ display: values?.allowedQuantities ? 'block' : 'none' }}>
          <Stack>
            <TextField
              id="orderMinimumQuantity"
              name="orderMinimumQuantity"
              type="number"
              value={values?.orderMinimumQuantity || ''}
              label={t(fieldsName + 'orderMinimumQuantity')}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder={t(fieldsName + 'orderMinimumQuantity')}
              fullWidth
              error={Boolean(errors.orderMinimumQuantity)}
            />
            {errors.orderMinimumQuantity && (
              <FormHelperText error id="helper-text">
                {errors.orderMinimumQuantity}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid size={8} sx={{ display: values?.allowedQuantities ? 'block' : 'none', pt: 2 }}>
          <Stack>
            <TextField
              id="orderMaximumQuantity"
              name="orderMaximumQuantity"
              type="number"
              value={values?.orderMaximumQuantity || ''}
              label={t(fieldsName + 'orderMaximumQuantity')}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder={t(fieldsName + 'orderMaximumQuantity')}
              fullWidth
              error={Boolean(errors.orderMaximumQuantity)}
            />
            {errors.orderMaximumQuantity && (
              <FormHelperText error id="helper-text">
                {errors.orderMaximumQuantity}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
        <Stack>
          <FormControlLabel
            control={
              <Switch
                id="displayStockQuantity"
                name="displayStockQuantity"
                checked={values?.displayStockQuantity ?? false}
                onChange={handleCheckedChange}
              />
            }
            label={t(fieldsName + "displayStockQuantity")}
          />
        </Stack>
      </Grid>
    </Grid >
  );
}
