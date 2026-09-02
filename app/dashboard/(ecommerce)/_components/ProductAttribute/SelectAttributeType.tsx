import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import AttributeTypes, { attributeTypeLabelKeys } from '@root/app/types/enums/AttributeType';

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

  const handleChange = (newValue: AttributeTypes | null) => {
    setFieldValue(name, newValue);
  };

  return (
    <FormControl error={error} key={name} fullWidth>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <EnumDropdown
        disabled={disabled}
        defaultValue={defaultValue ?? undefined}
        customLabelKeys={attributeTypeLabelKeys}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectAttributeType;
