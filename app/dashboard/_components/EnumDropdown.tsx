import React, { useMemo } from 'react';
import { Select, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { useTranslations } from 'next-intl';

interface EnumDropdownProps {
  defaultValue: number | null;
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
  const t = useTranslations('');
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
  const defaultKey = defaultValue !== null ? enumKeys.find((key) => enumObject[key] === defaultValue) : undefined;

  const getDisplayLabel = useMemo(() => {
    return (customLabel: any | null, key: string) => {
      debugger
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
