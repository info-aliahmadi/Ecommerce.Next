import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import PaymentStatus, { paymentStatusLabelKeys } from '@root/app/types/enums/PaymentStatus';

interface SelectPaymentStatusProps {
  value?: PaymentStatus | null;
  id: string;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
  error?: boolean;
  label?: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectPaymentStatus: React.FC<SelectPaymentStatusProps> = ({
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
        customLabelKeys={paymentStatusLabelKeys}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectPaymentStatus;
