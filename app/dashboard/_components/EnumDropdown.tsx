import React, { useMemo } from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface EnumDropdownProps {
  defaultValue: number | undefined;
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
  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedKey = event.target.value as string;

    if (selectedKey === 'none') {
      onChange(null);
    } else {
      const numericValue = enumObject[selectedKey]; // Map key back to numeric value
      onChange(numericValue);
    }
  };

  // Filter out numeric keys
  const enumKeys = Object.keys(enumObject).filter((key) => isNaN(Number(key)));

  // Map defaultValue number to corresponding enum key
  const defaultKey = defaultValue !== undefined ? enumKeys.find((key) => enumObject[key] === defaultValue) : undefined;
  const getDisplayLabel = useMemo(() => {
    return (customLabel: any | null, key: string) => {

      // Use the enum key directly to look up in customLabels
      let label = customLabel ? customLabel[key] : key;
      return label;
    };
  }, [customLabels]);

  return (
    <Select value={defaultKey || ""} onChange={handleChange} fullWidth disabled={disabled}>
      {showNoneOption && (
        <MenuItem value="">
          <em>{noneOptionLabel}</em>
        </MenuItem>
      )}
      {enumKeys.map((key) => (
        <MenuItem key={key} value={key}>
          {getDisplayLabel(customLabels, key)}
        </MenuItem>
      ))}
    </Select>
  );
};

export default EnumDropdown;
