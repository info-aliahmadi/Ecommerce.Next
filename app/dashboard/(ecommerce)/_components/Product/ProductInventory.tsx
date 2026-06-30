// material-ui
import { FormHelperText, Grid, TextField, Stack, Divider } from '@mui/material';

// assets
import { useTranslations } from 'next-intl';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ProductAttributeInventory from './ProductAttributeInventory';
import ProductModel, { StockType } from '../../_types/Product/ProductModel';
import { useState } from 'react';
import InventoryModel from '../../_types/Product/InventoryModel';
import CurrencyInput from '@root/app/dashboard/_components/Currency/CurrencyInput';
import CONFIG from '@root/config';
import SelectMeasureType from '../MeasureType/SelectMeasureType';
interface ProductInventoryProps {
  operation: 'add' | 'edit',
  values: ProductModel,
  setFieldValue: (field: string, value: any) => void,
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  errors: any,
}

const fullWidthGridSize = { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 };

export default function ProductInventory({ operation, values, setFieldValue, handleBlur, handleChange, errors }:
  Readonly<ProductInventoryProps>) {
  const t = useTranslations("");
  const [isAttributeView, setIsAttributeView] = useState(values.stockType === StockType.PerAttribute);

  const fieldsName = 'fields.product.';
  const inventoryError = errors?.inventories;
  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(event.target.id, event.target.checked);
    console.log(event.target.id, event.target.checked);
  };
  const handleViewToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAttributeView(event.target.checked);
    setFieldValue('stockType', event.target.checked ? StockType.PerAttribute : StockType.Total);
    setFieldValue('inventories', []);
  }

  // Function to render Total Inventory fields
  const renderTotalInventoryFields = () => {
    // Function to render Total Inventory fields
    const handleInventoryFieldChange = (field: keyof InventoryModel, value: any) => {

      let updatedInventories: InventoryModel[] = [];

      if (!values.inventories || values.inventories.length === 0) {
        // Case 1: Initial creation of the inventory item array
        updatedInventories = [{
          id: 0,
          productId: values.id || 0,
          attributeId: undefined,
          attributeName: undefined,
          [field]: value
        } as InventoryModel];
      } else {
        // Case 2: Update existing inventory item immutably
        const currentInventories = values.inventories;
        updatedInventories = [
          {
            ...currentInventories[0], // Copy all properties of the first item
            [field]: value,       // Overwrite the specific field with the new value
          },
          ...currentInventories.slice(1) // Keep the rest of the array elements unchanged
        ];
      }
      setFieldValue('inventories', updatedInventories);
    };
    return (
      <>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 3, xl: 3 }}>
          <Stack>
            <TextField
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              value={values.inventories[0]?.stockQuantity || ''}
              label={t(fieldsName + 'inventory.stockQuantity')}
              onChange={(event) => handleInventoryFieldChange('stockQuantity', parseFloat(event.target.value) || 0)}
              placeholder={t(fieldsName + 'inventory.stockQuantity')}
              fullWidth
              error={Boolean(inventoryError)}
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 3, xl: 3 }}>
          <Stack>
            <TextField
              id="reservedQuantity"
              name="reservedQuantity"
              type="number"
              value={values.inventories[0]?.reservedQuantity || 0}
              label={t(fieldsName + 'inventory.reservedQuantity')}
              onBlur={handleBlur}
              onChange={(event) => handleInventoryFieldChange('reservedQuantity', parseFloat(event.target.value) || 0)}
              placeholder={t(fieldsName + 'inventory.reservedQuantity')}
              fullWidth
            />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 3, xl: 3 }}>
          <Stack>
            <CurrencyInput
              id="buyUnitPrice"
              name="buyUnitPrice"
              value={values.inventories[0]?.buyUnitPrice || 0}
              label={t(fieldsName + 'inventory.buyUnitPrice')}
              fullWidth
              currencyType={CONFIG.DEFAULT_CURRENCY}
              placeholder={t(fieldsName + 'inventory.buyUnitPrice')}
              onChange={(value) => handleInventoryFieldChange('buyUnitPrice', value)}
            />

          </Stack>
        </Grid>
      </>)
  };

  // Function to render Attribute Inventory section (which contains its own components)
  const renderAttributeInventorySection = () => {
    return (
      <ProductAttributeInventory setFieldValue={setFieldValue} values={values} />
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 10, xl: 8 }}>
        <Grid container size={fullWidthGridSize}>
          {/* Inventory View Selector */}
          <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
            <Stack direction="row" sx={{ alignItems: "center" }} >
              <FormControlLabel
                control={
                  <Switch
                    id="isAttributeViewToggle"
                    checked={isAttributeView}
                    onChange={handleViewToggle}
                  />
                }
                label={<span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{t(fieldsName + 'stockType.PerAttribute')}</span>}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }} >
            <Stack >
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
        {/* Conditional Rendering based on selected view */}
        {isAttributeView ? (
          renderAttributeInventorySection()
        ) : (
          renderTotalInventoryFields()
        )}
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
          {inventoryError ? (
            <FormHelperText error id="inventories-helper-text">
              {inventoryError}
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
