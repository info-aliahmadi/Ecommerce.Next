import SingleSelect from "@root/app/dashboard/_components/Select/SingleSelect";
import Result from "@root/app/types/Result";

interface SingleSelectProps {
  defaultValue?: number,
  id: string,
  name: string,
  label: string,
  setFieldValue: (field: string, value: any) => void,
  error: boolean,
  disabled?: boolean,
  dataApi:() => Promise<Result<any>>
}
export default function SelectSubscribeLabel({ defaultValue, id, name, label, setFieldValue, error = false, disabled = false, dataApi }: Readonly<SingleSelectProps>) {
  return (
    <SingleSelect
      id={id}
      name={name}
      defaultValue={defaultValue}
      setFieldValue={setFieldValue}
      dataApi={dataApi}
      disabled={disabled}
      error={error}
      optionLabel={'name'}
      label={label}
    />
  );
}
