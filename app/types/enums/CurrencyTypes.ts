export enum CurrencyTypes {
  Dinar = 1, // IQD
  Rial = 2, // IRR
  Toman = 3, // IRT
  Dollar = 4, // USD
  Euro = 5, // EU
  None = 0,
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
