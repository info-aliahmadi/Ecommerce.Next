import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import ShippingMethod, { shippingMethodLabelKeys } from '@root/app/types/enums/ShippingMethod';

interface SelectShippingMethodProps {
  value?: ShippingMethod | null;
  id: string;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
  error?: boolean;
  label?: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectShippingMethod: React.FC<SelectShippingMethodProps> = ({
  value,
  id,
  setFieldValue,
  error,
  label,
  disabled = false,
  showNoneOption = false,
}) => {
  const handleChange = (newValue: number | null) => {
    setFieldValue?.(id, newValue);
  };
  return (
    <FormControl error={error} key={id} fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={value ?? 0}
        disabled={disabled}
        customLabelKeys={shippingMethodLabelKeys}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectShippingMethod;
