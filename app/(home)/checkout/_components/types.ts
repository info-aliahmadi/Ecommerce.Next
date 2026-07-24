export type CheckoutStep = 1 | 2 | 3 | 4;
export type PaymentMethod = 'card' | 'paypal' | 'cod';

export interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  saveAddress: boolean;
  addressId?: number;
}

export interface PaymentForm {
  method: PaymentMethod;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export const VALID_PROMOS: Record<string, { type: 'percent'; value: number } | { type: 'fixed'; value: number }> = {
  WELCOME15: { type: 'percent', value: 15 },
  SAVE10: { type: 'fixed', value: 10 },
};

export const PAYMENT_METHOD_MAP: Record<PaymentMethod, number> = {
  card: 1,
  paypal: 2,
  cod: 3,
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
