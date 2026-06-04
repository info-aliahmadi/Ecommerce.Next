/**
 * Represents a tax category.
 */
export default interface TaxCategoryModel {
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
  
  }