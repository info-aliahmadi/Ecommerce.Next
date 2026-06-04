/**
 * Represents a tax rate.
 */
export default interface TaxRateModel {
    /**
     * The ID of the tax rate.
     */
    id: number;
  
    /**
     * The ID of the tax category to which the tax rate belongs.
     */
    taxCategoryId: number;
    /**
     * The ID of the tax category to which the tax rate belongs.
     */
    taxCategoryName: string;
  
    /**
     * The ID of the country to which the tax rate applies.
     */
    countryId: number;
    /**
     * The ID of the country to which the tax rate applies.
     */
    countryName: string;
  
    /**
     * The tax percentage.
     */
    percentage: number;
  }