'use client';

import { useRef } from 'react';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ReviewSummary({
  rating,
  reviewCount,
  children,
}: {
  rating: number;
  reviewCount: number;
  children?: React.ReactNode;
}) {
  const t = useTranslations('');
  const reviewsRef = useRef<HTMLDivElement>(null);

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <button
        onClick={scrollToReviews}
        className="flex items-center gap-2 group"
        aria-label={t('homepage.productDetail.scrollToReviews')}
      >
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.floor(rating)
                  ? 'fill-ecommerce-amber text-ecommerce-amber'
                  : i < rating
                    ? 'fill-ecommerce-amber/50 text-ecommerce-amber'
                    : 'text-ecommerce-border'
              }
            />
          ))}
        </div>
        <span className="text-sm font-medium text-ecommerce-text-primary">
          {rating.toFixed(1)}
        </span>
        <span className="text-sm text-ecommerce-text-muted group-hover:text-ecommerce-red transition-colors">
          ({reviewCount} {t('homepage.productDetail.reviewsTab').toLowerCase()})
        </span>
      </button>
      <div ref={reviewsRef}>{children}</div>
    </>
  );
}
