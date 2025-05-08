import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
} from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import Result from '@root/app/types/Result';

interface Option {
  id: number;
  name: string;
}

interface SingleAutocompleteProps {
  id: string;
  defaultValue?: number;
  setFieldValue: (field: string, value: any) => void;
  label: string;
  optionLabel: string;
  inputDataApi?: (input: string) => Promise<Result<any>>;
  loadDataApi?: (id: number) => Promise<Result<any>>;
  readonly onChange?: (event: React.ChangeEvent<{ value: unknown }>, options: any[]) => void;
  disabled?: boolean;
  loadAllRecords?: boolean;
  manualOptions?: Option[]; // New prop for passing options manually
  selectFirstItem?: boolean;
}

export default function SingleAutocomplete({
  id,
  defaultValue,
  setFieldValue,
  label,
  optionLabel,
  inputDataApi,
  loadDataApi,
  disabled = false,
  loadAllRecords = false,
  manualOptions, // New prop
  selectFirstItem = false,
}: Readonly<SingleAutocompleteProps>) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<Option | null>(null);

  // Load data dynamically if manualOptions is not provided
  const loadAllData = (id: number) => {
    if (!loadDataApi) return; // Skip if loadDataApi is not provided

    setLoading(true);
    loadDataApi(id)
      .then((result) => {
        const optionsData: Option[] = result.data?.map((x: any) => ({
          id: x.id,
          name: x[optionLabel],
        })) as Option[];
        setOptions(optionsData);
        setValue(defaultValue ? optionsData.find((x) => x.id == defaultValue) || null : null);
        setLoading(false);
      })
      .catch((error) => setLoading(false));
  };

  useEffect(() => {
    if (manualOptions) {
      // If manualOptions is provided, use it directly
      setOptions(manualOptions);
      setValue(
        selectFirstItem && manualOptions.length > 0
          ? manualOptions[0]
          : defaultValue
          ? manualOptions.find((x) => x.id == defaultValue) || null
          : null
      );
    } else if (loadAllRecords) {
      // Load all data dynamically
      loadAllData(defaultValue ?? 0);
    } else if (defaultValue != undefined && defaultValue > 0) {
      // Load data for a specific ID
      loadAllData(defaultValue);
    } else if (inputDataApi == null) {
      // Load default data
      loadAllData(0);
    } else {
      // Clear options
      setOptions([]);
    }
  }, [defaultValue, manualOptions, selectFirstItem]); // Re-run effect when manualOptions or selectFirstItem changes

  useEffect(() => {
    if (selectFirstItem && options.length > 0 && !value) {
      setValue(options[0]);
      setFieldValue(id, options[0].id);
    }
  }, [options, selectFirstItem]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Client-side only logic
      setOpen(false);
    }
  }, []);

  const onChange = (
    event: React.SyntheticEvent,
    newValue: Option | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<Option> | undefined,
  ) => {
    setFieldValue(id, newValue?.id);
    setValue(newValue);
  };

  const onInputChange = (
    event: React.ChangeEvent<{}>,
    newInputValue: string,
  ) => {
    if (inputDataApi != undefined) {
      if (
        newInputValue !== 'undefined' &&
        newInputValue !== null &&
        newInputValue !== ''
      ) {
        setLoading(true);
        inputDataApi(newInputValue)
          .then((result) => {
            const optionsData: Option[] = result.data?.map((x: any) => ({
              id: x.id,
              name: x[optionLabel],
            })) as Option[];
            setOptions(optionsData);
            setLoading(false);
          })
          .catch((error) => setLoading(false));
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
      {...(inputDataApi && { onInputChange })}
      onChange={onChange}
      options={options}
      getOptionLabel={(option) => option.name || ''}
      isOptionEqualToValue={(option: Option, value: any) =>
        option.id === value.id
      }
      fullWidth
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
            ),
          }}
        />
      )}
    />
  );
}
