import React, { useMemo } from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface EnumDropdownProps {
  defaultValue?: number | undefined;
  enumObject: any;
  disabled?: boolean;
  onChange: (newValue: number | null) => void;
  showNoneOption?: boolean;
  noneOptionLabel?: string;
  customLabels?: { [key: string]: string } | null;
}

const EnumDropdown: React.FC<EnumDropdownProps> = ({
  defaultValue,
  enumObject,
  disabled = false,
  onChange,
  showNoneOption = false,
  noneOptionLabel = '-',
  customLabels = null,
}) => {
  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedKey = parseInt(event.target.value as unknown as string);
    if (selectedKey === 0) {
      onChange(null);
    } else {
      onChange(selectedKey);
    }
  };


  return (
    <Select value={defaultValue || 0} onChange={handleChange} fullWidth disabled={disabled}>
      {showNoneOption && (
        <MenuItem value="">
          <em>{noneOptionLabel}</em>
        </MenuItem>
      )}
      {customLabels && Object.keys(customLabels).map((key) => (
        <MenuItem key={key} value={key}>
          {customLabels[key]}
        </MenuItem>
      ))}
    </Select>
  );
};

export default EnumDropdown;
