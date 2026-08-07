import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';

import { UserModel } from '../../(auth)/_types/User/UserModel';
import Result from '@root/app/types/Result';

interface MultiAutoCompleteProps {
  id: string;
  defaultValues: number[];
  setFieldValue: (field: string, value: any) => void;
  label?: string;
  optionLabel: string;
  inputDataApi: (input: string) => Promise<Result<any[]>>;
  loadDataApi: (ids: number[]) => Promise<Result<any[]>>;
  disabled: boolean;
  error?: boolean;
}

export default function MultiAutoComplete({
  id,
  defaultValues,
  setFieldValue,
  label,
  optionLabel,
  inputDataApi,
  loadDataApi,
  disabled,
  error
}: Readonly<MultiAutoCompleteProps>) {

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly Option[]>([]);
  const [values, setValues] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAllData = (ids: number[]) => {
    setLoading(true);
    loadDataApi(ids).then((result) => {
      const optionsData: Option[] = result.data?.map((x) => ({ id: x.id, name: x[optionLabel], selected: true })) as Option[];
      setOptions(optionsData);
      setValues(optionsData);
      setLoading(false);
    }).catch((error) => setLoading(false));;
  };

  useEffect(() => {

    if (defaultValues == null || defaultValues === undefined || (Array.isArray(defaultValues) && defaultValues.length === 0)) {
      setOptions([]);
    } else {
      loadAllData(defaultValues);
    }

  }, [JSON.stringify(defaultValues)]);


  const onChange = (event: React.SyntheticEvent, value: Option[], reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<Option> | undefined) => {
    if (reason == "selectOption" || reason == "removeOption") {
      let ids = value?.map(a => a.id);
      setFieldValue(id, ids);
      setOptions(value);
      setValues(value);
    }
  };
  const onInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
    if (newInputValue !== 'undefined' && newInputValue !== null && newInputValue !== '') {
      setLoading(true);
      inputDataApi(newInputValue).then((result) => {
        let optionsData: Option[] = result.data?.map((x) => ({ id: x.id, name: x[optionLabel] })) as Option[];
        setOptions(optionsData);
        setLoading(false);
      }).catch((error) => setLoading(false));
    }
  };

  const selectedMultipleValues = React.useMemo(
    () => {
      return options?.filter((x) => defaultValues.find((c) => c === x.id));
    },
    [JSON.stringify(defaultValues)],
  );

  return (
    <Autocomplete
      id={id}
      disabled={disabled}
      clearOnBlur={true}
      clearOnEscape={true}
      autoSelect={false}
      sx={{ minWidth: 300 }}
      open={open}
      multiple
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onInputChange={onInputChange}
      onChange={onChange}
      options={options}
      getOptionLabel={(option) => option.name || ''}
      isOptionEqualToValue={(option: Option, value: any) => option.id === value.id}
      loading={loading}
      defaultValue={selectedMultipleValues}
      value={values}
      renderInput={(params: any) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          label={label}
          error={error}
        // InputProps={{
        //   ...params.InputProps,
        //   endAdornment: (
        //     <React.Fragment>
        //       {loading && <CircularProgress color="inherit" size={15} />}
        //       {params.InputProps.endAdornment}
        //     </React.Fragment>
        //   )
        // }}
        />
      )}
    />
  );
}
