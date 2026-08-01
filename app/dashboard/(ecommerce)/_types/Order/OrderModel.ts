import CurrencyTypes from "@root/app/types/enums/CurrencyTypes";
import OrderStatus from "@root/app/types/enums/OrderStatus";
import PaymentMethod from "@root/app/types/enums/PaymentMethod";
import PaymentStatus from "@root/app/types/enums/PaymentStatus";
import ShippingMethod from "@root/app/types/enums/ShippingMethod";
import ShippingStatus from "@root/app/types/enums/ShippingStatus";
import AddressModel from "../Common/AddressModel";

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
   * The user name of the user who placed the order.
   */
  userAvatar: string;

  /**
   * The ID of the shipment associated with the order (nullable).
   */
  shipmentId: number | null;

  /**
   * The ID of the address associated with the order (nullable).
   */
  addressId: number | null;

  /**
   * The ID of the address associated with the order (nullable).
   */
  address: AddressModel | null;
  /**
   * The ID of the address associated with the order (nullable).
   */
  addressSnapshot: string | null;

  /**
   * The ID of the shipping method used for the order (nullable).
   */
  shippingMethodId: ShippingMethod | null;

  /**
   * The ID of the order status.
   */
  orderStatusId: OrderStatus; // Changed to number for consistency

  /**
   * The ID of the shipping status.
   */
  shippingStatusId: ShippingStatus; // Changed to number for consistency

  /**
   * The ID of the payment status.
   */
  paymentStatusId: PaymentStatus; // Changed to number for consistency

  /**
   * The ID of the payment method used for the order (nullable).
   */
  paymentMethodId: PaymentMethod | null;

  /**
   * The user's currency.
   */
  userCurrencyType: CurrencyTypes;

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
   * Indicates whether the order is deleted.
   */
  deleted: boolean;

  /**
   * The date and time the order was created (in UTC).
   */
  createdOnUtc: Date;


  /**
   * The date and time of payment (nullable, UTC).
   */
  paymentDateUtc?: Date | null;


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