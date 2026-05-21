import * as React from 'react';
import { useTranslations } from 'next-intl';
import UsersService from '@dashboard/(auth)/_service/UsersService';
import { FormControl } from '@mui/material';
import { useSession } from 'next-auth/react';
import MultiAutoComplete from '@dashboard/_components/Select/MultiAutocomplete';

interface SelectUserProps {
  defaultValues?: number[] ;
  id: string;
  label: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error: boolean;
  disabled?: boolean;
}

export default function SelectMultiUsers({ defaultValues = [], id, label, setFieldValue, error, disabled = false }: Readonly<SelectUserProps>) {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const usersService = new UsersService(jwt ?? "");

  return (
    <FormControl error={error} key={id}>
      <MultiAutoComplete
        id={id}
        defaultValues={defaultValues}
        setFieldValue={setFieldValue}
        optionLabel={"userName"}
        label={label}
        inputDataApi={(input) => usersService.getUserListForSelect(input)}
        loadDataApi={(ids: number[]) => usersService.getUserListForSelectByIds(ids)}
        disabled={disabled}
      />
    </FormControl>
  );
}
