'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Check, Loader2, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '../../../_components/ui/button';
import { Textarea } from '../../../_components/ui/textarea';
import ProfileService from '../../../_services/ProfileService';
import ProductReviewDisplayModel from '../../../_types/Product/ProductReviewDisplayModel';

function StarRatingInput({
  value,
  onChange,
  size = 24,
}: Readonly<{
  value: number;
  onChange: (v: number) => void;
  size?: number;
}>) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starVal = i + 1;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(starVal)}
            onMouseEnter={() => setHover(starVal)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              size={size}
              className={`transition-colors ${starVal <= (hover || value)
                ? 'fill-ecommerce-amber text-ecommerce-amber'
                : 'text-ecommerce-border'
                }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function ReviewForm({ productId, existingReview }: { productId: number; existingReview?: ProductReviewDisplayModel }) {
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
          setTimeout(() => window.location.reload(), 800);
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
        <StarRatingInput
          value={rating}
          onChange={(v) => setRating(v)}
          size={22}
        />
      </div>
      <Textarea
        placeholder="Your review..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows={3}
        className="text-sm border-ecommerce-border resize-none"
        required
      />
      <Button
        type="submit"
        disabled={submittingReview || rating === 0 || !reviewText.trim()}
        className="w-full h-9 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white text-sm font-medium rounded-lg gap-2 disabled:opacity-50"
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
