'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Check, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '../../../_components/ui/button';
import { Textarea } from '../../../_components/ui/textarea';
import { StarRating } from '../../../_components/ui/star-rating';
import ProfileService from '../../../_services/ProfileService';
import ProductReviewDisplayModel from '../../../_types/Product/ProductReviewDisplayModel';

export default function ReviewForm({
  productId,
  existingReview,
  isQuickView,
  onSuccess,
}: Readonly<{
  productId: number;
  existingReview?: ProductReviewDisplayModel;
  isQuickView?: boolean;
  onSuccess?: (review: ProductReviewDisplayModel) => void;
}>) {
  const { data: session } = useSession();
  const t = useTranslations('');
  const [reviewText, setReviewText] = useState(existingReview?.reviewText || '');
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleSubmitReview = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (rating === 0 || !reviewText.trim()) return;
      if (!session?.user?.accessToken) {
        toast.error(t('homepage.productDetail.loginToReview') || 'Please login to submit a review');
        return;
      }
      setSubmittingReview(true);
      try {
        const service = new ProfileService(session.user.accessToken);
        const review: ProductReviewDisplayModel = {
          id: existingReview?.id || 0,
          productId,
          isApproved: false,
          reviewText: reviewText.trim(),
          replyText: '',
          customerNotifiedOfReply: false,
          rating,
          createdOnUtc: new Date(),
        };

        const result = existingReview?.id
          ? await service.updateUserReview(review)
          : await service.addUserReview(review);

        if (result.succeeded) {
          toast.success(t('homepage.productDetail.reviewSubmitted'));
          if (!existingReview?.id) {
            setReviewText('');
            setRating(0);
          }
          onSuccess?.(result.data ?? review);
        } else {
          toast.error(result.message || 'Failed to submit review');
        }
      } catch {
        toast.error('Failed to submit review');
      } finally {
        setSubmittingReview(false);
      }
    },
    [reviewText, rating, productId, session, existingReview, t],
  );

  if (!session?.user?.accessToken) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-ecommerce-text-muted mb-3">
          {t('homepage.productDetail.loginToReview') || 'Please login to write a review'}
        </p>
        <Button
          onClick={() => window.location.href = '/login'}
          className="h-9 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white text-sm font-medium rounded-lg"
        >
          {t('homepage.common.login') || 'Login'}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitReview} className="space-y-3">
      <div>
        <label className="text-xs text-ecommerce-text-muted mb-1.5 block">
          {t('homepage.productDetail.rating')}
        </label>
        <StarRating rating={rating} size={22} onChange={setRating} />
      </div>
      <Textarea
        placeholder="Your review..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows={3}
        maxLength={300}
        className="text-sm border-ecommerce-border resize-none"
        required
      />
      <Button
        type="submit"
        disabled={submittingReview || rating === 0 || !reviewText.trim()}
        size="lg"
        className={"h-9 px-5 bg-ecommerce-purple hover:bg-ecommerce-purple/90 text-white rounded-lg text-sm font-medium gap-1.5 transition-all" + (isQuickView ? " sm" : "")}
      >
        {submittingReview ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Check size={14} />
        )}
        {existingReview ? (t('homepage.productDetail.updateReview') || 'Update Review') : t('homepage.productDetail.submitReview')}
      </Button>
    </form>
  );
}
