/**
 * Represents product inventory information.
 */
export interface ProductInventoryModel {
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
    attributeId: number | null;
  
    /**
     * The name of the associated attribute (nullable).
     */
    attributeName: string | null;
  
    /**
     * The stock type.
     */
    stockType: StockType; // Assuming StockType enum is defined elsewhere
  
    /**
     * The quantity of stock.
     */
    stockQuantity: number;
  
    /**
     * The quantity of reserved stock.
     */
    reservedQuantity: number;
  }
  
  
  // Example Enum Definition (If not defined elsewhere)
  export enum StockType {
    // ... your enum values here
  }