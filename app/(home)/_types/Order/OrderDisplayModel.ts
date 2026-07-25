import CurrencyTypes from "@root/app/types/enums/CurrencyTypes";
import OrderStatus from "@root/app/types/enums/OrderStatus";
import ShippingStatus from "@root/app/types/enums/ShippingStatus";
import PaymentStatus from "@root/app/types/enums/PaymentStatus";
import PaymentMethod from "@root/app/types/enums/PaymentMethod";
import ShippingMethod from "@root/app/types/enums/ShippingMethod";
import OrderItemDisplayModel from "./OrderItemDisplayModel";

/**
 * Represents an order.
 */
export default interface OrderDisplayModel {
  /**
   * The ID of the order.
   */
  id: number;

  /**
   * The ID of the shipment associated with the order (nullable).
   */
  shipmentId: number | null;

  /**
   * The ID of the shipping method used for the order (nullable).
   */
  shippingMethodId: ShippingMethod | null;

  /**
   * The ID of the address associated with the order (nullable).
   */
  addressId: number | null;

  /**
   * A snapshot of the address at time of order (nullable).
   */
  addressSnapshot?: string | null;

  /**
   * The ID of the order status.
   */
  orderStatusId: OrderStatus;

  /**
   * The ID of the shipping status.
   */
  shippingStatusId: ShippingStatus;

  /**
   * The ID of the payment status.
   */
  paymentStatusId: PaymentStatus;

  /**
   * The ID of the payment method used for the order.
   */
  paymentMethodId: PaymentMethod;

  /**
   * The user's currency.
   */
  userCurrency: CurrencyTypes | null;

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
   * The date and time the order was created (in UTC).
   */
  createdOnUtc: Date;

  /**
   * The date and time of payment (nullable, UTC).
   */
  paymentDateUtc: Date | null;

  /**
   * Order notes.
   */
  orderNote: string;

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

  /**
   * The order items.
   */
  orderItems: OrderItemDisplayModel[];
}
