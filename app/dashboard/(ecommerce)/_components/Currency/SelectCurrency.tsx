import React from 'react';
import { FormControl, InputLabel } from '@mui/material';
import { useTranslations } from 'next-intl';
import EnumDropdown from '@dashboard/_components/EnumDropdown';
import CurrencyTypes from '@root/app/types/enums/CurrencyTypes';

interface SelectCurrencyProps {
  defaultValue?: number | null;
  id: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error: boolean;
  label: string;
  disabled?: boolean;
  showNoneOption?: boolean;
}

const SelectCurrency: React.FC<SelectCurrencyProps> = ({
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
    setFieldValue(id, newValue);
  };

  // Create filtered enum object with only Cash and Debit
  const currencyLabels: Record<string, string> = {
    Rial: t("fields.siteSetting.currencyTypes.Rial"),
    Toman: t("fields.siteSetting.currencyTypes.Toman"),
    Dollar: t("fields.siteSetting.currencyTypes.Dollar"),
    Euro: t("fields.siteSetting.currencyTypes.Euro"),
    Dinar: t("fields.siteSetting.currencyTypes.Dinar")
  };
  return (
    <FormControl error={error} key={id} fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <EnumDropdown
        defaultValue={defaultValue || null}
        enumObject={CurrencyTypes}
        customLabels={currencyLabels}
        onChange={handleChange}
        showNoneOption={showNoneOption}
        noneOptionLabel="-"
      />
    </FormControl>
  );
};

export default SelectCurrency;
