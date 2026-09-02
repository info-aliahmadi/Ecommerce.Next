import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import { measureTypeLabelKeys } from '@root/app/types/enums/MeasureType';

interface SelectMeasureTypeProps {
  defaultValue?: number | null;
  id: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error: boolean;
  label: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectMeasureType: React.FC<SelectMeasureTypeProps> = ({
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
      <InputLabel id={`meas-${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={defaultValue ?? 0}
        customLabelKeys={measureTypeLabelKeys}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
        disabled={disabled}
      />
    </FormControl>
  );
};

export default SelectMeasureType;
