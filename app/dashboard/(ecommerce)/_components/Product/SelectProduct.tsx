import * as React from 'react';
import ProductService from '@dashboard/(ecommerce)/_service/ProductService';
import MultiAutocomplete from '@dashboard/_components/Select/MultiAutocomplete';
import { useSession } from 'next-auth/react';

interface SelectProductProps {
  id: string;
  name: string;
  defaultValues: any;
  setFieldValue: (field: string, value: any) => void;
  label: string

}

export default function SelectProduct(
  { id,
    name,
    defaultValues,
    setFieldValue,
    label
  }:
    Readonly<SelectProductProps>) {

  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let service = new ProductService(jwt ?? '');

  return (
    <MultiAutocomplete
      id={id}
      defaultValues={defaultValues}
      setFieldValue={setFieldValue}
      label={label}
      optionLabel={'name'}
      inputDataApi={(input: string) => service.getProductsByInput(input)}
      loadDataApi={(input: number[]) => service.getProductsByIds(input)}
      disabled={false}
    />
  );
}
