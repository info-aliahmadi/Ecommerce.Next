export enum PaymentStatus {
  Pending = 1,
  Authorized = 2,
  Paid = 3,
  PartiallyRefunded = 4,
  Refunded = 5,
  Voided = 6,
}

export default PaymentStatus;


export const paymentStatusLabelKeys: Record<number, string> = {
  [PaymentStatus.Pending]: "fields.order.paymentStatusTypes.Pending",
  [PaymentStatus.Authorized]: "fields.order.paymentStatusTypes.Authorized",
  [PaymentStatus.Paid]: "fields.order.paymentStatusTypes.Paid",
  [PaymentStatus.PartiallyRefunded]: "fields.order.paymentStatusTypes.PartiallyRefunded",
  [PaymentStatus.Refunded]: "fields.order.paymentStatusTypes.Refunded",
  [PaymentStatus.Voided]: "fields.order.paymentStatusTypes.Voided",
};
