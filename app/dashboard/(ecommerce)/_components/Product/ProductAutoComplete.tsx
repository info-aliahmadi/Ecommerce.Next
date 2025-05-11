import * as React from 'react';
import ProductService from '@dashboard/(ecommerce)/_service/ProductService';
import MultiAutocomplete from '@dashboard/_components/Select/MultiAutocomplete';
import { useSession } from 'next-auth/react';

  export default function ProductsAutoComplete({ id, name, defaultValues, setFieldValue, label }: 
  { id: string; name: string; defaultValues: any; setFieldValue?: (field: string, value: any) => void; label: string }) {

  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let service = new ProductService(jwt ?? '');

  return (
    <>
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
    </>
  );
}
