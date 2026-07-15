import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import { useTranslations } from 'next-intl';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import AttributeTypes from '@root/app/types/enums/AttributeType';

interface SelectAttributeTypeProps {
  defaultValue?: AttributeTypes | null;
  name: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error: boolean;
  label: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectAttributeType: React.FC<SelectAttributeTypeProps> = ({
  defaultValue,
  name,
  setFieldValue,
  error,
  label,
  disabled = false,
  showNoneOption = false,
}) => {
  const t = useTranslations('');

  const handleChange = (newValue: AttributeTypes | null) => {
    setFieldValue(name, newValue);
  };

  const attributeLabels: Record<string, string> = {
    [AttributeTypes.Color]: t('fields.productAttribute.attributeTypes.Color'),
    [AttributeTypes.Size]: t('fields.productAttribute.attributeTypes.Size'),
    [AttributeTypes.Weight]: t('fields.productAttribute.attributeTypes.Weight'),
    [AttributeTypes.Length]: t('fields.productAttribute.attributeTypes.Length'),
    [AttributeTypes.Width]: t('fields.productAttribute.attributeTypes.Width'),
    [AttributeTypes.Height]: t('fields.productAttribute.attributeTypes.Height'),
    [AttributeTypes.Material]: t('fields.productAttribute.attributeTypes.Material'),
    [AttributeTypes.Style]: t('fields.productAttribute.attributeTypes.Style'),
    [AttributeTypes.Pattern]: t('fields.productAttribute.attributeTypes.Pattern'),
    [AttributeTypes.Brand]: t('fields.productAttribute.attributeTypes.Brand'),
    [AttributeTypes.Model]: t('fields.productAttribute.attributeTypes.Model'),
  };
  return (
    <FormControl error={error} key={name} fullWidth>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={defaultValue ?? undefined}
        enumObject={AttributeTypes}
        customLabels={attributeLabels}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectAttributeType;
