import React from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useTranslations } from 'next-intl';

interface EnumDropdownProps {
  defaultValue?: number | undefined;
  disabled?: boolean;
  onChange: (newValue: number | null) => void;
  showNoneOption?: boolean;
  noneOptionLabel?: string;
  customLabelKeys?: { [key: string]: string } | null;
}

const EnumDropdown: React.FC<EnumDropdownProps> = ({
  defaultValue,
  disabled = false,
  onChange,
  showNoneOption = false,
  noneOptionLabel = '-',
  customLabelKeys = null,
}) => {
  const t = useTranslations('');
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
      {customLabelKeys && Object.keys(customLabelKeys).map((key) => (
        <MenuItem key={key} value={key}>
          {t(customLabelKeys[key])}
        </MenuItem>
      ))}
    </Select>
  );
};

export default EnumDropdown;
