/**
 * Represents a product review.
 */
export interface ProductReviewModel {
    /**
     * The ID of the product review.
     */
    id: number;
  
    /**
     * The ID of the user who wrote the review.
     */
    userId: number;
  
    /**
     * The ID of the product being reviewed.
     */
    productId: number;
  
    /**
     * Indicates whether the review is approved.
     */
    isApproved: boolean;
  
    /**
     * The title of the review.
     */
    title: string;
  
    /**
     * The text of the review.
     */
    reviewText: string;
  
    /**
     * The reply text to the review.
     */
    replyText: string;
  
    /**
     * Indicates whether the customer was notified of the reply.
     */
    customerNotifiedOfReply: boolean;
  
    /**
     * The rating given in the review.
     */
    rating: number;
  
    /**
     * The total number of helpful "yes" votes.
     */
    helpfulYesTotal: number;
  
    /**
     * The total number of helpful "no" votes.
     */
    helpfulNoTotal: number;
  
    /**
     * The date and time the review was created (in UTC).
     */
    createdOnUtc: Date;
  
    /**
     * The number of product review helpfulness ratings.
     */
    productReviewHelpfulnesses: number;
  }