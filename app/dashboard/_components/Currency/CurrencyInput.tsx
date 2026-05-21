import React, {useState, useCallback} from 'react';
import {
  TextField,
  TextFieldProps,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CurrencyTypes from '@root/app/types/enums/CurrencyTypes';

interface CurrencyInputProps extends Omit<
  TextFieldProps,
  'onChange' | 'value'
> {
  value?: string | number;
  onChange?: (value: string) => void;
  error?: boolean;
  currencyType?: CurrencyTypes;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      value: propValue = '',
      onChange,
      error = false,
      currencyType = CurrencyTypes.Dinar,
      ...other
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const shouldAllowDecimals =
      currencyType === CurrencyTypes.Dollar ||
      currencyType === CurrencyTypes.Euro;

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const rawValue = inputValue.replace(/,/g, '');
        const numberRegex = shouldAllowDecimals ? /^\d*\.?\d{0,}$/ : /^\d*$/;

        if (rawValue === '' || numberRegex.test(rawValue)) {
          setInternalValue(rawValue);
          onChange?.(rawValue);
        }
      },
      [onChange, shouldAllowDecimals],
    );

    const handleClear = useCallback(() => {
      setInternalValue('');
      onChange?.('');
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

    const currencySymbol = useCallback(() => {
      switch (currencyType) {
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
          return '';
        default:
          return '';
      }
    }, [currencyType]);

    // Sync with external value changes when not focused
    React.useEffect(() => {
      if (!isFocused) {
        const externalValue =
          typeof propValue === 'number' ? propValue.toString() : propValue;
        setInternalValue(externalValue || '');
      }
    }, [propValue, isFocused]);

    return (
      <TextField
        {...other}
        value={getDisplayValue(internalValue)}
        error={error}
        onChange={handleChange}
        inputRef={ref}
        slotProps={{
          input: {
            startAdornment:
              currencyType !== CurrencyTypes.None ? (
                <InputAdornment position="start">
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{fontSize: 12, m: 0}}>
                    {currencySymbol()}
                  </Typography>
                </InputAdornment>
              ) : undefined,
            inputProps: {
              pattern: shouldAllowDecimals ? '[0-9]*[.,]?[0-9]*' : '[0-9]*',
              style: {textAlign: 'center'},
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
      />
    );
  },
);

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;
