import * as React from 'react';
import ManufacturerService from '@dashboard/(ecommerce)/_service/ManufacturerService';
import MultiSelect from '@dashboard/_components/Select/MultiSelect';
import { useSession } from 'next-auth/react';

export default function SelectManufacturer({ defaultValues, id, name, label, setFieldValue, error, disabled = false }:
  Readonly<{
    defaultValues: string[],
    id: string,
    name: string,
    label: string,
    setFieldValue?: any,
    error?: boolean,
    disabled?: boolean
  }>) {
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const manufacturerService = new ManufacturerService(jwt ?? '');

  
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
      dataApi={manufacturerService.getManufacturerListForSelect()}
    />
  );
}
