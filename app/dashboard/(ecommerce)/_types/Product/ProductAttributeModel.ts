/**
 * Represents a product attribute.
 */
export default interface ProductAttributeModel {
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
    Color = 0,
    Size = 1,
    Weight = 2,
    Length = 3,
    Width = 4,
    Height = 5,
    Material = 6,
    Style = 7,
    Pattern = 8,
    Brand = 9,
    Model = 10,
   
    // ... your enum values
  }