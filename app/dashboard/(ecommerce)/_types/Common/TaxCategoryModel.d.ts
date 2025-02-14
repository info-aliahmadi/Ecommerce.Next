/**
 * Represents a tax category.
 */
export interface TaxCategoryModel {
    /**
     * The ID of the tax category.
     */
    id: number;
  
    /**
     * The name of the tax category.
     */
    name: string;
  
    /**
     * The display order of the tax category.
     */
    displayOrder: number;
  
    /**
     * The number of products associated with this tax category.
     */
    products: number;
  
    /**
     * The number of tax rates associated with this tax category.
     */
    taxRates: number;
  }