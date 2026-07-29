import AuthorModel from "@root/app/dashboard/(cms)/_types/Article/AuthorModel";

/**
 * Product Review Model
 */
export default interface ProductReviewDisplayModel {
  id: number;
  productId: number;
  userId?: number;
  user?: AuthorModel | undefined;
  isApproved: boolean;
  reviewText: string;
  replyText: string;
  customerNotifiedOfReply: boolean;
  rating: number;
  createdOnUtc?: Date;
}
