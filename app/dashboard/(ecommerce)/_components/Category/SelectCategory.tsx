import * as React from 'react';
import CategoryService from '@dashboard/(ecommerce)/_service/CategoryService';
import MultiSelect from '@dashboard/_components/Select/MultiSelect';
import { useSession } from 'next-auth/react';

export default function SelectCategory({ defaultValues, id, name, label, setFieldValue, error, disabled = false }:
  Readonly<{
    defaultValues: number[],
    id: string,
    name: string,
    label?: string,
    setFieldValue?: any,
    error?: boolean,
    disabled?: boolean
  }>) {
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const categoryService = new CategoryService(jwt ?? '');

  return (
    <MultiSelect
      defaultValues={defaultValues}
      id={id}
      name={name}
      label={label}
      optionLabel={'name'}
      setFieldValue={setFieldValue}
      error={error}
      disabled={disabled}
      loadDataApi={() => categoryService.getCategoryListForSelect()}
    />
  );
}
