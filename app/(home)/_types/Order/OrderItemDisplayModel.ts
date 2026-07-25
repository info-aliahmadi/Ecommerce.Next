/**
 * OrderItemModel - TypeScript equivalent of the C# model
 */
export default interface OrderItemDisplayModel {
  /**
   * Item ID
   */
  id: number;

  /**
   * Associated order ID
   */
  orderId: number;

  /**
   * Product ID
   */
  productVariantId: number;

  /**
   * Product name
   */
  productName: string;

  /**
   * Product name
   */
  productSku: string;

  /**
   * Quantity of items
   */
  quantity: number;

  /**
   * Unit price of the item
   */
  unitPrice: number;

  /**
   * Discount amount applied to this item
   */
  discountAmount: number;

  /**
   * Total price (quantity * unitPrice - discountAmount)
   */
  totalPrice: number;

  /**
   * Total price including tax
   */
  totalPriceTax: number;
}

/**
 * SumOrderItemsModel - Summary of order items
 */
export interface SumOrderItemsModel {
  /**
   * Total price of all items
   */
  totalPrice: number;

  /**
   * Total quantity of all items
   */
  totalQuantity: number;

  /**
   * Total discount amount across all items
   */
  totalDiscountAmount?: number;

  /**
   * Total tax amount
   */
  totalTax?: number;
} 