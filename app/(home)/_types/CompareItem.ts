import CategoryDisplayModel from "./CategoryDisplayModel";

export default interface CompareItem {
  id: number;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  categories: CategoryDisplayModel[];
  stock: number;
  description: string;
  sku?: string;
}