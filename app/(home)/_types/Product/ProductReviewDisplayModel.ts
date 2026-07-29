/**
 * Product Review Model
 */
export default interface ProductReviewDisplayModel {
  /**
   * The ID of the product.
   */
  id: number;
  /**
   * product id
   */
  productId: number;
  /**
   * isApproved
   */
  isApproved: boolean;
  /**
   * review Text
   */
  reviewText: string;
  /**
   * reply admin Text
   */
  replyText: string;
  /**
   * customer Notified Of Reply
   */
  customerNotifiedOfReply: boolean;
  /**
   * rating (1-5)
   */
  rating: number;
  /**
   * createdOnUtc
   */
  createdOnUtc: Date;
}
