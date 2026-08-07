import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel";
import CategoryDisplayModel from "../Product/CategoryDisplayModel";
import ProductVariantDisplayModel from "../Product/ProductVariantDisplayModel";
import ManufacturerDisplayModel from "../Product/ManufacturerDisplayModel";

export default interface WishlistItem {
  id: number;
  name: string;
  variant: ProductVariantDisplayModel;
  image?: FileUploadModel;
  categories: CategoryDisplayModel[];
  manufacturers: ManufacturerDisplayModel[];
}
