import * as React from 'react';
import DiscountService from '@dashboard/(ecommerce)/_service/DiscountService';
import MultiSelect from '@dashboard/_components/Select/MultiSelect';
import { useSession } from 'next-auth/react';

interface SelectDiscountProps {
  defaultValues: number[];
  id: string;
  name: string;
  label: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error?: boolean;
  disabled?: boolean;
}

export default function SelectDiscount({ defaultValues = [], id, name, label, setFieldValue, error = false, disabled = false }: Readonly<SelectDiscountProps>) {
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const discountService = new DiscountService(jwt ?? '');

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
      loadDataApi={() => discountService.getDiscountListForSelect()}
    />
  );
}
