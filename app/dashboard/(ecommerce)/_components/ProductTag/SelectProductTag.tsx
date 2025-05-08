import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, FormControl, InputLabel } from '@mui/material';
import { useSession } from 'next-auth/react';
import ProductTagService from '../../_service/ProductTagService';
import ProductTagModel from '../../_types/Product/ProductTagModel';


export default function SelectProductTag({ defaultValues, id, name, label, setFieldValue, error, disabled = false }:
  Readonly<{
    defaultValues: ProductTagModel[],
    id: string,
    name: string,
    label: string,
    setFieldValue?: any,
    error?: boolean,
    disabled?: boolean
  }>) {
  const [t] = useTranslation();
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<ProductTagModel[]>([]);
  const [values, setValues] = useState<ProductTagModel[]>([]);
  const tagService = new ProductTagService(jwt ?? '');

  const loadTags = () => {
    tagService.getProductTagListForSelect().then((result) => {
      setOptions(result.data ?? []);
      setLoading(false);
    });
  };
  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    setValues(defaultValues);
  }, [JSON.stringify(defaultValues)]);

  return (
    <FormControl error={error}>
    {/* <InputLabel htmlFor={id} sx={{overflow : 'visible'}}>{label}</InputLabel> */}
      <Autocomplete
        id={id}
        disabled={disabled}
        multiple
        freeSolo
        // label={label}
        disableCloseOnSelect
        size="small"
        value={values || ''}
        // getOptionLabel={(option: ProductTagModel) => option.name}
        options={options}
        loading={loading}
        defaultValue={options.filter((x) => defaultValues?.find((c) => c.id === x.id)) ?? []}
        onChange={(e, newValue : any) => {
          setFieldValue(id, newValue);
          setValues(newValue);
        }}
        renderTags={(value, getTagProps) => {
          return value.map((option, index) => {
            return <Chip
             key={'tg-' + index} 
             label={option.name} 
            //  {...getTagProps({ index })} 
             sx={{height : '23px'}} />;
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            size="small"
            label={label}
            //  placeholder={label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
          />
        )}
      />
    </FormControl>
  );
}
