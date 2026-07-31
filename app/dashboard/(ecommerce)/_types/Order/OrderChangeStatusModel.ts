import OrderStatus from "@root/app/types/enums/OrderStatus";
import PaymentMethod from "@root/app/types/enums/PaymentMethod";
import PaymentStatus from "@root/app/types/enums/PaymentStatus";
import ShippingMethod from "@root/app/types/enums/ShippingMethod";
import ShippingStatus from "@root/app/types/enums/ShippingStatus";

/**
 * Represents an order.
 */
export default interface OrderChangeStatusModel {
  /**
   * The ID of the order.
   */
  orderId: number;

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

}