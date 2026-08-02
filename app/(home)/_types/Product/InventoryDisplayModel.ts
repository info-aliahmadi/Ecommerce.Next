/**
 * Represents product inventory information.
 */
export default interface InventoryDisplayModel {
  /**
  /**
   * The ID of the product inventory record.
   */
  id: number;

  /**
   * The variantId of the associated product.
   */
  variantId: number;
  /**
   * The stockQuantity of the associated product.
   */
  stockQuantity: number;
  /**
   * The reservedQuantity of the associated product.
   */
  reservedQuantity: number;

}

export function getAvailableStock(inventory: InventoryDisplayModel | undefined | null): number {
  if (!inventory) return 0;
  return Math.max(0, inventory.stockQuantity - inventory.reservedQuantity);
}

export function canAddToCart(inventory: InventoryDisplayModel | undefined | null, currentCartQuantity: number, addQuantity: number = 1): boolean {
  const available = getAvailableStock(inventory);
  return currentCartQuantity + addQuantity <= available;
}
