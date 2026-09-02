import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import DeliveryDateType, { deliveryDateLabelKeys } from '@root/app/types/enums/DeliveryDateType';

interface SelectDeliveryDateProps {
  defaultValue?: DeliveryDateType | null;
  id: string;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
  error?: boolean;
  label: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectDeliveryDate: React.FC<SelectDeliveryDateProps> = ({
  defaultValue,
  id,
  setFieldValue,
  error,
  label,
  disabled = false,
  showNoneOption = false
}) => {
  const handleChange = (newValue: number | null) => {
    setFieldValue?.(id, newValue);
  };
  return (
    <FormControl error={error} key={id} fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={defaultValue ?? undefined}
        disabled={disabled}
        customLabelKeys={deliveryDateLabelKeys}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectDeliveryDate;
