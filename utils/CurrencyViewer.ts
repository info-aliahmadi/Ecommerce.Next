import CurrencyTypes from "@root/app/types/enums/CurrencyTypes";

export default function CurrencyViewer(
  value: number,
  currency: CurrencyTypes,
): string {
  let result;

  const dollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const euro = new Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: 'EUR',
  });
  const dinar = new Intl.NumberFormat('ar-IQ', {
    style: 'currency',
    currency: 'IQD',
  });
  const rial = new Intl.NumberFormat('fa');

  switch (currency) {
    case CurrencyTypes.Dollar: {
      result = dollar.format(value);
      break;
    }
    case CurrencyTypes.Euro: {
      result = euro.format(value);
      break;
    }
    case CurrencyTypes.Dinar: {
      result = dinar.format(value);
      break;
    }
    case CurrencyTypes.Rial: {
      result = `${rial.format(value)} ریال`;
      break;
    }
    case CurrencyTypes.Toman: {
      result = `${value} تومان`;
      break;
    }
    case CurrencyTypes.None: {
      result = value.toString();
      break;
    }
  }
  return result;
}
