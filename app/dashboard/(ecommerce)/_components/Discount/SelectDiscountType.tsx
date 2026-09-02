import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import { discountTypeLabelKeys } from '@root/app/types/enums/DiscountType';

interface SelectDiscountTypeProps {
  defaultValue?: number | null;
  id: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error: boolean;
  label?: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectDiscountType: React.FC<SelectDiscountTypeProps> = ({
  defaultValue,
  id,
  setFieldValue,
  error,
  label,
  disabled = false,
  showNoneOption = false
}) => {
  const handleChange = (newValue: number | null) => {
    setFieldValue(id, newValue);
  };
  return (
    <FormControl error={error} key={id} fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={defaultValue ?? 0}
        disabled={disabled}
        customLabelKeys={discountTypeLabelKeys}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectDiscountType;
