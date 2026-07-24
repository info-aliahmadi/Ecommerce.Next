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
  method: 'card' | 'paypal' | 'cod';
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export const VALID_PROMOS: Record<string, { type: 'percent'; value: number } | { type: 'fixed'; value: number }> = {
  WELCOME15: { type: 'percent', value: 15 },
  SAVE10: { type: 'fixed', value: 10 },
};

// Maps checkout payment method to OrderDisplayModel PaymentMethod enum
export const PAYMENT_METHOD_MAP: Record<'card' | 'paypal' | 'cod', PaymentMethod> = {
  card: PaymentMethod.CreditCard,
  paypal: PaymentMethod.PayPal,
  cod: PaymentMethod.CashOnDelivery,
};

export function formatCardNumber(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}
