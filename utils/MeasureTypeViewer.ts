import MeasureType from "@root/app/types/enums/MeasureType";
import { useTranslations } from "next-intl";

export default function MeasureTypeViewer(
  value: number,
  measureType: MeasureType,
): string {
  const formatted = new Intl.NumberFormat('en-US').format(value);
  const t = useTranslations('fields.product.measureTypesSymbol.');

  switch (measureType) {
    case MeasureType.Kilogram:
      return `${formatted} ${t("Kilogram")}`;
    case MeasureType.Gram:
      return `${formatted} ${t("Gram")}`;
    case MeasureType.Meter:
      return `${formatted} ${t("Meter")}`;
    case MeasureType.Litr:
      return `${formatted} ${t("Litr")}`;
    case MeasureType.Box:
      return `${formatted} ${t("Box")}`;
    case MeasureType.Mesghal:
      return `${formatted} ${t("Mesghal")}`;
    case MeasureType.Number:
      return `${formatted} ${t("Number")}`;
    default:
      return formatted;
  }
}
export function MeasureTypeSymbolViewer(
  measureType: MeasureType,
): string {
  const t = useTranslations('fields.product.measureTypesSymbol.');
  switch (measureType) {
    case MeasureType.Kilogram:
      return t("Kilogram");
    case MeasureType.Gram:
      return t("Gram");
    case MeasureType.Meter:
      return t("Meter");
    case MeasureType.Litr:
      return t("Litr");
    case MeasureType.Box:
      return t("Box");
    case MeasureType.Mesghal:
      return t("Mesghal");
    case MeasureType.Number:
    default:
      return t("Number");
  }
}
