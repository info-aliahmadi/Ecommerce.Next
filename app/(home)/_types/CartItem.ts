import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel";
import CategoryDisplayModel from "./CategoryDisplayModel";
import ProductVariantDisplayModel from "./ProductVariantDisplayModel";

export default interface CartItem {
  id: number;
  name: string;
  variant: ProductVariantDisplayModel;
  image?: FileUploadModel | undefined;
  quantity: number;
  categories: CategoryDisplayModel[];
}