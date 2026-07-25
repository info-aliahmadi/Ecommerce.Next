export default interface PaymentModel {
  id: number;
  orderId: number;
  transactionTrackingCode: string;
  paymentTrackingCode: string;
  paymentDateUtc: string | null;
  paymentTypeId: number | null;
  status: number | null;
  deleted: boolean;
  createdOnUtc: string;
  cardType: string;
  cardName: string;
  maskedCreditCardNumber: string;
}

export interface PaymentViewModel {
  id: number;
  transactionTrackingCode: string;
  paymentTrackingCode: string;
  paymentDateUtc: string | null;
  paymentTypeId: number | null;
  paymentTypeTitle: string;
  cardName: string;
  cardNumber: string;
  status: number | null;
  statusTitle: string;
}
