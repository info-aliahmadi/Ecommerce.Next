import React, { useEffect, useState } from 'react';
import {
  TextField,
  TextFieldProps,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CurrencyTypes from '@root/app/types/enums/CurrencyTypes';

interface NumberFormatInputProps
  extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value?: string | number;
  onChange?: (value: string) => void;
  allowDecimals?: boolean;
  decimalPlaces?: number;
  error?: boolean;
  currencyType?: CurrencyTypes; // New prop for prefix text
  shouldAllowDecimals?: boolean
}

const NumberFormatInput = React.forwardRef<
  HTMLInputElement,
  NumberFormatInputProps
>(
  (
    {
      value,
      onChange,
      error = false,
      allowDecimals = false,
      decimalPlaces = 2,
      currencyType, // Destructure the new prop
      shouldAllowDecimals = false,
      ...other
    },
    ref,
  ) => {
    const [displayValue, setDisplayValue] = useState('');

    const formatNumber = (num: string | number) => {
      if (!num && num !== 0) return '';

      const rawValue =
        typeof num === 'string' ? num.replace(/,/g, '') : num.toString();
      const numberValue = parseFloat(rawValue);

      if (isNaN(numberValue)) return '';

      if (allowDecimals) {
        const parts = rawValue.split('.');
        if (parts.length > 1) {
          const integerPart = parts[0];
          const decimalPart = parts[1].slice(0, decimalPlaces);
          return `${integerPart}.${decimalPart}`;
        }
        return rawValue;
      } else {
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(numberValue);
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      const rawValue = inputValue.replace(/,/g, '');
      const numberRegex = allowDecimals ? /^\d*\.?\d{0,}$/ : /^\d*$/;

      if (rawValue === '' || numberRegex.test(rawValue)) {
        const formattedValue = formatNumber(rawValue);
        setDisplayValue(formattedValue);
        onChange?.(rawValue);
      }
    };

    const handleClear = () => {
      setDisplayValue('');
      onChange?.('');
    };

    useEffect(() => {
      setDisplayValue(formatNumber(value || ''));
    }, [value, allowDecimals, decimalPlaces]);

    const getCurrencyName = (type: CurrencyTypes): string => {
      switch (type) {
        case CurrencyTypes.Dinar:
          return 'IQD';
        case CurrencyTypes.Rial:
          return 'ریال';
        case CurrencyTypes.Toman:
          return 'تومان';
        case CurrencyTypes.Dollar:
          return 'USD';
        case CurrencyTypes.Euro:
          return 'EUR';
        case CurrencyTypes.None:
          return 'None';
        default:
          return 'Unknown';
      }
    };

    const currencyName = getCurrencyName(currencyType ?? CurrencyTypes.Dinar);

    return (
      <TextField
        {...other}
        value={displayValue}
        error={error}
        onChange={handleChange}
        inputRef={ref}
        slotProps={{
          input: {
            startAdornment: currencyType ? (
              <InputAdornment position="start">
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ fontSize: 11, m: 0 }}>
                  {currencyName}
                </Typography>
              </InputAdornment>
            ) : undefined,
            endAdornment: displayValue ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear input"
                  onClick={handleClear}
                  edge="end"
                  size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
            inputProps: {
              pattern: shouldAllowDecimals ? '[0-9]*[.,]?[0-9]*' : '[0-9]*',
            }
          }
        }}
        inputMode={allowDecimals ? 'decimal' : 'numeric'}
      />
    );
  },
);

NumberFormatInput.displayName = 'NumberFormatInput';

export default NumberFormatInput;
