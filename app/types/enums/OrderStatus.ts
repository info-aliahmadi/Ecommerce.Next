export enum OrderStatus {
  Pending = 1,
  Processing = 2,
  Complete = 3,
  Cancelled = 4,
}

export default OrderStatus;

export const orderStatusLabelKeys: Record<number, string> = {
  [OrderStatus.Pending]: "fields.order.orderStatusTypes.Pending",
  [OrderStatus.Processing]: "fields.order.orderStatusTypes.Processing",
  [OrderStatus.Complete]: "fields.order.orderStatusTypes.Complete",
  [OrderStatus.Cancelled]: "fields.order.orderStatusTypes.Cancelled",
};