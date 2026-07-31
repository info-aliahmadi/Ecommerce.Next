import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import { useTranslations } from 'next-intl';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import ShippingMethod from '@root/app/types/enums/ShippingMethod';

interface SelectShippingMethodProps {
  defaultValue?: ShippingMethod | null;
  id: string;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
  error?: boolean;
  label?: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectShippingMethod: React.FC<SelectShippingMethodProps> = ({
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

  const shippingMethodLabels: Record<number, string> = {
    [ShippingMethod.Ground]: t('fields.order.shippingMethodTypes.Ground'),
    [ShippingMethod.NextDayAir]: t('fields.order.shippingMethodTypes.NextDayAir'),
    [ShippingMethod.SecondDayAir]: t('fields.order.shippingMethodTypes.SecondDayAir'),
  };

  return (
    <FormControl error={error} key={id} fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={defaultValue ?? undefined}
        enumObject={ShippingMethod}
        disabled={disabled}
        customLabels={shippingMethodLabels}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectShippingMethod;
