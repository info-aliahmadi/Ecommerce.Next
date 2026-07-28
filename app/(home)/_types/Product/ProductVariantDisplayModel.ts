import InventoryDisplayModel from "./InventoryDisplayModel";
import ProductAttributeDisplayModel from "./ProductAttributeDisplayModel";

/**
 * Represents a product variant with its own inventory and attributes.
 */
export default interface ProductVariantDisplayModel {
  /**
   * The ID of the Product Variant record.
   */
  id: number;

  /**
   * The sku of the Product Variant record.
   */
  sku: string;

  /**
   * The productId of the Product Variant record.
   */
  productId: number;

  /**
   * The sellPrice of the Product Variant record.
   */
  sellPrice: number;

  /**
   * The oldSellPrice of the Product Variant record.
   */
  oldSellPrice: number;

  /**
   * The productInventory of the Product Variant record.
   */
  productInventory: InventoryDisplayModel;

  /**
   * The productAttributes of the Product Variant record.
   */
  productAttributes: ProductAttributeDisplayModel[];

}
