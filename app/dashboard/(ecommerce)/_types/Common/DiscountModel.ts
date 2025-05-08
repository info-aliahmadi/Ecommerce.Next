/**
 * Represents a discount.
 */
export default interface DiscountModel {
    /**
     * The ID of the discount.
     */
    id: number;
  
    /**
     * The name of the discount.
     */
    name: string;
  
    /**
     * The coupon code associated with the discount.
     */
    couponCode: string;
  
    /**
     * Administrative comments about the discount.
     */
    adminComment: string;
  
    /**
     * The type of discount.
     */
    discountTypeId: DiscountType; // Assuming DiscountType is defined elsewhere
  
    /**
     * Indicates whether the discount is a percentage.
     */
    usePercentage: boolean;
  
    /**
     * The discount percentage.
     */
    discountPercentage: number;
  
    /**
     * The discount amount.
     */
    discountAmount: number;
  
    /**
     * The maximum discount amount (nullable).
     */
    maximumDiscountAmount: number | null;
  
    /**
     * The start date of the discount (nullable, UTC).
     */
    startDateUtc: Date | null;
  
    /**
     * The end date of the discount (nullable, UTC).
     */
    endDateUtc: Date | null;
  
    /**
     * Indicates whether a coupon code is required for the discount.
     */
    requiresCouponCode: boolean;
  
    /**
     * The discount limitation type.
     */
    discountLimitationId: DiscountLimitationType; // Assuming DiscountLimitationType is defined elsewhere
  
    /**
     * The number of times the discount can be used.
     */
    limitationTimes: number;
  
    /**
     * The maximum discounted quantity (nullable).
     */
    maximumDiscountedQuantity: number | null;
  
    /**
     * Indicates whether the discount is active.
     */
    isActive: boolean;
  
    /**
     * The number of order discounts associated with this discount.
     */
    orderDiscounts: number;
  
    /**
     * The number of categories the discount applies to.
     */
    categories: number;
  
    /**
     * The number of manufacturers the discount applies to.
     */
    manufacturers: number;
  
    /**
     * The number of products the discount applies to.
     */
    products: number;
  }
  
  
  // Example Enum Definitions (If not defined elsewhere)
  export enum DiscountType {
    // ... your enum values
  }
  
  export enum DiscountLimitationType {
    // ... your enum values
  }