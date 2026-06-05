/**
 * Represents a tax category.
 */
export default interface ShippingMethodModel {
    /**
     * The ID of the tax category.
     */
    id: number;
  
    /**
     * The name of the tax category.
     */
    name: string;
    
    /**
     * The name of the tax category.
     */
    description: string;
  
    /**
     * The display order of the tax category.
     */
    displayOrder: number;
  
  }