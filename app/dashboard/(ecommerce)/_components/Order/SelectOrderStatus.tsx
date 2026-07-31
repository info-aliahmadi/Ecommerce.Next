import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import { useTranslations } from 'next-intl';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import OrderStatus from '@root/app/types/enums/OrderStatus';

interface SelectOrderStatusProps {
  defaultValue?: OrderStatus | null;
  id: string;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
  error?: boolean;
  label: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectOrderStatus: React.FC<SelectOrderStatusProps> = ({
  defaultValue,
  id,
  setFieldValue,
  error,
  label,
  disabled = false,
  showNoneOption = false,
}) => {
  const t = useTranslations('');

  const handleChange = (newValue: number | null) => {
    setFieldValue?.(id, newValue);
  };

  const orderStatusLabels: Record<number, string> = {
    [OrderStatus.Pending]: t("fields.order.orderStatusTypes.Pending"),
    [OrderStatus.Processing]: t("fields.order.orderStatusTypes.Processing"),
    [OrderStatus.Complete]: t("fields.order.orderStatusTypes.Complete"),
    [OrderStatus.Cancelled]: t("fields.order.orderStatusTypes.Cancelled"),
  };

  return (
    <FormControl error={error} key={id} fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={defaultValue ?? undefined}
        enumObject={OrderStatus}
        disabled={disabled}
        customLabels={orderStatusLabels}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectOrderStatus;
