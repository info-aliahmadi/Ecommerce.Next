import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import { useTranslations } from 'next-intl';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import MeasureType from '@root/app/types/enums/MeasureType';

interface SelectMeasureTypeProps {
  defaultValue?: number | null;
  id: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error: boolean;
  label: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectMeasureType: React.FC<SelectMeasureTypeProps> = ({
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

  const measureTypeLabels: Record<number, string> = {
    [MeasureType.Kilogram]: t("fields.product.measureTypes.Kilogram"),
    [MeasureType.Number]: t("fields.product.measureTypes.Number"),
    [MeasureType.Box]: t("fields.product.measureTypes.Box"),
    [MeasureType.Meter]: t("fields.product.measureTypes.Meter"),
    [MeasureType.Litr]: t("fields.product.measureTypes.Litr"),
    [MeasureType.Gram]: t("fields.product.measureTypes.Gram"),
    [MeasureType.Mesghal]: t("fields.product.measureTypes.Mesghal")
  };
  return (
    <FormControl error={error} key={id} fullWidth>
      <InputLabel id={`meas-${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={defaultValue ?? 0}
        enumObject={MeasureType}
        customLabels={measureTypeLabels}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
        disabled={disabled}
      />
    </FormControl>
  );
};

export default SelectMeasureType;
