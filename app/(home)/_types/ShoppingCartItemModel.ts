export default interface ShoppingCartItemModel {
  id: number;
  userId: number;
  productVariantId: number;
  shoppingCartTypeId: number;
  quantity: number;
  createdOnUtc: string;
  updatedOnUtc: string;
}
