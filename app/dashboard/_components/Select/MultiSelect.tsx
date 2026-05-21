import * as React from 'react';
import { useState, useEffect } from 'react';
import { Chip, FormControl, MenuItem, OutlinedInput, Select, InputLabel, Box, useTheme ,Theme } from '@mui/material';
import {} from '@mui/system';
import Result from '@root/app/types/Result';


interface MultiSelectProps {
  readonly defaultValues: any[];
  readonly id: string;
  readonly name: string;
  readonly label: string;
  readonly optionLabel: string;
  readonly setFieldValue: (field: string, value: any) => void;
  readonly onChange?: (event: React.ChangeEvent<{ value: unknown }>, options: any[]) => void;
  readonly error?: boolean;
  readonly disabled?: boolean;
  readonly loadDataApi:() => Promise<Result<any>>;
  readonly sx?: object;
}

export default function MultiSelect({ defaultValues, id, name, label, optionLabel, setFieldValue, onChange, error = false, disabled = false, loadDataApi, sx }: MultiSelectProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<Option[]>([]);
  const [values, setValues] = useState<any[]>([]);

  const loadAllData = () => {
    loadDataApi().then((result : any) => {
      const optionsData: Option[] = result.data?.map((x : any) => ({ id: x.id, name: x[optionLabel] })) as Option[];
      setOptions(optionsData);
      setLoading(false);
    });
  };
  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    setValues(defaultValues);
  }, [JSON.stringify(defaultValues)]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  function getStyles(value: string, values: string[], theme: Theme): React.CSSProperties {
    return {
      fontWeight: values.indexOf(value) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
    };
  }

  const handleChange = (event : any) => {
    if (onChange) {
      onChange(event, options);
    } else {
      setFieldValue(id, event.target.value);
      setValues(event.target.value);
    }
  };

  return (
    <FormControl error={error} disabled={disabled}>
      <InputLabel htmlFor={id} sx={{ overflow: 'visible' }}>{label}</InputLabel>
      <Select
        id={id}
        name={name}
        className="select-margin"
        multiple
        value={values || ''}
        label={label}
        size="medium"
        onChange={handleChange}
        style={{
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250
        }}
        input={<OutlinedInput label={label} sx={{ minHeight: '41px' }} />}
        defaultValue={options?.filter((x) => defaultValues?.find((c) => c === x.id)) ?? []}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value, index) => {
              return <Chip key={'chip-' + name + index} label={options?.find((x) => x.id == value)?.name} sx={{ height: '23px' }} />;
            })}
          </Box>
        )}
        sx={sx}
      >
        {options?.map((item) => {
          return (
            <MenuItem key={'menu-' + name + item.id} value={item.id} style={getStyles(item.id.toString(), values, theme)}>
              <span style={{ whiteSpace: 'pre-wrap' }}>{item?.name}</span>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
