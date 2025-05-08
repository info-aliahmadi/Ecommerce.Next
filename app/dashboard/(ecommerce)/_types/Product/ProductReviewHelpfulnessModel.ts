/**
 * Represents the helpfulness rating of a product review.
 */
export default interface ProductReviewHelpfulnessModel {
    /**
     * The ID of the product review helpfulness record.
     */
    id: number;
  
    /**
     * The ID of the user who rated the helpfulness.
     */
    userId: number;
  
    /**
     * The ID of the product review.
     */
    productReviewId: number;
  
    /**
     * Indicates whether the review was helpful.
     */
    wasHelpful: boolean;
  }