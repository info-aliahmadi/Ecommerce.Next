'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Pencil, X, User } from 'lucide-react';
import CONFIG from '@root/config';
import ProductReviewDisplayModel from '@root/app/(home)/_types/Product/ProductReviewDisplayModel';
import { StarRating } from '@root/app/(home)/_components/ui/star-rating';
import ReviewForm from '@root/app/(home)/products/[id]/_components/ReviewForm';
import { showDistanceToNow } from '@root/utils/DateViewer';

export type ReviewVariant = 'full' | 'quick';

interface ReviewSectionProps {
  productId: number;
  reviews: ProductReviewDisplayModel[];
  reviewsLoading?: boolean;
  reviewCount: number;
  ratingSum: number;
  variant?: ReviewVariant;
}

export default function ProductReviews({ productId, reviews = [], reviewsLoading = false, reviewCount, ratingSum, variant = 'full' }: Readonly<ReviewSectionProps>) {
  const { data: session } = useSession();
  const t = useTranslations('');
  const currentUserId = (session?.user as any)?.id;

  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [localReviews, setLocalReviews] = useState<ProductReviewDisplayModel[]>(reviews);

  const userReview = currentUserId != null
    ? localReviews.find((r) => r.userId === currentUserId)
    : undefined;

  const visibleReviews = localReviews.filter((r) => r.isApproved || r.userId === currentUserId);
  const total = visibleReviews.filter((r) => r.isApproved).length;
  const averageRating = reviewCount > 0 ? ratingSum / reviewCount : 0;

  const getReviewerName = (review: ProductReviewDisplayModel) =>
    review.user?.name || review.user?.userName || review.user?.email || 'Anonymous';

  const getReviewerAvatar = (review: ProductReviewDisplayModel) => {
    const avatar = review.user?.avatar;
    if (avatar) {
      return CONFIG.AVATAR_BASEPATH + avatar;
    }
    return null;
  };

  const handleAddReview = (review: ProductReviewDisplayModel) => {
    setLocalReviews((prev) => [review, ...prev]);
  };

  const handleUpdateReview = (review: ProductReviewDisplayModel) => {
    setLocalReviews((prev) => prev.map((r) => (r.id === review.id ? review : r)));
    setEditingReviewId(null);
  };

  const renderReviewItem = (review: ProductReviewDisplayModel) => {
    const isCurrentUserReview = review.userId === currentUserId;
    const isEditing = editingReviewId === review.id;
    const reviewerName = getReviewerName(review);

    if (isEditing) {
      return (
        <div className={variant === 'full' ? 'bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5' : 'p-3 rounded-xl bg-ecommerce-surface-hover/40 border border-ecommerce-border/30'}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-ecommerce-text-primary">{t('homepage.productDetail.updateReview')}</h4>
            <button onClick={() => setEditingReviewId(null)} className="text-ecommerce-text-muted hover:text-ecommerce-text-primary">
              <X size={16} />
            </button>
          </div>
          <ReviewForm productId={productId} existingReview={review} isQuickView={variant === 'quick'} onSuccess={handleUpdateReview} />
        </div>
      );
    }

    return (
      <div className={variant === 'full' ? 'bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5' : 'p-3 rounded-xl bg-ecommerce-surface-hover/40 border border-ecommerce-border/30'}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getReviewerAvatar(review) ? (
              <img src={getReviewerAvatar(review)!} alt={reviewerName} className="w-7 h-7 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-ecommerce-border/50 flex items-center justify-center shrink-0">
                <User size={14} className="text-ecommerce-text-muted" />
              </div>
            )}

            <span className={variant === 'full' ? 'text-sm font-medium text-ecommerce-text-primary' : 'text-xs font-semibold text-ecommerce-text-primary'}>{reviewerName}</span>
            {variant === 'full' && review.isApproved && (
              <span className="text-[9px] font-medium px-1.5 py-0 h-4 rounded-full bg-ecommerce-emerald/10 text-ecommerce-emerald border-0">✓</span>
            )}
            {variant === 'full' && !review.isApproved && isCurrentUserReview && (
              <span className="text-[10px] text-ecommerce-text-muted bg-ecommerce-border/50 px-2 py-0.5 rounded-full">{t('homepage.common.pending')}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {variant === 'full' ? (
              <span className="text-xs text-ecommerce-text-muted">
                {showDistanceToNow(session?.user.defaultLanguage ?? CONFIG.DEFAULT_LANGUAGE, review.createdOnUtc)}
              </span>
            ) : review.createdOnUtc ? (
              <span className="text-[10px] text-ecommerce-text-muted">
                {new Date(review.createdOnUtc).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            ) : null}
            {isCurrentUserReview && (
              <button
                onClick={() => setEditingReviewId(review.id)}
                className="text-ecommerce-text-muted hover:text-ecommerce-red transition-colors"
                title={t('homepage.common.edit')}
              >
                <Pencil size={variant === 'full' ? 14 : 10} />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 mb-2">
          <StarRating rating={review.rating} size={variant === 'full' ? 14 : 9} />
        </div>
        <p className={`leading-relaxed ${variant === 'full' ? 'text-sm text-ecommerce-text-secondary' : 'text-xs text-ecommerce-text-secondary'}`}>{review.reviewText}</p>
        {variant === 'full' && review.replyText && (
          <div className="mt-3 pt-3 border-t border-ecommerce-border">
            <p className="text-xs text-ecommerce-text-muted">{review.replyText}</p>
          </div>
        )}
      </div>
    );
  };

  const ratingBreakdown = (
    <div className={variant === 'full' ? 'bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-6' : 'flex gap-4 p-3 rounded-xl bg-ecommerce-surface-hover/60 border border-ecommerce-border/50'}>
      {variant === 'quick' && <div className={'text-center shrink-0 w-20'}>
        <p className={'text-3xl font-extrabold text-ecommerce-text-primary'}>{averageRating.toFixed(1)}</p>
        <div className="flex items-center justify-center gap-0.5 mt-2 mb-1">
          <StarRating rating={averageRating} size={10} />
        </div>
        <p className="text-[10px] text-ecommerce-text-muted mt-1">({total ?? 0} {t('homepage.productDetail.reviewsTab').toLowerCase()})</p>
      </div>}
      {variant === 'full' ? (
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = visibleReviews.filter((r) => r.isApproved && r.rating === star).length;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-ecommerce-text-muted w-6">{star}</span>
                <StarRating rating={averageRating} size={12} maxStars={1} />
                <div className="flex-1 h-2 bg-ecommerce-border rounded-full overflow-hidden">
                  <div className="h-full bg-ecommerce-amber rounded-full transition-all" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-xs text-ecommerce-text-muted w-8 text-end">{count}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = visibleReviews.filter((r) => r.isApproved && r.rating === star).length;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-[10px] text-ecommerce-text-muted w-3 text-end">{star}</span>
                <StarRating rating={1} size={9} maxStars={1} />
                <div className="flex-1 h-2 bg-ecommerce-border/50 rounded-full overflow-hidden">
                  <div className="h-full bg-ecommerce-amber rounded-full transition-all duration-700" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-[10px] text-ecommerce-text-muted w-7 text-end">{percentage}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const emptyState = (
    <>
      <div className={variant === 'full' ? 'flex items-center justify-between mb-3' : 'pt-4 border-t border-ecommerce-border/50'}>
        {variant === 'full' && <h4 className="text-sm font-semibold text-ecommerce-text-primary">{t('homepage.quickView.customerReviews')} {reviews.length > 0 && `(${reviews.length})`}</h4>}
      </div>
      <div className={variant === 'full' ? 'space-y-4' : ''}>
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-ecommerce-surface-hover flex items-center justify-center mx-auto mb-3">
            <svg className="text-ecommerce-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 16l4-8 4 5 4-7" /></svg>
          </div>
          <p className="text-sm text-ecommerce-text-secondary font-medium">{t('homepage.quickView.reviewForm.beFirst')}</p>
          <p className="text-xs text-ecommerce-text-muted mt-1">{t('homepage.quickView.reviewForm.commentPlaceholder')}</p>
        </div>
      </div>
    </>
  );

  const loginPrompt = !session?.user?.accessToken ? (
    <div className={`${variant === 'full' ? 'bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-6 text-center' : 'pt-4 border-t border-ecommerce-border/50 text-center p-6'}`}>
      <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-2">{variant === 'full' ? t('homepage.productDetail.writeReview') : t('homepage.quickView.reviewForm.title')} </h4>
      <p className={`text-sm text-ecommerce-text-muted mb-3 ${variant === 'full' ? '' : ''}`}>{t('homepage.productDetail.loginToReview')}</p>
      <button onClick={() => window.location.href = '/login'} className="h-9 px-4 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white text-sm font-medium rounded-lg">
        {t('homepage.common.login')}
      </button>
    </div>
  ) : null;

  return (
    <div className={variant === 'full' ? 'space-y-6' : 'space-y-4'}>
      {ratingBreakdown}
      {visibleReviews.length === 0 && (
        emptyState
      )}
      {!userReview && session?.user?.accessToken && (
        <div className={variant === 'full' ? 'bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5' : 'pt-4 border-t border-ecommerce-border/50'}>
          <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-3">{t('homepage.productDetail.writeReview')}</h4>
          <ReviewForm productId={productId} isQuickView={variant === 'quick'} onSuccess={handleAddReview} />
        </div>
      )}

      {loginPrompt}

      <div className={variant === 'full' ? 'space-y-4' : ''}>
        <div className={variant === 'full' ? 'flex items-center justify-between mb-3' : 'pt-4 border-t border-ecommerce-border/50'}>
          {variant === 'full' && <h4 className="text-sm font-semibold text-ecommerce-text-primary">{t('homepage.quickView.customerReviews')} {reviews.length > 0 && `(${reviews.length})`}</h4>}
        </div>
        {reviewsLoading ? (
          <div className={variant === 'full' ? 'space-y-3' : 'space-y-3'}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={variant === 'full' ? 'p-5 rounded-2xl bg-ecommerce-surface/50 border border-ecommerce-border' : 'p-3 rounded-xl bg-ecommerce-surface-hover/40 border border-ecommerce-border/30'}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={variant === 'full' ? 'w-7 h-7 rounded-full skeleton-shimmer' : 'w-6 h-6 rounded-full skeleton-shimmer'} />
                  <div className={variant === 'full' ? 'w-20 h-3 rounded skeleton-shimmer' : 'w-20 h-3 rounded skeleton-shimmer'} />
                </div>
                <div className="w-full h-3 rounded skeleton-shimmer mb-1.5" />
                <div className="w-3/4 h-3 rounded skeleton-shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <div className={variant === 'full' ? 'space-y-4' : 'space-y-3 max-h-72 overflow-y-auto scrollbar-thin'}>
            {visibleReviews.map((review) => (
              <div key={review.id}>{renderReviewItem(review)}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
