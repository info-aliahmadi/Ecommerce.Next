import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import Result from '@root/app/types/Result';

interface SingleAutocompleteProps {
  id: string;
  defaultValue?: number;
  setFieldValue: (field: string, value: any) => void;
  label: string;
  optionLabel: string;
  inputDataApi?: (input: string) => Promise<Result<any>>;
  loadDataApi: (id: number) => Promise<Result<any>>;
  disabled: boolean;
}

export default function SingleAutocomplete({ id, defaultValue, setFieldValue, label, optionLabel, inputDataApi, loadDataApi, disabled }: Readonly<SingleAutocompleteProps>) {

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<Option | null>(null);

  const loadAllData = (id: number) => {
    setLoading(true);
    loadDataApi(id).then((result) => {
      const optionsData: Option[] = result.data?.map((x: any) => ({ id: x.id, name: x[optionLabel] })) as Option[];
      setOptions(optionsData);
      debugger
      defaultValue && setValue(optionsData.find((x) => x.id == defaultValue) || null)
      setLoading(false);
    }).catch((error) => setLoading(false));
  };

  useEffect(() => {

    if ((defaultValue != undefined && defaultValue > 0)) {
      loadAllData(defaultValue);

    } else if (inputDataApi == null) {
      loadAllData(0);
    } else {
      setOptions([]);
    }

  }, [defaultValue]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Client-side only logic
      setOpen(false);
    }
  }, []);

  const onChange = (event: React.SyntheticEvent, newValue: Option | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<Option> | undefined) => {
    setFieldValue(id, newValue?.id);
    setValue(newValue);
  };
  const onInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
    if (inputDataApi != undefined) {
      if (newInputValue !== 'undefined' && newInputValue !== null && newInputValue !== '') {
        setLoading(true);
        inputDataApi(newInputValue).then((result) => {
          const optionsData: Option[] = result.data?.map((x: any) => ({ id: x.id, name: x[optionLabel] })) as Option[];
          setOptions(optionsData);
          setLoading(false);
        }).catch((error) => setLoading(false));
      }
    } 
  };
  return (
    <Autocomplete
      id={id}
      disabled={disabled}
      clearOnBlur={true}
      selectOnFocus
      clearOnEscape={true}
      autoSelect={false}
      sx={{ minWidth: 300 }}
      open={open}
      multiple={false}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      // Conditionally include onInputChange
      {...(inputDataApi && { onInputChange })}
      onChange={onChange}
      options={options}
      getOptionLabel={(option) => option.name || ''}
      isOptionEqualToValue={(option: Option, value: any) => option.id === value.id}
      loading={loading}
      value={value}
      renderInput={(params: any) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading && <CircularProgress color="inherit" size={15} />}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
}
