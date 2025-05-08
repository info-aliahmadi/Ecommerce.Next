/**
 * Represents a delivery date option.
 */
export default interface DeliveryDateModel {
    /**
     * The ID of the delivery date option.
     */
    id: number;
  
    /**
     * The name of the delivery date option.
     */
    name: string;
  
    /**
     * The display order of the delivery date option.
     */
    displayOrder: number;
  
    /**
     * The number of products associated with this delivery date option.
     */
    products: number;
  }