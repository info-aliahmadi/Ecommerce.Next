import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Chip, FormControl } from '@mui/material';
import EmailOutboxService from '@dashboard/(crm)/_service/EmailOutboxService';
import { useSession } from 'next-auth/react';
import Notify from '@dashboard/_components/@extended/Notify';


interface SelectEmailAddressProps {
  defaultValues?: string[],
  id: string,
  name: string,
  label: string,
  setFieldValue: (field: string, value: any) => void,
  error: boolean,
  disabled?: boolean,
}
export default function SelectEmailAddress({ defaultValues, id, label, setFieldValue, error, disabled = false }: Readonly<SelectEmailAddressProps>) {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>(defaultValues ?? []);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const service = new EmailOutboxService(jwt ?? '');

  const loadData = () => {
    service.getAddressForSelect().then((result) => {

      setOptions(result.data ?? []);
      setLoading(false);
    });
  };
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setValues(defaultValues ?? []);
    setFieldValue(id, defaultValues)
  }, [JSON.stringify(defaultValues)]);

  const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  return (
    <FormControl error={error}>
      <Notify notify={notify} setNotify={setNotify}></Notify>
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
          if (newValue.length > 0) {
            let currentEmail = newValue[newValue.length - 1];
            if (validateEmail(currentEmail)) {
              setFieldValue(id, newValue);
              setValues(newValue);
            } else {
              setNotify({ open: true, type: 'error', description: "Please enter valid Email Address" });
            }
          } else {
            setFieldValue(id, newValue);
            setValues(newValue);
          }

        }}
        renderTags={(value, getTagProps) => {
          return value?.map((option, index) => {
            return <Chip label={option} {...getTagProps({ index })} />;
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            size="small"
            placeholder={label}
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
