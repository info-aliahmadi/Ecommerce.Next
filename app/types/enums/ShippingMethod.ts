export enum ShippingMethod {
    Ground = 1,
    NextDayAir = 2,
    SecondDayAir = 3,
}

export default ShippingMethod;

export const shippingMethodLabelKeys: Record<number, string> = {
    [ShippingMethod.Ground]: 'fields.order.shippingMethodTypes.Ground',
    [ShippingMethod.NextDayAir]: 'fields.order.shippingMethodTypes.NextDayAir',
    [ShippingMethod.SecondDayAir]: 'fields.order.shippingMethodTypes.SecondDayAir',
};