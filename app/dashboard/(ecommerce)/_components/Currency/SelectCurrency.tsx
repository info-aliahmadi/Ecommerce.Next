import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import { currencyLabelKeys } from '@root/app/types/enums/CurrencyTypes';

interface SelectCurrencyProps {
  defaultValue?: number | null;
  id: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error: boolean;
  label: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectCurrency: React.FC<SelectCurrencyProps> = ({
  defaultValue,
  id,
  setFieldValue,
  error,
  label,
  disabled = false,
  showNoneOption = false,
}) => {
  const handleChange = (newValue: number | null) => {
    setFieldValue(id, newValue);
  };

  return (
    <FormControl error={error} key={id} fullWidth>
      <InputLabel id={`curr-${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={defaultValue || 0}
        customLabelKeys={currencyLabelKeys}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
        disabled={disabled}
      />
    </FormControl>
  );
};

export default SelectCurrency;
