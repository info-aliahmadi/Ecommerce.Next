/**
 * Represents a tax rate.
 */
export interface TaxRateModel {
    /**
     * The ID of the tax rate.
     */
    id: number;
  
    /**
     * The ID of the tax category to which the tax rate belongs.
     */
    taxCategoryId: number;
  
    /**
     * The ID of the country to which the tax rate applies.
     */
    countryId: number;
  
    /**
     * The ID of the state/province to which the tax rate applies (nullable).
     */
    stateProvinceId: number | null; // Made nullable as it might not always be required
  
    /**
     * The tax percentage.
     */
    percentage: number;
  }