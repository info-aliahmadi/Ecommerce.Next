import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel";
import CategoryDisplayModel from "./CategoryDisplayModel";

export default interface WishlistItem {
  id: number;
  name: string;
  price: number;
  comparePrice?: number;
  image?: FileUploadModel;
  categories: CategoryDisplayModel[];
}
