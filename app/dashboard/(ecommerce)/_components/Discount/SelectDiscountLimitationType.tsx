import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import { useTranslations } from 'next-intl';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import { DiscountLimitationType } from '@root/app/types/enums/DiscountLimitationType';

interface SelectDiscountLimitationTypeProps {
  defaultValue?: number | null;
  id: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error: boolean;
  label: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectDiscountLimitationType: React.FC<SelectDiscountLimitationTypeProps> = ({
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

  const discountLimitationTypeLabels = {
    [DiscountLimitationType.Unlimited]: t('fields.discount.discountLimitationTypes.Unlimited'),
    [DiscountLimitationType.NTimesOnly]: t('fields.discount.discountLimitationTypes.NTimesOnly'),
    [DiscountLimitationType.NTimesPerCustomer]: t('fields.discount.discountLimitationTypes.NTimesPerCustomer')
  };

  return (
    <FormControl error={error} key={id} fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={defaultValue ?? 0}
        enumObject={DiscountLimitationType}
        disabled={disabled}
        customLabels={discountLimitationTypeLabels}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectDiscountLimitationType;
