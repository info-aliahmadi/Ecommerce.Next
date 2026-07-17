import AttributeType from "@root/app/types/enums/AttributeType";

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
    key: string;
  
    /**
     * The type of the product attribute.
     */
    attributeType: AttributeType; // Assuming AttributeType is defined elsewhere
  
    /**
     * The ID of the associated image (nullable).
     */
    imagePreviewId: number | null;
  
    /**
     * The display order of the product attribute.
     */
    displayOrder: number;
  
    /**
     * The description of the product attribute (nullable).
     */
    description: string | null;
    /**
     * The display order of the product attribute.
     */
    showOnHomepage: boolean;
  }
  