/**
 * Represents a currency.
 */
export default interface CurrencyModel {
    /**
     * The ID of the currency.
     */
    id: number;
  
    /**
     * The name of the currency.
     */
    name: string;
  
    /**
     * The currency code (e.g., USD, EUR).
     */
    currencyCode: string;
  
    /**
     * The display locale for the currency.
     */
    displayLocale: string;
  
    /**
     * Custom formatting string for the currency.
     */
    customFormatting: string;
  
    /**
     * The exchange rate for the currency.
     */
    rate: number;
  
    /**
     * Indicates whether the currency is limited to specific stores.
     */
    limitedToStores: boolean;
  
    /**
     * Indicates whether the currency is published.
     */
    published: boolean;
  
    /**
     * The display order of the currency.
     */
    displayOrder: number;
  
    /**
     * The date and time the currency was created (in UTC).
     */
    createdOnUtc: Date;
  
    /**
     * The date and time the currency was last updated (in UTC).
     */
    updatedOnUtc: Date;
  
    /**
     * The ID of the rounding type for the currency.
     */
    roundingTypeId: number;
  
    /**
     * The number of orders associated with the currency.
     */
    orders: number;
  }