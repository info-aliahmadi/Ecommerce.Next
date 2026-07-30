'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, MessagesSquare, Send, Truck, Pencil, X } from 'lucide-react';
import { StarRating } from '../ui/star-rating';
import { Button } from '../ui/button';
import ProductReviewDisplayModel from '../../_types/Product/ProductReviewDisplayModel';
import ReviewForm from '@root/app/(home)/products/[id]/_components/ReviewForm';

interface RatingBreakdownProps {
  reviews: ProductReviewDisplayModel[];
}

function RatingBreakdown({ reviews }: RatingBreakdownProps) {
  const approved = reviews.filter((r) => r.isApproved);
  const total = approved.length;
  const rating = total > 0 ? approved.reduce((sum, r) => sum + r.rating, 0) / total : 0;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = approved.filter((r) => r.rating === stars).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { stars, percentage };
  });

  return (
    <div className="flex gap-4 p-3 rounded-xl bg-ecommerce-surface-hover/60 border border-ecommerce-border/50">
      {/* Average Rating */}
      <div className="text-center shrink-0 w-20">
        <p className="text-3xl font-extrabold text-ecommerce-text-primary">{rating.toFixed(1)}</p>
        <div className="flex items-center justify-center gap-0.5 mt-1">
          <StarRating rating={rating} size={10} />
        </div>
        <p className="text-[10px] text-ecommerce-text-muted mt-1">{total} reviews</p>
      </div>

      {/* Breakdown Bars */}
      <div className="flex-1 space-y-1.5">
        {distribution.map((item) => (
          <div key={item.stars} className="flex items-center gap-2">
            <span className="text-[10px] text-ecommerce-text-muted w-3 text-end">{item.stars}</span>
            <StarRating rating={1} size={9} maxStars={1} />
            <div className="flex-1 h-2 bg-ecommerce-border/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-ecommerce-amber rounded-full transition-all duration-700"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="text-[10px] text-ecommerce-text-muted w-7 text-end">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-3 rounded-xl bg-ecommerce-surface-hover/40 border border-ecommerce-border/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full skeleton-shimmer" />
            <div className="w-20 h-3 rounded skeleton-shimmer" />
            <div className="w-16 h-3 rounded skeleton-shimmer" />
          </div>
          <div className="w-full h-3 rounded skeleton-shimmer mb-1.5" />
          <div className="w-3/4 h-3 rounded skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
}

interface ReviewItemProps {
  review: ProductReviewDisplayModel;
  isCurrentUserReview?: boolean;
  onEdit?: () => void;
  t?: any;
}

function ReviewItem({ review, isCurrentUserReview, onEdit, t }: ReviewItemProps) {
  const reviewerName = review.user?.name || review.user?.userName || review.user?.email || 'Anonymous';
  const initial = reviewerName.charAt(0).toUpperCase();
  const dateStr = review.createdOnUtc
    ? new Date(review.createdOnUtc).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-xl bg-ecommerce-surface-hover/40 border border-ecommerce-border/30"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ecommerce-red to-ecommerce-purple flex items-center justify-center text-white text-[10px] font-bold">
            {initial}
          </div>
          <span className="text-xs font-semibold text-ecommerce-text-primary">{reviewerName}</span>
          {review.isApproved && (
            <span className="text-[9px] font-medium px-1.5 py-0 h-4 rounded-full bg-ecommerce-emerald/10 text-ecommerce-emerald border-0">
              ✓
            </span>
          )}
          <div className="flex items-center gap-0.5">
            <StarRating rating={review.rating} size={9} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ecommerce-text-muted">{dateStr}</span>
          {isCurrentUserReview && onEdit && (
            <button
              onClick={onEdit}
              className="text-ecommerce-text-muted hover:text-ecommerce-red transition-colors"
            >
              <Pencil size={14} />
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-ecommerce-text-secondary leading-relaxed">{review.reviewText}</p>
    </motion.div>
  );
}

function ShippingTab() {
  const items = [
    { title: 'Free Shipping', desc: 'Free shipping on all orders over $50' },
    { title: 'Express Delivery', desc: 'Get your order in 1-2 business days' },
    { title: 'Easy Returns', desc: '30-day hassle-free return policy' },
    { title: '24/7 Support', desc: 'Dedicated support anytime you need' },
  ];

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="flex items-start gap-3 p-3 rounded-xl bg-ecommerce-surface-hover/40 border border-ecommerce-border/30"
        >
          <div className="flex-1">
            <p className="text-xs font-semibold text-ecommerce-text-primary">{item.title}</p>
            <p className="text-[11px] text-ecommerce-text-secondary mt-0.5 leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface QuickViewTabsProps {
  product: any;
  reviews: ProductReviewDisplayModel[];
  reviewsLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: "description" | "reviews" | "shipping") => void;
  tabs: Array<{ key: "description" | "reviews" | "shipping"; label: string }>;
  t: any;
  reviewCount: number;
}

const getTabClassName = (isActive: boolean) =>
  `text-sm font-medium pb-2.5 border-b-2 transition-all duration-200 flex items-center gap-1.5 -mb-px ${isActive
    ? 'border-ecommerce-red text-ecommerce-red'
    : 'border-transparent text-ecommerce-text-muted hover:text-ecommerce-text-secondary'
  }`;

export function QuickViewTabs({
  product,
  reviews,
  reviewsLoading,
  activeTab,
  setActiveTab,
  tabs,
  t,
  reviewCount,
  }: Readonly<QuickViewTabsProps>) {
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?.id;
  const [reviewsLocal, setReviewsLocal] = useState<ProductReviewDisplayModel[]>(reviews);

  const userReview = currentUserId != null
    ? reviewsLocal.find((r) => r.userId === currentUserId)
    : undefined;

  const handleAddReview = (review: ProductReviewDisplayModel) => {
    setReviewsLocal((prev) => [review, ...prev]);
  };

  const handleUpdateReview = (review: ProductReviewDisplayModel) => {
    setReviewsLocal((prev) => prev.map((r) => (r.id === review.id ? review : r)));
    setEditingReviewId(null);
  };

  const reviewsContent = reviewsLoading ? (
    <ReviewsSkeleton />
  ) : reviewsLocal.length > 0 ? (
    <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-thin">
      {reviewsLocal.map((review) => {
        const isCurrentUserReview = review.userId === currentUserId;
        const isEditing = editingReviewId === review.id;
        return (
          <div key={review.id}>
            {isEditing ? (
              <div className="p-3 rounded-xl bg-ecommerce-surface-hover/40 border border-ecommerce-border/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-ecommerce-text-primary">
                    {t('homepage.productDetail.updateReview')}
                  </h4>
                  <button
                    onClick={() => setEditingReviewId(null)}
                    className="text-ecommerce-text-muted hover:text-ecommerce-text-primary"
                  >
                    <X size={16} />
                  </button>
                </div>
                <ReviewForm productId={product.id} existingReview={review} isQuickView={true} onSuccess={handleUpdateReview} />
              </div>
            ) : (
              <ReviewItem
                review={review}
                isCurrentUserReview={isCurrentUserReview}
                onEdit={isCurrentUserReview ? () => setEditingReviewId(review.id) : undefined}
                t={t}
              />
            )}
          </div>
        );
      })}
    </div>
  ) : (
    <div className="text-center py-6">
      <div className="w-12 h-12 rounded-full bg-ecommerce-surface-hover flex items-center justify-center mx-auto mb-3">
        <BarChart3 size={20} className="text-ecommerce-text-muted" />
      </div>
      <p className="text-sm text-ecommerce-text-secondary font-medium">{t('homepage.quickView.reviewForm.beFirst')}</p>
      <p className="text-xs text-ecommerce-text-muted mt-1">{t('homepage.quickView.reviewForm.commentPlaceholder')}</p>
    </div>
  );

  return (
    <div className="mt-5 pt-5 border-t border-ecommerce-border">
      {/* Tab buttons with red underline indicator */}
      <div className="flex gap-4 mb-4 border-b border-ecommerce-border/50">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={getTabClassName(activeTab === tab.key)}
          >
            {tab.key === 'reviews' && <MessagesSquare size={13} />}
            {tab.key === 'shipping' && <Truck size={13} />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content with smooth transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="min-h-[120px]"
        >
          {activeTab === 'description' ? (
            <div
              className="text-sm text-ecommerce-text-secondary leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.fullDescription }}
            />
          ) : activeTab === 'reviews' ? (
            <div className="space-y-4">
              <RatingBreakdown reviews={reviews} />

              {/* Write a Review Form */}
              {!userReview && session?.user?.accessToken ? (
                <div className="pt-4 border-t border-ecommerce-border/50">
                  <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-3">{t('homepage.quickView.reviewForm.title')}</h4>
                  <ReviewForm productId={product.id} isQuickView={true} onSuccess={handleAddReview} />
                </div>
              ) : !session?.user?.accessToken ? (
                <div className="pt-4 border-t border-ecommerce-border/50 text-center p-6">
                  <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-2">{t('homepage.quickView.reviewForm.title')}</h4>
                  <p className="text-sm text-ecommerce-text-muted mb-3">{t('homepage.productDetail.loginToReview')}</p>
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="h-9 px-4 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white text-sm font-medium rounded-lg"
                  >
                    {t('homepage.common.login')}
                  </button>
                </div>
              ) : null}

              {/* Reviews list from API */}
              <div className="pt-4 border-t border-ecommerce-border/50">
                <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-3">
                  {t('homepage.quickView.customerReviews')} {reviews.length > 0 && `(${reviews.length})`}
                </h4>

                 {reviewsContent}
                 
              </div>
            </div>
          ) : (
            <ShippingTab />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
