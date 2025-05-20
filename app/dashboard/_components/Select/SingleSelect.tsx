import * as React from 'react';
import { useState, useEffect } from 'react';
import { Chip, FormControl, MenuItem, OutlinedInput, Select, InputLabel, Box, useTheme, Theme } from '@mui/material';
import Result from '@root/app/types/Result';

interface SingleSelectProps {
  defaultValue?: any,
  id: string,
  name?: string,
  label: string,
  optionLabel: string,
  setFieldValue?: (field: string, value: any) => void,
  error?: boolean,
  disabled?: boolean,
  loadDataApi:() => Promise<Result<any>>
}

export default function SingleSelect({ defaultValue, id, name, label, optionLabel, setFieldValue, error = false, disabled= false, loadDataApi }: Readonly<SingleSelectProps>) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<Option[]>([]);
  const [value, setValue] = useState<any>();

  const loadAllData = () => {
    loadDataApi().then((result) => {
      const optionsData: Option[] = result.data?.map((x: any) => ({ id: x.id, name: x[optionLabel] })) as Option[];
      setOptions(optionsData);
      setLoading(false);
    });
  };
  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };


  function getStyles(value: string, defaultValue: string, theme: Theme): React.CSSProperties {
    return {
      fontWeight: defaultValue === value ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular
    };
  }

  const handleChange = (event: any) => {
    if (setFieldValue) {
      setFieldValue(id, event.target.value);
    }
    setValue(event.target.value);
  };

  return (
    <FormControl error={error} disabled={disabled}>
      <InputLabel htmlFor={id} sx={{ overflow: 'visible' }}>{label}</InputLabel>
      <Select
        id={id}
        name={name?? id}
        className="select-margin"
        value={value ?? ''}
        label={label}
        size="medium"
        onChange={handleChange}
        MenuProps={MenuProps}
        input={<OutlinedInput label={label} sx={{ minHeight: '41px' }} />}
        defaultValue={defaultValue ? options?.filter((x: any) => x.id == defaultValue) : ''}
        renderValue={(selected: any) => (<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          <Chip label={options?.find((x: any) => x.id == selected)?.name} sx={{ height: '23px' }} />
        </Box>
        )}
      >
        {options?.map((item: Option) => {
          return (
            <MenuItem key={'menu-' + name + item.id} value={item.id} style={value && getStyles(item.id.toString(), value, theme)}>
              <span style={{ whiteSpace: 'pre-wrap' }}>{item?.name}</span>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
