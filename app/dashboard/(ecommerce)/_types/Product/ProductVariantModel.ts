import InventoryModel from "./InventoryModel";
import ProductAttributeModel from "./ProductAttributeModel";

/**
 * Represents a product variant with its own inventory and attributes.
 */
export default interface ProductVariantModel {
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
  productInventory: InventoryModel;

  /**
   * The productAttributes of the Product Variant record.
   */
  productAttributes: ProductAttributeModel[];

}
