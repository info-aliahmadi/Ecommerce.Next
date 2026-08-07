'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessagesSquare, Truck } from 'lucide-react';
import { StarRating } from '../ui/star-rating';
import ProductReviewDisplayModel from '../../_types/Product/ProductReviewDisplayModel';
import ProductReviews from '@root/app/(home)/_components/ecommerce/ProductReviews';
import CONFIG from '@root/config';
import { GetCurrencySymbol } from '@root/utils/CurrencyViewer';

interface RatingBreakdownProps {
  reviews: ProductReviewDisplayModel[];
}

function RatingBreakdown({ reviews }: Readonly<RatingBreakdownProps>) {
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
      <div className="text-center shrink-0 w-20">
        <p className="text-3xl font-extrabold text-ecommerce-text-primary">{rating.toFixed(1)}</p>
        <div className="flex items-center justify-center gap-0.5 mt-1">
          <StarRating rating={rating} size={10} />
        </div>
        <p className="text-[10px] text-ecommerce-text-muted mt-1">{total} reviews</p>
      </div>
      <div className="flex-1 space-y-1.5">
        {distribution.map((item) => (
          <div key={item.stars} className="flex items-center gap-2">
            <span className="text-[10px] text-ecommerce-text-muted w-3 text-end">{item.stars}</span>
            <StarRating rating={1} size={9} maxStars={1} />
            <div className="flex-1 h-2 bg-ecommerce-border/50 rounded-full overflow-hidden">
              <div className="h-full bg-ecommerce-amber rounded-full transition-all duration-700" style={{ width: `${item.percentage}%` }} />
            </div>
            <span className="text-[10px] text-ecommerce-text-muted w-7 text-end">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShippingTab() {
  const items = [
    { title: 'Free Shipping', desc: 'Free shipping on all orders over ' + CONFIG.FREE_SHIPPING_THRESHOLD + '' + GetCurrencySymbol(CONFIG.DEFAULT_CURRENCY) },
    { title: 'Express Delivery', desc: 'Get your order in 1-2 business days' },
    { title: 'Easy Returns', desc: '30-day hassle-free return policy' },
    { title: '24/7 Support', desc: 'Dedicated support anytime you need' },
  ];

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-ecommerce-surface-hover/40 border border-ecommerce-border/30">
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
  return (
    <div className="mt-5 pt-5 border-t border-ecommerce-border">
      {/* Tab buttons with red underline indicator */}
      <div className="flex gap-4 mb-4 border-b border-ecommerce-border/50">
        {tabs.map((tab) => (
          <button
            type='button'
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
          {activeTab === 'description' && (
            <div
              className="text-sm text-ecommerce-text-secondary leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.fullDescription }}
            />
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <ProductReviews
                product={product}
                reviews={reviews}
                reviewsLoading={reviewsLoading}
                reviewCount={reviewCount}
                ratingSum={product.approvedRatingSum}
                variant="quick"
              />
            </div>
          )}
          {activeTab === 'shipping' && (
            <ShippingTab />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
