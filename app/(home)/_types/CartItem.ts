import CategoryDisplayModel from "./CategoryDisplayModel";

export default interface CartItem {
  id: number;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  quantity: number;
  categories: CategoryDisplayModel[];
}