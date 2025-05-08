/**
 * Represents a country.
 */
export default interface CountryModel {
    /**
     *
     */
    id: number;
  
    /**
     *
     */
    name: string;
  
    /**
     *
     */
    twoLetterIsoCode: string;
  
    /**
     *
     */
    threeLetterIsoCode: string;
  
    /**
     *
     */
    allowsBilling: boolean;
  
    /**
     *
     */
    allowsShipping: boolean;
  
    /**
     *
     */
    numericIsoCode: number;
  
    /**
     *
     */
    subjectToVat: boolean;
  
    /**
     *
     */
    published: boolean;
  
    /**
     *
     */
    displayOrder: number;
  
    /**
     *
     */
    limitedToStores: boolean;
  
    /**
     *
     */
    addresses: number;
  
    /**
     *
     */
    stateProvinces: number;
  
    /**
     *
     */
    taxRates: number;
  }