import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import { useTranslations } from 'next-intl';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import DeliveryDateType from '@root/app/types/enums/DeliveryDateType';

interface SelectDeliveryDateProps {
  defaultValue?: number | null;
  id: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error: boolean;
  label: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectDeliveryDate: React.FC<SelectDeliveryDateProps> = ({
  defaultValue,
  id,
  setFieldValue,
  error,
  label,
  disabled = false,
  showNoneOption = false
}) => {
  const t = useTranslations('');

  const handleChange = (newValue: number | null) => {
    setFieldValue(id, newValue);
  };

  const deliveryDateLabels: Record<string, string> = {
    OneDay: t("fields.order.deliveryDate.OneDay"),
    ThreeDays: t("fields.order.deliveryDate.ThreeDays"),
    OneWeek: t("fields.order.deliveryDate.OneWeek"),
    OneMonth: t("fields.order.deliveryDate.OneMonth")
  };
  return (
    <FormControl error={error} key={id} fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={defaultValue ?? null}
        enumObject={DeliveryDateType}
        disabled={disabled}
        customLabels={deliveryDateLabels}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectDeliveryDate;
