import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel";
import CategoryDisplayModel from "./CategoryDisplayModel";
import ProductVariantDisplayModel from "./ProductVariantDisplayModel";

export default interface CompareItem {
  id: number;
  name: string;
  variant: ProductVariantDisplayModel;
  image?: FileUploadModel;
  rating: number;
  reviewCount: number;
  categories: CategoryDisplayModel[];
  stock: number;
  description: string;
}