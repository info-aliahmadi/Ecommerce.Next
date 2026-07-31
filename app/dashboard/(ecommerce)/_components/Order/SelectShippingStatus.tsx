import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import { useTranslations } from 'next-intl';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import ShippingStatus from '@root/app/types/enums/ShippingStatus';

interface SelectShippingStatusProps {
  defaultValue?: ShippingStatus | null;
  id: string;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
  error?: boolean;
  label?: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectShippingStatus: React.FC<SelectShippingStatusProps> = ({
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

  const shippingStatusLabels: Record<number, string> = {
    [ShippingStatus.ShippingNotRequired]: t("fields.order.shippingStatusTypes.ShippingNotRequired"),
    [ShippingStatus.NotYetShipped]: t("fields.order.shippingStatusTypes.NotYetShipped"),
    [ShippingStatus.PartiallyShipped]: t("fields.order.shippingStatusTypes.PartiallyShipped"),
    [ShippingStatus.Shipped]: t("fields.order.shippingStatusTypes.Shipped"),
    [ShippingStatus.Delivered]: t("fields.order.shippingStatusTypes.Delivered"),
    [ShippingStatus.Backordered]: t("fields.order.shippingStatusTypes.Backordered"),
  };

  return (
    <FormControl error={error} key={id} fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={defaultValue ?? undefined}
        enumObject={ShippingStatus}
        disabled={disabled}
        customLabels={shippingStatusLabels}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectShippingStatus;
