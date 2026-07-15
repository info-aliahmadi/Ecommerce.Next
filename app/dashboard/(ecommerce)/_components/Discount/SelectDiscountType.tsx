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
  label: string;
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
    [DiscountType.AssignedToOrderTotal]: t('fields.discount.discountTypes.AssignedToOrderTotal'),
    [DiscountType.AssignedToSkus]: t('fields.discount.discountTypes.AssignedToSkus'),
    [DiscountType.AssignedToCategories]: t('fields.discount.discountTypes.AssignedToCategories'),
    [DiscountType.AssignedToManufacturers]: t('fields.discount.discountTypes.AssignedToManufacturers'),
    [DiscountType.AssignedToShipping]: t('fields.discount.discountTypes.AssignedToShipping'),
    [DiscountType.AssignedToOrderSubTotal]: t('fields.discount.discountTypes.AssignedToOrderSubTotal')
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
