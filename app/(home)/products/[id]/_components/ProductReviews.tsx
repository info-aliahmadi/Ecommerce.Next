'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import ProductReviewDisplayModel from '../../../_types/Product/ProductReviewDisplayModel';
import { Star, User } from 'lucide-react';
import { useLocaleStore } from '../../../_lib/store';
import ReviewForm from './ReviewForm';

export default function ProductReviews({ productId, reviews = [] }: { productId: number; reviews?: ProductReviewDisplayModel[] }) {
  const { data: session } = useSession();
  const t = useTranslations('');
  const locale = useLocaleStore((s) => s.locale);

  const currentUserId = (session?.user as any)?.id;
  const userReview = currentUserId != null
    ? reviews.find((r) => r.userId === currentUserId)
    : undefined;

  const approvedReviews = reviews.filter((r) => r.isApproved && r.userId !== currentUserId);
  const total = approvedReviews.length;

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(locale === 'fa' ? 'fa-IR' : locale === 'ar' ? 'ar-SA' : undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Rating Breakdown */}
      <div className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-6">
        <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-4">
          {t('homepage.productDetail.rating')} {t('homepage.productDetail.reviewsTab').toLowerCase()}
        </h4>
        {total === 0 && !userReview ? (
          <p className="text-xs text-ecommerce-text-muted">{t('homepage.productDetail.noReviewsYet')}</p>
        ) : (
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = approvedReviews.filter((r) => r.rating === star).length;
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-ecommerce-text-muted w-6">{star}</span>
                  <Star size={12} className="text-ecommerce-amber fill-ecommerce-amber shrink-0" />
                  <div className="flex-1 h-2 bg-ecommerce-border rounded-full overflow-hidden">
                    <div className="h-full bg-ecommerce-amber rounded-full transition-all" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-xs text-ecommerce-text-muted w-8 text-end">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* User's Existing Review */}
      {userReview && (
        <div className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-ecommerce-text-primary">
              {t('homepage.productDetail.updateReview') || 'Your Review'}
            </h4>
          </div>
          <ReviewForm productId={userReview.productId} existingReview={userReview} />
        </div>
      )}

      {/* Write Review (only if user is logged in and hasn't reviewed yet) */}
      {!userReview && session?.user?.accessToken && (
        <div className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5">
          <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-4">
            {t('homepage.productDetail.writeReview')}
          </h4>
          <ReviewForm productId={productId} />
        </div>
      )}

      {/* Login prompt for non-authenticated users */}
      {!userReview && !session?.user?.accessToken && (
        <div className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-6 text-center">
          <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-2">
            {t('homepage.productDetail.writeReview')}
          </h4>
          <p className="text-sm text-ecommerce-text-muted mb-3">
            {t('homepage.productDetail.loginToReview') || 'Please login to write a review'}
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="h-9 px-4 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white text-sm font-medium rounded-lg"
          >
            {t('homepage.common.login') || 'Login'}
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {approvedReviews.length === 0 && !userReview ? (
          <div className="text-center py-8">
            <p className="text-sm text-ecommerce-text-muted">{t('homepage.productDetail.noReviewsYet')}</p>
          </div>
        ) : (
          approvedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-ecommerce-border/50 flex items-center justify-center">
                    <User size={14} className="text-ecommerce-text-muted" />
                  </div>
                  <span className="text-sm font-medium text-ecommerce-text-primary">
                    {review.fullName || 'Anonymous'}
                  </span>
                </div>
                <span className="text-xs text-ecommerce-text-muted">
                  {formatDate(review.createdOnUtc)}
                </span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < review.rating
                        ? 'fill-ecommerce-amber text-ecommerce-amber'
                        : 'text-ecommerce-border'
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-ecommerce-text-secondary leading-relaxed">{review.reviewText}</p>
              {review.replyText && (
                <div className="mt-3 pt-3 border-t border-ecommerce-border">
                  <p className="text-xs text-ecommerce-text-muted">{review.replyText}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
