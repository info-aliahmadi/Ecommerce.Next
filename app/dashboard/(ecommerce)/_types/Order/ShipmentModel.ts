/**
 * Represents a tax category.
 */
export default interface ShipmentModel {
  /**
   * The ID of the Shipment.
   */
  id: number;

  /**
   * The ID of the order.
   */
  orderId: number;

  /**
   * tracking number
   */
  trackingNumber: string;

  /**
   *  shipping address snapshot
   */
  shippingAddressSnapshot?: string | null;
  /**
   * total Weight of the shipment
   */
  totalWeight: number;

  /**
   * shipped Date Utc
   */
  shippedDateUtc: Date;

  /**
   * delivery Date Utc
   */
  deliveryDateUtc: Date;
  /**
   * ready for pickup Date Utc
   */
  readyForPickupDateUtc: Date;
  /**
   * recipient name
   */
  recipientName?: string| null;
  /**
   * phone number
   */
  phoneNumber?: string| null;
  /**
   * admin comment
   */
  email?: string| null;
  /**
   * admin comment
   */
  adminComment?: string| null;
  /**
   * admin comment
   */
  customerNote?: string| null;
  /**
   * created On Utc
   */
  createdOnUtc?: Date | null;

}