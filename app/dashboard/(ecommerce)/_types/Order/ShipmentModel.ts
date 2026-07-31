/**
 * Represents a tax category.
 */
export default interface ShipmentModel {
  /**
   * The ID of the tax category.
   */
  id: number;

  /**
   * The name of the tax category.
   */
  orderId: number;

  /**
   * The name of the tax category.
   */
  trackingNumber: string;

  /**
   * The display order of the tax category.
   */
  shippingAddressSnapshot: string;
  /**
   * The name of the tax category.
   */
  totalWeight: number;

  /**
   * The name of the tax category.
   */
  shippedDateUtc: Date;

  /**
   * The name of the tax category.
   */
  deliveryDateUtc: Date;
  /**
   * The name of the tax category.
   */
  readyForPickupDateUtc: Date;
  /**
   * The name of the tax category.
   */
  recipientName: string;
  /**
   * The name of the tax category.
   */
  phoneNumber: string;
  /**
   * The name of the tax category.
   */
  email: string;
  /**
   * The name of the tax category.
   */
  adminComment: string;
  /**
   * The name of the tax category.
   */
  createdOnUtc: Date;
  /**
   * The name of the tax category.
   */
  shipmentItems: number;


}