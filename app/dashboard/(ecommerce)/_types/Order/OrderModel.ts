
/**
 * Represents an order.
 */
export default interface OrderModel {
  /**
   * The ID of the order.
   */
  id: number;

  /**
   * The ID of the user who placed the order.
   */
  userId: number;

  /**
   * The user name of the user who placed the order.
   */
  userName: string;

  /**
   * The ID of the shipment associated with the order (nullable).
   */
  shipmentId: number | null;

  /**
   * The ID of the address associated with the order (nullable).
   */
  addressId: number | null;

  /**
   * The ID of the shipping method used for the order (nullable).
   */
  shippingMethodId: number | null;

  /**
   * The title of the shipping method.
   */
  shippingMethodTitle: string;

  /**
   * The ID of the order status.
   */
  orderStatusId: number; // Changed to number for consistency

  /**
   * The ID of the shipping status.
   */
  shippingStatusId: number; // Changed to number for consistency

  /**
   * The title of the shipping status (derived property - not stored).
   */
  shippingStatusTitle: string; // Type is string

  /**
   * The ID of the payment status.
   */
  paymentStatusId: number; // Changed to number for consistency

  /**
   * The title of the payment status (derived property - not stored).
   */
  paymentStatusTitle: string; // Type is string

  /**
   * The ID of the payment method used for the order (nullable).
   */
  paymentMethodId: number | null;

  /**
   * The ID of the user's currency used for the order (nullable).
   */
  userCurrencyId: number | null;

  /**
   * The user's currency.
   */
  userCurrency: string | null;

  /**
   * The final price of the order.
   */
  finalPrice: number;

  /**
   * The amount refunded for the order.
   */
  refundedAmount: number;

  /**
   * The customer's IP address.
   */
  customerIp: string;

  /**
   * Indicates whether storing the credit card number is allowed.
   */
  allowStoringCreditCardNumber: boolean;

  /**
   * The date and time the order was paid (nullable, UTC).
   */
  paidDateUtc: Date | null;

  /**
   * Indicates whether the order is deleted.
   */
  deleted: boolean;

  /**
   * The date and time the order was created (in UTC).
   */
  createdOnUtc: Date;

  /**
   * The created on UTC string for display.
   */
  createdOnUtcString: string; // Type is string

  /**
   * The date and time of payment (nullable, UTC).
   */
  paymentDateUtc: Date | null;

  /**
   * The payment date UTC string for display.
   */
  paymentDateUtcToString: string; // Type is string

  /**
   * Order notes.
   */
  orderNotes: string[];

  /**
   * The shipping tax amount.
   */
  shippingTax: number;

  /**
   * The shipping amount.
   */
  shippingAmount: number;

  /**
   * The shipping tax amount.
   */
  shippingAmountTax: number;

  /**
   * The total tax amount.
   */
  taxAmount: number;

  /**
   * The discount amount.
   */
  discountAmount: number;

  /**
   * The total amount of the order.
   */
  totalAmount: number;

  /**
   * The transaction tracking code.
   */
  transactionTrackingCode: string;

  /**
   * The payment tracking code.
   */
  paymentTrackingCode: string;

  /**
   * The shipping tracking number.
   */
  trackingNumber: string;
}