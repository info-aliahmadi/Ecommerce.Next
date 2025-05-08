import * as React from 'react';
import CurrencyService from '@dashboard/(ecommerce)/_service/CurrencyService';
import SingleSelect from '@dashboard/_components/Select/SingleSelect';
import { useSession } from 'next-auth/react';

interface SelectCurrencyProps {
  defaultValue?: number | null;
  id: string;
  name: string;
  label: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error?: boolean;
  disabled?: boolean;
}

export default function SelectCurrency({ defaultValue, id, name, label, setFieldValue, error = false, disabled = false }: Readonly<SelectCurrencyProps>) {
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const service = new CurrencyService(jwt ?? '');

  return (
    <SingleSelect
      defaultValue={defaultValue}
      id={id}
      name={name}
      label={label}
      optionLabel={'currencyCode'}
      setFieldValue={setFieldValue}
      error={error}
      disabled={disabled}
      loadDataApi={() => service.getAllCurrencies()}
    />
  );
}
