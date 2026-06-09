/**
 * Represents product inventory information.
 */
export default interface InventoryModel {
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
    attributeId: number | undefined;
  
    /**
     * The name of the associated attribute (nullable).
     */
    attributeName: string | undefined;
  
    /**
     * The stock type.
     */
    stockType: StockType; 
  
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
    buyUnitPrice : number;
  }
  
  export enum StockType {
    Total = 0,
    PerAttribute = 1
  }