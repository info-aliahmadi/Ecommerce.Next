import { useSession } from 'next-auth/react';
import StateProvinceService from '../../_service/StateProvinceService';
import SingleSelect from '@root/app/dashboard/_components/Select/SingleSelect';

export default function SelectCountry({ defaultValue, id, name, label, setFieldValue, error, disabled = false }:
  Readonly<{
    defaultValue: number,
    id: string,
    name: string,
    label: string,
    setFieldValue?: any,
    error?: boolean,
    disabled?: boolean
  }>) {
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const countryService = new StateProvinceService(jwt ?? '');

  
  return (
    <SingleSelect
      defaultValue={defaultValue ?? ''}
      id={id}
      name={name}
      label={label}
      optionLabel={'name'}
      setFieldValue={setFieldValue}
      error={error}
      disabled={disabled}
      loadDataApi={() => countryService.getCountryListForSelect()}
    />
  );
}
