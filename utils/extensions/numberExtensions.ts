import CurrencyTypes from '@root/app/types/enums/CurrencyTypes';

declare global {
  interface Number {
    toCurrency(currencyType?: CurrencyTypes | undefined): string | React.ReactNode;
    toFormattedCurrency(currencyType?: CurrencyTypes | undefined): number;
  }
}

Number.prototype.toCurrency = function (currencyType?: CurrencyTypes | undefined): string {
  // Only run on client side to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return this.toString();
  }

  if (currencyType == undefined || currencyType == null || this == undefined)
    return '';

  const getCurrencySettings = (type: CurrencyTypes) => {
    switch (type) {
      case CurrencyTypes.Dinar:
        return { code: 'IQD', symbol: 'د.ع' };
      case CurrencyTypes.Rial:
        return { code: 'ریال', symbol: '﷼' };
      case CurrencyTypes.Toman:
        return { code: 'تومان', symbol: 'تومان' };
      case CurrencyTypes.Dollar:
        return { code: 'USD', symbol: '$' };
      case CurrencyTypes.Euro:
        return { code: 'EUR', symbol: '€' };
      case CurrencyTypes.None:
        return { code: '', symbol: '' };
      default:
        return { code: 'UNK', symbol: '?' };
    }
  };
  const { code, symbol } = getCurrencySettings(
    currencyType ?? CurrencyTypes.Dinar,
  );

  const value = Number(this).toFormattedCurrency(currencyType);
  return `${value.toLocaleString()}${symbol}`;

  //   return this.toLocaleString('en-US', {
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  //     style: 'currency',
  //     currency: 'IQD',
  //     currencyDisplay: 'symbol',
  //     compactDisplay: 'long',
  //     notation: 'standard',
  //     currencySign: 'standard',
  //   });
};

// New extension for formatted currency with decimal handling
Number.prototype.toFormattedCurrency = function (currencyType?: CurrencyTypes | undefined): number {
  const value = Number(this);

  // Format based on currency type
  if (
    currencyType === CurrencyTypes.Dollar ||
    currencyType === CurrencyTypes.Euro
  ) {
    // For USD and Euro: keep 2 decimal places
    return Number(value.toFixed(2));
  } else {
    // For other currencies: truncate all decimal places
    return Math.trunc(value);
  }
};

export { }; // Ensure this file is a module
