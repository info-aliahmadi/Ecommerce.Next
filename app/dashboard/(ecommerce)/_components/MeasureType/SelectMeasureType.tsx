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

  const measureTypeLabels = {
    Kilogram: t("fields.product.measureTypes.Kilogram"),
    Number: t("fields.product.measureTypes.Number"),
    Box: t("fields.product.measureTypes.Box"),
    Meter: t("fields.product.measureTypes.Meter"),
    Litr: t("fields.product.measureTypes.Litr"),
    Gram: t("fields.product.measureTypes.Gram"),
    Mesghal: t("fields.product.measureTypes.Mesghal")
  };
  return (
    <FormControl error={error} key={id} fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={defaultValue ?? null}
        enumObject={MeasureType}
        disabled={disabled}
        customLabels={measureTypeLabels}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectMeasureType;
