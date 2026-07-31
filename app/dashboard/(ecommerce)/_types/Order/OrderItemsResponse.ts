import OrderItemModel, { SumOrderItemsModel } from "./OrderItemModel";

/**
 * OrderItemModel - TypeScript equivalent of the C# model
 */
export default interface OrderItemsResponse {
  /**
   * Item ID
   */
  orderItems: OrderItemModel[];

  /**
   * Associated order ID
   */
  orderSummary: SumOrderItemsModel;
}