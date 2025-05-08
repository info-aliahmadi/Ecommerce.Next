import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, FormControl } from '@mui/material';
import TagsService from '@dashboard/(cms)/_service/TagsService';
import { useSession } from 'next-auth/react';
import TagModel from '../../_types/Tag/TagModel';

export default function SelectTag({ defaultValues, id, setFieldValue, error, disabled = false }:
  Readonly<{
    defaultValues: string[],
    id?: string,
    setFieldValue?: any,
    error?: boolean,
    disabled?: boolean
  }>) {
  const [t] = useTranslation();
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<string[]>([]);
  const [values, setValues] = useState(defaultValues);
  const tagService = new TagsService(jwt ?? '');

  const loadTags = () => {
    tagService.getTagListForSelect().then((result) => {
      const optionsData: string[] = result.data?.map((x) => x.title) as string[];
      setOptions(optionsData);
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
      <Autocomplete
        id={id}
        disabled={disabled}
        multiple
        freeSolo
        disableCloseOnSelect
        size="small"
        value={values || ''}
        getOptionLabel={(option) => option}
        options={options?.map((option) => option)}
        loading={loading}
        defaultValue={options?.filter((x) => defaultValues?.find((c) => c === x)) ?? []}
        onChange={(e, newValue) => {
          setFieldValue(id, newValue);
          setValues(newValue);
        }}
        renderTags={(value, getTagProps) => {
          return value.map((option, index) => {
            return <Chip label={option} {...getTagProps({ index })} />;
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            size="small"
            placeholder={t('pages.tags')}
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
