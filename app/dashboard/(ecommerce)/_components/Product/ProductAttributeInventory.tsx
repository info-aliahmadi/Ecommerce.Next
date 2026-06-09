import { Grid, TextField, Stack, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import SelectProductAttribute from '../ProductAttribute/SelectProductAttribute';
import { useState } from 'react';
import ProductModel from '../../_types/Product/ProductModel';
import InventoryModel from '../../_types/Product/InventoryModel';

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
        let tempInventories = { id: 0, attributeId: attributeId, attributeName: name, stockQuantity: 0, stockType: 1 } as InventoryModel;
        values.inventories.push(tempInventories);
      } else {
        let modifiedInventories = [{ id: 0, attributeId: attributeId, attributeName: name, stockQuantity: 0, stockType: 1 } as InventoryModel] as InventoryModel[];
        values.inventories = modifiedInventories;
      }
      setFieldValue('inventories', values.inventories);
    }
  };


  function AttributeInventory({ invenroty }: Readonly<{ invenroty: InventoryModel }>) {

    const [value, setValue] = useState(invenroty.stockQuantity);
    function handleChange(event: any) {
      let newVa = event.target.value;
      setValue(newVa)
      let attributeId = parseInt(event.target.id);
      const modifiedInventories = values.inventories.map((obj: InventoryModel) => {
        if (obj.attributeId === attributeId) {
          return { ...obj, stockQuantity: newVa };
        }
        return obj;
      });
      setFieldValue('inventories', modifiedInventories);
    }

    // Removed handleOnBlur function as updates are now handled in handleChange
    return <Grid container spacing={1} size={12}>
      <Grid size={{ xs: 4, sm: 4, md: 3, lg: 3, xl: 3 }} sx={{ p: 2 }}>
        <Stack>
          <Chip label={invenroty.attributeName}></Chip>
        </Stack>
      </Grid>
      <Grid size={{ xs: 8, sm: 8, md: 6, lg: 5, xl: 5 }}>
        <Stack>
          <TextField
            id={"attributeId-" + invenroty.attributeId}
            name={"attributeId" + invenroty.attributeId}
            type="number"
            value={value || ''}
            label={t(fieldsName + 'stockQuantity')}
            onChange={handleChange}
            // Removed onBlur handler
            fullWidth
          />
        </Stack>
      </Grid>
    </Grid>
  }

  return (
    <>
      <Stack>
        <SelectProductAttribute
          defaultValues={values?.inventories?.filter((x: InventoryModel) => x.stockType == 1).map((x: InventoryModel) => x.attributeId) || []}
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
          {values?.inventories?.filter((x: InventoryModel) => x.stockType == 1).map((item: InventoryModel, index: number) => <AttributeInventory key={index} invenroty={item} />)}

        </Grid>
      </Stack>
    </>
  );
}

