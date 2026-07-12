import MeasureType from "@root/app/types/enums/MeasureType";

export default function MeasureTypeViewer(
  value: number,
  measureType: MeasureType,
): string {
  const formatted = new Intl.NumberFormat('en-US').format(value);

  switch (measureType) {
    case MeasureType.Kilogram:
      return `${formatted} kg`;
    case MeasureType.Gram:
      return `${formatted} g`;
    case MeasureType.Meter:
      return `${formatted} m`;
    case MeasureType.Litr:
      return `${formatted} L`;
    case MeasureType.Box:
      return `${formatted} box`;
    case MeasureType.Mesghal:
      return `${formatted} Misgal`;
    case MeasureType.Number:
    default:
      return formatted;
  }
}
