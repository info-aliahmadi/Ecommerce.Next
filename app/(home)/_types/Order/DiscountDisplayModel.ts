import { DiscountLimitationType } from "@root/app/types/enums/DiscountLimitationType";
import { DiscountType } from "@root/app/types/enums/DiscountType";

/**
 * Represents a discount.
 */
export default interface DiscountDisplayModel {
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
  maximumDiscountAmount?: number | null;

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
  orderTotal: number;

  /**
   * Indicates whether the discount is active.
   */
  productIds: number[];
  /**
   * Indicates whether the discount is active.
   */
  categoryIds: number[];
  /**
   * Indicates whether the discount is active.
   */
  manufacturerIds: number[];

}




