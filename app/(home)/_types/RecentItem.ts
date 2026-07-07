import CategoryDisplayModel from "./CategoryDisplayModel";

export default interface RecentItem {
  id: number;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  categories: CategoryDisplayModel[];
  viewedAt: number;
}