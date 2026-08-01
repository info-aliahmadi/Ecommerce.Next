import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import { useTranslations } from 'next-intl';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import PaymentStatus from '@root/app/types/enums/PaymentStatus';

interface SelectPaymentStatusProps {
  value?: PaymentStatus | null;
  id: string;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
  error?: boolean;
  label?: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectPaymentStatus: React.FC<SelectPaymentStatusProps> = ({
  value,
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

  const paymentStatusLabels: Record<number, string> = {
    [PaymentStatus.Pending]: t("fields.order.paymentStatusTypes.Pending"),
    [PaymentStatus.Authorized]: t("fields.order.paymentStatusTypes.Authorized"),
    [PaymentStatus.Paid]: t("fields.order.paymentStatusTypes.Paid"),
    [PaymentStatus.PartiallyRefunded]: t("fields.order.paymentStatusTypes.PartiallyRefunded"),
    [PaymentStatus.Refunded]: t("fields.order.paymentStatusTypes.Refunded"),
    [PaymentStatus.Voided]: t("fields.order.paymentStatusTypes.Voided"),
  };

  return (
    <FormControl error={error} key={id} fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={value ?? 0}
        enumObject={PaymentStatus}
        disabled={disabled}
        customLabels={paymentStatusLabels}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectPaymentStatus;
