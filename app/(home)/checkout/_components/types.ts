import AddressModel from "@root/app/dashboard/(ecommerce)/_types/Common/AddressModel";
import PaymentMethod from "@root/app/types/enums/PaymentMethod";

export type CheckoutStep = 1 | 2 | 3 | 4;

export interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  address: AddressModel;
  addressId?: number;
  note?: string;
}

export interface PaymentForm {
  method: PaymentMethod;
}

export const VALID_PROMOS: Record<string, { type: 'percent'; value: number } | { type: 'fixed'; value: number }> = {
  WELCOME15: { type: 'percent', value: 15 },
  SAVE10: { type: 'fixed', value: 10 },
};
