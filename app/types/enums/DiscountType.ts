// Example Enum Definitions (If not defined elsewhere)
export enum DiscountType {
  /// <summary>
  /// Assigned to Coupon Code
  /// </summary>
  AssignedToCouponCode = 1,

  /// <summary>
  /// Assigned to Order Total
  /// </summary>
  AssignedToOrderTotal = 2,

  /// <summary>
  /// Assigned to Products
  /// </summary>
  AssignedToProducts = 3,

  /// <summary>
  /// Assigned to Categories
  /// </summary>
  AssignedToCategories = 4,

  /// <summary>
  /// Assigned to Manufacturer
  /// </summary>
  AssignedToManufacturers = 5
}
export const discountTypeLabelKeys = {
  [DiscountType.AssignedToCouponCode]: 'fields.discount.discountTypes.AssignedToCouponCode',
  [DiscountType.AssignedToOrderTotal]: 'fields.discount.discountTypes.AssignedToOrderTotal',
  [DiscountType.AssignedToProducts]: 'fields.discount.discountTypes.AssignedToProducts',
  [DiscountType.AssignedToCategories]: 'fields.discount.discountTypes.AssignedToCategories',
  [DiscountType.AssignedToManufacturers]: 'fields.discount.discountTypes.AssignedToManufacturers'
};