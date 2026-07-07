import CategoryDisplayModel from "./CategoryDisplayModel";

export default interface WishlistItem {
  id: number;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  categories: CategoryDisplayModel[];
}
