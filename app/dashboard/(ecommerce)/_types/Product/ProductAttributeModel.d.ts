/**
 * Represents a product attribute.
 */
export interface ProductAttributeModel {
    /**
     * The ID of the product attribute.
     */
    id: number;
  
    /**
     * The name of the product attribute.
     */
    name: string;
  
    /**
     * The value of the product attribute.
     */
    value: string;
  
    /**
     * The type of the product attribute.
     */
    attributeType: AttributeType; // Assuming AttributeType is defined elsewhere
  
    /**
     * The ID of the associated picture (nullable).
     */
    pictureId: number | null;
  
    /**
     * The display order of the product attribute.
     */
    displayOrder: number;
  
    /**
     * The description of the product attribute (nullable).
     */
    description: string | null;
  }
  
  // Example Enum Definition (If not defined elsewhere)
  export enum AttributeType {
    // ... your enum values
  }