import TaxRateService from '@dashboard/(ecommerce)/_service/TaxRateService';
import SingleSelect from '@dashboard/_components/Select/SingleSelect';
import { useSession } from 'next-auth/react';

interface SelectTaxRateProps {
  defaultValue?: number | null;
  id: string;
  name: string;
  label: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error?: boolean;
  disabled?: boolean;
}

export default function SelectTaxRate({ defaultValue, id, name, label, setFieldValue, error = false, disabled = false }: Readonly<SelectTaxRateProps>) {
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const taxRateService = new TaxRateService(jwt ?? '');

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
      loadDataApi={() => taxRateService.getTaxRateListForSelect()}
    />
  );
}
