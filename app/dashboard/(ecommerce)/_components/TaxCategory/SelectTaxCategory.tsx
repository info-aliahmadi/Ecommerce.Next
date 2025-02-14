import * as React from 'react';
import TaxCategoryService from '@dashboard/(ecommerce)/_service/TaxCategoryService';
import SingleSelect from '@dashboard/_components/Select/SingleSelect';
import { useSession } from 'next-auth/react';


interface SelectTaxCategoryProps {
  defaultValue?: number;
  id: string;
  name: string;
  label: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error?: boolean;
  disabled?: boolean;
}

export default function SelectTaxCategory({ defaultValue, id, name, label, setFieldValue, error = false, disabled = false }: Readonly<SelectTaxCategoryProps>) {
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const taxCategoryService = new TaxCategoryService(jwt ?? '');

  return (
    <SingleSelect
      defaultValue={defaultValue}
      id={id}
      name={name}
      label={label}
      optionLabel={'name'}
      setFieldValue={setFieldValue}
      error={error}
      disabled={disabled}
      dataApi={() => taxCategoryService.getTaxCategoryList()}
    />
  );
}
