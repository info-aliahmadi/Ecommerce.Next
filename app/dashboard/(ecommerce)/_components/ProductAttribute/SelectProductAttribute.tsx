import * as React from 'react';
import ProductAttributeService from '@dashboard/(ecommerce)/_service/ProductAttributeService';
import MultiSelect from '@dashboard/_components/Select/MultiSelect';
import { useSession } from 'next-auth/react';

export default function SelectProductAttribute({ defaultValues, id, name, label, onChange, setFieldValue, error, disabled }: 
  { defaultValues: any; id: string; name: string; label: string; onChange: (event: any, options: any) => void; setFieldValue: (field: string, value: any) => void; error: boolean; disabled: boolean }) {
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const productAttributeService = new ProductAttributeService(jwt ?? '');
  
  return (
    <MultiSelect
      defaultValues={defaultValues}
      id={id}
      name={name} 
      label={label}
      optionLabel={'name'}
      onChange={onChange}
      setFieldValue={setFieldValue}
      error={error}
      disabled={disabled}
      loadDataApi={() => productAttributeService.getProductAttributeListForSelect()}
    />
  );
}
