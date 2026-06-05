import ShippingMethodService from '@dashboard/(ecommerce)/_service/ShippingMethodService';
import SingleSelect from '@dashboard/_components/Select/SingleSelect';
import { useSession } from 'next-auth/react';

interface SelectShippingMethodProps {
  defaultValue?: number | null;
  id: string;
  name: string;
  label: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error?: boolean;
  disabled?: boolean;
}

export default function SelectShippingMethod({ defaultValue, id, name, label, setFieldValue, error = false, disabled = false }: Readonly<SelectShippingMethodProps>) {
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const shippingMethodService = new ShippingMethodService(jwt ?? '');

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
      loadDataApi={() => shippingMethodService.getShippingMethodListForSelect()}
    />
  );
}
