import ShippingMethod from "@root/app/types/enums/ShippingMethod";

export default interface CreateOrderRequest {
  addressId?: number | null;
  shippingMethodId?: ShippingMethod;
  paymentMethodId?: number | null;
  discountId?: number | null;
  orderNote?: string;
  items: CreateOrderItemRequest[];
}
export interface CreateOrderItemRequest {
  productVariantId: number;
  quantity: number;
  unitPrice: number;
}