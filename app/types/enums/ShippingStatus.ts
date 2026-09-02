export enum ShippingStatus {
  ShippingNotRequired = 1,
  NotYetShipped = 2,
  PartiallyShipped = 3,
  Shipped = 4,
  Delivered = 5,
  Backordered = 6,
}

export default ShippingStatus;

export const shippingStatusLabelKeys: Record<number, string> = {
  [ShippingStatus.ShippingNotRequired]: "fields.order.shippingStatusTypes.ShippingNotRequired",
  [ShippingStatus.NotYetShipped]: "fields.order.shippingStatusTypes.NotYetShipped",
  [ShippingStatus.PartiallyShipped]: "fields.order.shippingStatusTypes.PartiallyShipped",
  [ShippingStatus.Shipped]: "fields.order.shippingStatusTypes.Shipped",
  [ShippingStatus.Delivered]: "fields.order.shippingStatusTypes.Delivered",
  [ShippingStatus.Backordered]: "fields.order.shippingStatusTypes.Backordered",
};