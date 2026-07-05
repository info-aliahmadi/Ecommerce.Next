import { useSession } from 'next-auth/react';
import ProductTagService from '../../_service/ProductTagService';
import MultiSelect from '@root/app/dashboard/_components/Select/MultiSelect';


export default function SelectProductTag({ defaultValues, id, name, label, setFieldValue, error, disabled = false }:
  Readonly<{
    defaultValues: number[],
    id: string,
    name: string,
    label: string,
    setFieldValue?: any,
    error?: boolean,
    disabled?: boolean
  }>) {
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const tagService = new ProductTagService(jwt ?? '');


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
      loadDataApi={() => tagService.getProductTagListForSelect()}
    />
  );
}
