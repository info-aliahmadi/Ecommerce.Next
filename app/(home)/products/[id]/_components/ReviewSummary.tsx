'use client';

import { useRef } from 'react';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ReviewSummary({
  rating,
  reviewCount,
  children,
}: Readonly<{
  rating: number;
  reviewCount: number;
  children?: React.ReactNode;
}>) {
  const t = useTranslations('');
  const reviewsRef = useRef<HTMLDivElement>(null);

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
 const ratingResult = rating > 0 ? (rating / reviewCount) : 0;
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
                i < Math.floor(ratingResult)
                  ? 'fill-ecommerce-amber text-ecommerce-amber'
                  : i < ratingResult
                    ? 'fill-ecommerce-amber/50 text-ecommerce-amber'
                    : 'text-ecommerce-border'
              }
            />
          ))}
        </div>
        <span className="text-sm font-medium text-ecommerce-text-primary">
          {ratingResult.toFixed(1)}
        </span>
        <span className="text-sm text-ecommerce-text-muted group-hover:text-ecommerce-red transition-colors">
          ({reviewCount} {t('homepage.productDetail.reviewsTab').toLowerCase()})
        </span>
      </button>
      <div ref={reviewsRef}>{children}</div>
    </>
  );
}
