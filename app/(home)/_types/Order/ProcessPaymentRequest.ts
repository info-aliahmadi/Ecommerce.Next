export default interface ProcessPaymentRequest {
  orderId: number;
  paymentMethodId?: number | null;
  cardName: string;
  cardNumber: string;
  cardCvv2: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
}
