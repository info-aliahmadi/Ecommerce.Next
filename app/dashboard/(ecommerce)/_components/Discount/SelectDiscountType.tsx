import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import { useTranslations } from 'next-intl';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import { DiscountType } from '@root/app/types/enums/DiscountType';

interface SelectDiscountTypeProps {
  defaultValue?: number | null;
  id: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error: boolean;
  label?: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectDiscountType: React.FC<SelectDiscountTypeProps> = ({
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

  const discountTypeLabels = {
    [DiscountType.AssignedToCouponCode]: t('fields.discount.discountTypes.AssignedToCouponCode'),
    [DiscountType.AssignedToOrderTotal]: t('fields.discount.discountTypes.AssignedToOrderTotal'),
    [DiscountType.AssignedToProducts]: t('fields.discount.discountTypes.AssignedToProducts'),
    [DiscountType.AssignedToCategories]: t('fields.discount.discountTypes.AssignedToCategories'),
    [DiscountType.AssignedToManufacturers]: t('fields.discount.discountTypes.AssignedToManufacturers')
  };

  return (
    <FormControl error={error} key={id} fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={defaultValue ?? 0}
        enumObject={DiscountType}
        disabled={disabled}
        customLabels={discountTypeLabels}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectDiscountType;
