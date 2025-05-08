import SingleSelect from '@root/app/dashboard/_components/Select/SingleSelect';
import Result from '@root/app/types/Result';

export default function SelectPaymentStatus({ defaultValue, id, name, setFieldValue, error, disabled, label, optionLabel, dataApi }:
   { defaultValue: string; id: string; name: string; setFieldValue: (field: string, value: any, shouldValidate?: boolean) => any; error: boolean; disabled: boolean; label: string; 
    optionLabel: string; dataApi: () => Promise<Result<any>> }) {
  return (
    <SingleSelect
      id={id}
      name={name}
      defaultValue={defaultValue}
      setFieldValue={setFieldValue}
      disabled={disabled}
      error={error}
      label={label}
      optionLabel={optionLabel}
      loadDataApi={dataApi}
    />
  );
}
