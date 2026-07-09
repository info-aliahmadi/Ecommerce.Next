import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel";
import CategoryDisplayModel from "./CategoryDisplayModel";

export default interface CartItem {
  id: number;
  name: string;
  price: number;
  comparePrice?: number;
  image?: FileUploadModel | undefined;
  quantity: number;
  categories: CategoryDisplayModel[];
}