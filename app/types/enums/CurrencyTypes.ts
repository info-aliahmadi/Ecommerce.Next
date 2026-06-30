export enum CurrencyTypes {
  None = 0,
  Rial = 1, // IRR
  Toman = 2, // IRT
  Dinar = 3, // IQD
  Dollar = 4, // USD
  Euro = 5, // EU
}

export default CurrencyTypes;

export const currencyCodeMap: {[key in CurrencyTypes]: string} = {
  [CurrencyTypes.Dinar]: 'IQD',
  [CurrencyTypes.Rial]: 'ریال',
  [CurrencyTypes.Toman]: 'تومان',
  [CurrencyTypes.Dollar]: 'USD',
  [CurrencyTypes.Euro]: 'EUR',
  [CurrencyTypes.None]: '',
};
