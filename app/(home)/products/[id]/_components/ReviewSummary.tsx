'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { StarRating } from '@root/app/(home)/_components/ui/star-rating';

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

  return (
    <>
      <div className="flex items-center gap-2 group">
        <StarRating rating={rating} size={16} />
        <span className="text-sm font-medium text-ecommerce-text-primary">
          {rating.toFixed(1)}
        </span>
        <button
            type='button' onClick={scrollToReviews} className="text-sm text-ecommerce-text-muted group-hover:text-ecommerce-red transition-colors" aria-label={t('homepage.productDetail.scrollToReviews')}>
          ({reviewCount ?? 0} {t('homepage.productDetail.reviewsTab').toLowerCase()})
        </button>
      </div>
      <div ref={reviewsRef}>{children}</div>
    </>
  );
}
