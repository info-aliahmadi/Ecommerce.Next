export enum DiscountLimitationType {
    /// <summary>
    /// None
    /// </summary>
    Unlimited = 0,

    /// <summary>
    /// N Times Only
    /// </summary>
    NTimesOnly = 15,

    /// <summary>
    /// N Times Per Customer
    /// </summary>
    NTimesPerCustomer = 25
}

export const discountLimitationTypeLabelKeys = {
  [DiscountLimitationType.Unlimited]: "fields.discount.discountLimitationTypes.Unlimited",
  [DiscountLimitationType.NTimesOnly]: "fields.discount.discountLimitationTypes.NTimesOnly",
  [DiscountLimitationType.NTimesPerCustomer]: "fields.discount.discountLimitationTypes.NTimesPerCustomer"
};