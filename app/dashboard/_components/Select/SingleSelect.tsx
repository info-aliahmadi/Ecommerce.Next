import * as React from 'react';
import { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import Result from '@root/app/types/Result';


interface SingleSelectProps {
  defaultValue?: any,
  id: string,
  name?: string,
  label: string,
  optionLabel: string,
  setFieldValue: (field: string, value: any) => void,
  error?: boolean,
  disabled?: boolean,
  loadDataApi:() => Promise<Result<any>>
}

export default function SingleSelect({ defaultValue, id, name, label, optionLabel, setFieldValue, error = false, disabled= false, loadDataApi }: Readonly<SingleSelectProps>) {
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

  const selectedOption = options.find((option) => option.id == value) ?? null;

  const handleChange = (event: React.SyntheticEvent, option: Option | null) => {
    const nextValue = option?.id ?? '';
    setFieldValue(id, nextValue);
    setValue(nextValue);
  };

  return (
    <Autocomplete
      id={id}
      value={selectedOption}
      options={options}
      loading={loading}
      disabled={disabled}
      onChange={handleChange}
      getOptionLabel={(option) => option?.name ?? ''}
      isOptionEqualToValue={(option, value) => option.id == value.id}
      sx={{ width: '100%', minWidth: '100%' }}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name ?? id}
          error={error}
          size="small"
          label={label}
        />
      )}
    />
  );
}
