import React, { useState, useCallback } from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  Typography,
} from '@mui/material';
import MeasureType from '@root/app/types/enums/MeasureType';
import CONFIG from '@root/config';
import { MeasureTypeSymbolViewer } from '@root/utils/MeasureTypeViewer';
import { Input } from '../ui/input';

interface PriceInputProps extends Omit<
  TextFieldProps,
  'onChange' | 'value'
> {
  value?: string | number;
  onChange?: (value: number) => void;
  error?: boolean;
  measureType?: MeasureType;
  min?: number;
  max?: number;
}

const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>(
  (
    {
      value: propValue = '',
      onChange,
      error = false,
      measureType = CONFIG.DEFAULT_MEASURETYPE,
      min,
      max,
      ...other
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const shouldAllowDecimals =
      measureType === MeasureType.Kilogram ||
      measureType === MeasureType.Litr ||
      measureType === MeasureType.Meter ||
      measureType === MeasureType.Mesghal;

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const rawValue = inputValue.replace(/,/g, '');
        const numberRegex = shouldAllowDecimals ? /^\d*\.?\d{0,}$/ : /^\d*$/;

        if (rawValue === '' || numberRegex.test(rawValue)) {
          setInternalValue(rawValue);
          onChange?.(parseFloat(rawValue) || 0);
        }
      },
      [onChange, shouldAllowDecimals],
    );

    const handleClear = useCallback(() => {
      setInternalValue('');
      onChange?.(0);
    }, [onChange]);

    const getDisplayValue = useCallback(
      (val: string) => {
        if (!val && val !== '0') return '';

        if (isFocused) {
          return val;
        }

        const numberValue = parseFloat(val);
        if (isNaN(numberValue)) return '';

        if (shouldAllowDecimals) {
          const parts = val.split('.');
          if (parts.length > 1) {
            const decimalPart = parts[1].slice(0, 2);
            return `${parts[0]}.${decimalPart}`;
          }
          return val;
        }

        return new Intl.NumberFormat('en-US').format(numberValue);
      },
      [isFocused, shouldAllowDecimals],
    );

    const measureSymbol = useCallback(() => {
      return MeasureTypeSymbolViewer(measureType);
    }, [measureType]);

    // Sync with external value changes when not focused
    React.useEffect(() => {
      if (!isFocused) {
        const externalValue =
          typeof propValue === 'number' ? propValue.toString() : propValue;
        setInternalValue(externalValue || '');
      }
    }, [propValue, isFocused]);

    return (
      <>
        <Input
          // type="number"
          value={getDisplayValue(internalValue)}
          onChange={handleChange}
          className="w-full h-9 ps-10 pe-2 rounded-lg bg-ecommerce-surface border border-ecommerce-border text-sm text-ecommerce-text-primary focus:outline-none focus:ring-2 focus:ring-ecommerce-red/30"
          min={min || 0}
          max={(max || 99999999999) - 1}
        />
{/* 
        <TextField
          {...other}
          value={getDisplayValue(internalValue)}
          error={error}
          onChange={handleChange}
          inputRef={ref}
          slotProps={{
            input: {
              startAdornment:
                <InputAdornment position="start">
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ fontSize: 12, m: 0 }}>
                    {measureSymbol()}
                  </Typography>
                </InputAdornment>,
              inputProps: {
                pattern: shouldAllowDecimals ? '[0-9]*[.,]?[0-9]*' : '[0-9]*',
                style: { textAlign: 'center' },
              },
            },
          }}
          inputMode={shouldAllowDecimals ? 'decimal' : 'numeric'}
          sx={{
            '& .MuiOutlinedInput-root': {
              paddingLeft: 1,
              paddingRight: 1,
            },
            ...other.sx,
          }}
        /> */}
      </>
    );
  },
);

PriceInput.displayName = 'PriceInput';

export default PriceInput;
