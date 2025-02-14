/**
 * Represents a state or province.
 */
export interface StateProvinceModel {
    /**
     * The ID of the state/province.
     */
    id: number;
  
    /**
     * The name of the state/province.
     */
    name: string;
  
    /**
     * The abbreviation of the state/province (e.g., CA, NY).
     */
    abbreviation: string;
  
    /**
     * The ID of the country to which the state/province belongs.
     */
    countryId: number;
  
    /**
     * Indicates whether the state/province is published.
     */
    published: boolean;
  
    /**
     * The display order of the state/province.
     */
    displayOrder: number;
  
    /**
     * The number of addresses associated with this state/province.
     */
    addresses: number;
  
    /**
     * The number of tax rates associated with this state/province.
     */
    taxRates: number;
  }
  