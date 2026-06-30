import { Grid, TextField, Stack, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import SelectProductAttribute from '../ProductAttribute/SelectProductAttribute';
import ProductModel from '../../_types/Product/ProductModel';
import InventoryModel from '../../_types/Product/InventoryModel';
import { memo } from 'react';
import CurrencyInput from '@root/app/dashboard/_components/Currency/CurrencyInput';
import CONFIG from '@root/config';

// Move AttributeInventory outside and memoize it to prevent focus loss
const AttributeInventory = memo(({
  inventory,
  onFieldChange,
  fieldsName,
  t
}: {
  inventory: InventoryModel;
  onFieldChange: (attributeId: number, field: keyof InventoryModel, value: number) => void;
  fieldsName: string;
  t: any;
}) => {
  const handleChange = (field: keyof InventoryModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    onFieldChange(inventory.attributeId!, field, value);
  };

  return (
    <Grid container spacing={2} size={12} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
        <Stack>
          <Chip label={inventory.attributeName} color="primary" sx={{ width: 'fit-content' }} />
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3, xl: 3 }}>
        <Stack>
          <TextField
            id={`stockQuantity-${inventory.attributeId}`}
            name={`stockQuantity-${inventory.attributeId}`}
            type="number"
            value={inventory.stockQuantity || ''}
            label={t(fieldsName + 'inventory.stockQuantity')}
            onChange={handleChange('stockQuantity')}
            fullWidth
          />
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3, xl: 3 }}>
        <Stack>
          <TextField
            id={`reservedQuantity-${inventory.attributeId}`}
            name={`reservedQuantity-${inventory.attributeId}`}
            type="number"
            value={inventory.reservedQuantity || ''}
            label={t(fieldsName + 'inventory.reservedQuantity')}
            onChange={handleChange('reservedQuantity')}
            fullWidth
          />
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3, xl: 3 }}>
        <Stack>
          <CurrencyInput
            id={`buyUnitPrice-${inventory.attributeId}`}
            name={`buyUnitPrice-${inventory.attributeId}`}
            value={inventory.buyUnitPrice || ''}
            label={t(fieldsName + 'inventory.buyUnitPrice')}
            fullWidth
            currencyType={CONFIG.DEFAULT_CURRENCY}
            onChange={(value: number) => handleChange('buyUnitPrice')({ target: { value: value.toString() } } as React.ChangeEvent<HTMLInputElement>)}
          />
        </Stack>
      </Grid>
    </Grid>
  );
});

AttributeInventory.displayName = 'AttributeInventory';

export default function ProductAttributeInventory({ values, setFieldValue }: Readonly<{ values: ProductModel; setFieldValue: (field: string, value: any) => void }>) {
  const t = useTranslations("");
  const fieldsName = 'fields.product.';

  const handleAttributeChange = (event: any, options: any) => {
    let allValues = event.target.value as number[];

    // remove 
    if (values.inventories && allValues.length < values.inventories.length) {
      const modifiedInventories = values.inventories.filter((obj: InventoryModel) => {
        return allValues.find((x: any) => x == obj.attributeId);
      });
      setFieldValue('inventories', modifiedInventories);

      // Add
    } else {
      let attributeId = allValues.at(-1);
      let name = options.find((x: any) => x.id == attributeId).name;

      if (values.inventories) {
        let tempInventories : InventoryModel = {
          id: 0,
          productId: values.id || 0,
          attributeId: attributeId,
          attributeName: name,
          stockQuantity: 0,
          reservedQuantity: 0,
          buyUnitPrice: 0
        };
        values.inventories.push(tempInventories);
      } else {
        let modifiedInventories : InventoryModel[] = [{
          id: 0,
          productId: values.id || 0,
          attributeId: attributeId,
          attributeName: name,
          stockQuantity: 0,
          reservedQuantity: 0,
          buyUnitPrice: 0
        }];
        values.inventories = modifiedInventories;
      }
      setFieldValue('inventories', values.inventories);
    }
  };

  const handleInventoryFieldChange = (attributeId: number, field: keyof InventoryModel, value: number) => {
    if (!values.inventories) return;

    const modifiedInventories = values.inventories.map((obj: InventoryModel): InventoryModel => {
      if (obj.attributeId === attributeId) {
        return { ...obj, [field]: value };
      }
      return obj;
    });
    setFieldValue('inventories', modifiedInventories);
  };

  return (
    <>
      <Stack sx={{width:'100%'}}>
        <SelectProductAttribute
          defaultValues={values?.inventories?.map((x: InventoryModel) => x.attributeId).filter((id: number | undefined) => id !== undefined) || []}
          id="inventoryAttributeIds"
          name="inventoryAttributeIds"
          label={t(fieldsName + 'attributeIds')}
          onChange={handleAttributeChange}
          setFieldValue={setFieldValue}
          error={false}
          disabled={false}
        />
      </Stack>
      <Stack>
        <Grid container spacing={1} size={12} sx={{ pt: 3 }}>
          {values?.inventories?.map((item: InventoryModel, index: number) => (
            <AttributeInventory
              key={item.attributeId || index}
              inventory={item}
              onFieldChange={handleInventoryFieldChange}
              fieldsName={fieldsName}
              t={t}
            />
          ))}
        </Grid>
      </Stack>
    </>
  );
}
