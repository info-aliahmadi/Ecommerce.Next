import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Chip, FormControl, InputLabel } from '@mui/material';
import { useSession } from 'next-auth/react';
import ProductTagService from '../../_service/ProductTagService';
import ProductTagModel from '../../_types/Product/ProductTagModel';


export default function SelectProductTag({ defaultValues, id, name, label, setFieldValue, error, disabled = false }:
  Readonly<{
    defaultValues: string[],
    id: string,
    name: string,
    label: string,
    setFieldValue?: any,
    error?: boolean,
    disabled?: boolean
  }>) {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const tagService = new ProductTagService(jwt ?? '');

  const loadTags = () => {
    tagService.getProductTagListForSelect().then((result) => {
      let tags = result.data?.map((tag: any) => tag.name) as string[] ?? [];
      setOptions(tags);
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
        defaultValue={options.filter((x) => defaultValues?.includes(x)) ?? []}
        onChange={(e, newValue : any) => {
          setFieldValue(id, newValue);
          setValues(newValue);
        }}
        renderValue={(value, getTagProps) => {
          return value.map((name, index) => {
            return <Chip
             key={'tg-' + index} 
             label={name} 
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
            // InputProps={{
            //   ...params.InputProps,
            //   endAdornment: (
            //     <React.Fragment>
            //       {loading ? <CircularProgress color="inherit" size={20} /> : null}
            //       {params.InputProps.endAdornment}
            //     </React.Fragment>
            //   )
            // }}
          />
        )}
      />
    </FormControl>
  );
}
