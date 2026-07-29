/**
 * Product Review Model
 */
export default interface ProductReviewDisplayModel {
  id: number;
  productId: number;
  userId?: number;
  fullName?: string;
  isApproved: boolean;
  reviewText: string;
  replyText: string;
  customerNotifiedOfReply: boolean;
  rating: number;
  createdOnUtc?: Date;
}
