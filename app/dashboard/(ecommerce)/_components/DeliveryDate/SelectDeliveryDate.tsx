import * as React from 'react';
import DeliveryDateService from '@dashboard/(ecommerce)/_service/DeliveryDateService';
import SingleSelect from '@dashboard/_components/Select/SingleSelect';
import { useSession } from 'next-auth/react';

interface SelectDeliveryDateProps {
  defaultValue?: number | null;
  id: string;
  name: string;
  label: string;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
  error?: boolean;
  disabled?: boolean;
}

export default function SelectDeliveryDate({ defaultValue, id, name, label, setFieldValue, error = false, disabled = false }: Readonly<SelectDeliveryDateProps>) {
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const deliveryDateService = new DeliveryDateService(jwt ?? '');

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
      loadDataApi={() => deliveryDateService.getDeliveryDateList()}
    />
  );
}
