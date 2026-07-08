import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel";
import AttributeType from "@root/app/types/enums/AttributeType";

export default interface ProductAttributeDisplayModel {
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
     * The ID of the associated image (nullable).
     */
    imagePreview?: FileUploadModel;
  
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
