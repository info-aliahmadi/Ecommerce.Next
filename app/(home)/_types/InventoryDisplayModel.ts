import ProductAttributeDisplayModel from "./ProductAttributeDisplayModel";

/**
 * Represents product inventory information.
 */
export default interface InventoryDisplayModel {
  /**
   * The ID of the product inventory record.
   */
  id: number;

  /**
   * The ID of the associated product.
   */
  productId: number;

  /**
   * The ID of the associated attribute (nullable).
   */
  attributeId?: number | undefined;

  /**
   * The name of the associated attribute (nullable).
   */
  attribute?: ProductAttributeDisplayModel;

  /**
   * The quantity of stock.
   */
  stockQuantity: number;

  /**
   * The quantity of reserved stock.
   */
  reservedQuantity: number;

  /**
   * The unit price of buy stock.
   */
  buyUnitPrice: number;

}
