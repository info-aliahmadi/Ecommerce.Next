import * as React from 'react';
import { useTranslations } from 'next-intl';
import UsersService from '@dashboard/(auth)/_service/UsersService';
import { FormControl } from '@mui/material';
import { useSession } from 'next-auth/react';
import SingleAutocomplete from '@root/app/dashboard/_components/Select/SingleAutocomplete';

interface SelectUserProps {
  defaultValue?: number;
  id: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error: boolean;
  label: string;
  disabled?: boolean;
}

export default function SelectSingleUser({
  defaultValue,
  id,
  setFieldValue,
  error,
  label,
  disabled = false,
}: Readonly<SelectUserProps>) {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const usersService = new UsersService(jwt ?? "");

  return (
    <FormControl error={error} key={id}>
      <SingleAutocomplete
        size='medium'
        id={id}
        defaultValue={defaultValue}
        setFieldValue={setFieldValue}
        label={label}
        optionLabel={"userName"}
        inputDataApi={(input) => usersService.getUserListForSelect(input)}
        loadDataApi={(id: number) =>
          usersService.getUserListForSelectByIds([id])
        }
        disabled={disabled}
        loadAllRecords={false}
      />
    </FormControl>
  );
}
