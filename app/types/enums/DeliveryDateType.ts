enum DeliveryDateType {
  // یک روز
  OneDay = 1,
  // 3 روز
  ThreeDays = 2,
  // یک هفته
  OneWeek = 3,
  // یک ماه
  OneMonth = 4
}
export default DeliveryDateType;

export const deliveryDateLabelKeys: Record<number, string> = {
  [DeliveryDateType.OneDay]: "fields.order.deliveryDate.OneDay",
  [DeliveryDateType.ThreeDays]: "fields.order.deliveryDate.ThreeDays",
  [DeliveryDateType.OneWeek]: "fields.order.deliveryDate.OneWeek",
  [DeliveryDateType.OneMonth]: "fields.order.deliveryDate.OneMonth",
};
