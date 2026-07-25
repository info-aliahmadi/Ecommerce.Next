import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel";
import CategoryDisplayModel from "../Product/CategoryDisplayModel";
import ProductVariantDisplayModel from "./ProductVariantDisplayModel";

export default interface WishlistItem {
  id: number;
  name: string;
  variant: ProductVariantDisplayModel;
  image?: FileUploadModel;
  categories: CategoryDisplayModel[];
}
