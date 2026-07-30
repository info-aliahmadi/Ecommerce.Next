import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel";
import ProductDisplayModel from "./ProductDisplayModel";
/**
 * Represents a product.
 */
export default interface CuratedStyleProductModel {
  attributeId: number;
  attributeName: string;
  attributeKey: string;
  attributeValue?: string;
  attributeDescription: string;
  imagePreview: FileUploadModel;
  products: ProductDisplayModel[];
}
