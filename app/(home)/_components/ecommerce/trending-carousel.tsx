'use client';

import { useQuery } from '@tanstack/react-query';
import { useUIStore } from '../../_lib/store';
import { Eye, TrendingUp, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { StarRating } from '../ui/star-rating';
import { motion } from 'framer-motion';
import { useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import HomePageService from '../../_services/HomePageService';
import ProductDisplayModel, { getProductPricing } from '../../_types/Product/ProductDisplayModel';
import { GetImage } from '../../_lib/utils';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';

export function TrendingCarousel() {
  const t = useTranslations();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setQuickViewProduct } = useUIStore();

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'trending'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getTrendProducts();
      const data = result.succeeded ? result.data : undefined;
      return data;
    }
  });

  const products: ProductDisplayModel[] = data?.items || [];

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  }, []);

  const handleQuickView = (product: ProductDisplayModel) => {
    setQuickViewProduct(product);
  };

  if (products.length === 0 && !isLoading) return null;

  return (
    <section className="py-12 sm:py-16 bg-ecommerce-surface-hover/30 dark:bg-[#0F1117]/20 relative overflow-x-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ecommerce-teal/10 text-ecommerce-teal text-xs font-semibold uppercase tracking-widest mb-3"
          >
            <TrendingUp size={12} />
            Trending
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ecommerce-text-primary tracking-tight">
            {t('homepage.trending.title')}
          </h2>
          <p className="text-sm text-ecommerce-text-muted mt-1">
            {t('homepage.trending.subtitle')}
          </p>
          {/* Dot divider */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-ecommerce-border" />
            <div className="h-1.5 w-1.5 rounded-full bg-ecommerce-teal" />
            <div className="h-px w-8 bg-ecommerce-border" />
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative max-w-7xl mx-auto">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute start-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-ecommerce-surface shadow-xl border border-ecommerce-border hover:bg-ecommerce-red hover:text-white items-center justify-center text-ecommerce-text-secondary transition-colors -translate-x-3"
          aria-label={t('homepage.trending.scrollLeft')}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute end-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-ecommerce-surface shadow-xl border border-ecommerce-border hover:bg-ecommerce-red hover:text-white items-center justify-center text-ecommerce-text-secondary transition-colors translate-x-3"
          aria-label={t('homepage.trending.scrollRight')}
        >
          <ChevronRight size={18} />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-thin snap-x snap-mandatory pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="w-64 sm:w-72 shrink-0 snap-start bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border overflow-hidden"
              >
                <div className="aspect-[4/5] bg-muted shimmer" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-16 bg-muted rounded shimmer" />
                  <div className="h-4 w-full bg-muted rounded shimmer" />
                  <div className="h-3 w-20 bg-muted rounded shimmer" />
                </div>
              </div>
            ))
            : products.map((product, index) => (
              <motion.div
                key={"pro-" + product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="w-64 sm:w-72 shrink-0 snap-start bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border overflow-hidden card-lift group cursor-pointer"
                onClick={() => handleQuickView(product)}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-ecommerce-surface-hover dark:bg-[#252836]">
                  {(() => {
                    const { totalStock } = getProductPricing(product.variants ?? []);
                    return (
                      <>
                        <img
                          src={GetImage(product.imagePreview, true)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        {totalStock === 0 && (
                          <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                            <span className="text-sm font-bold text-white bg-black/60 px-4 py-2 rounded-xl">{t('homepage.common.outOfStock')}</span>
                          </div>
                        )}
                      </>
                    );
                  })()}

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Ranking Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.08 }}
                    className="absolute top-3 start-3 w-8 h-8 rounded-full bg-ecommerce-red text-white flex items-center justify-center text-xs font-bold shadow-lg"
                  >
                    #{index + 1}
                  </motion.div>

                  {/* Overlay content on hover */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-4 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                    <p className="text-white font-bold text-sm text-center line-clamp-2 mb-1">
                      {product.name}
                    </p>
                    <p className="text-white font-semibold text-base mb-3">
                      {(() => {
                        const { hasMultipleVariants, minSellPrice, maxSellPrice, totalStock } = getProductPricing(product.variants ?? []);
                        return totalStock === 0 ? (
                          t('homepage.common.outOfStock')
                        ) : hasMultipleVariants ? (
                          `${CurrencyViewer(minSellPrice, CONFIG.DEFAULT_CURRENCY)} - ${CurrencyViewer(maxSellPrice, CONFIG.DEFAULT_CURRENCY)}`
                        ) : (
                          CurrencyViewer(minSellPrice, CONFIG.DEFAULT_CURRENCY)
                        );
                      })()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickView(product);
                      }}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl px-4 py-2 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Eye size={13} />
                      {t('homepage.common.quickView')}
                    </button>
                  </div>
                </div>

                {/* Card Content Below Image */}
                <div className="p-4">
                  {/* Category with colored dot */}
                  {product.categories.map(category => (category &&
                    <div key={category.id} className="flex items-center gap-1.5 mb-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-[11px] font-medium text-ecommerce-text-muted uppercase tracking-wider truncate">
                        {category.name}
                      </span>

                    </div>))}

                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="flex items-center gap-px">
                        <StarRating rating={product.approvedRatingSum} size={11} />
                      </div>
                      <span className="text-[11px] text-ecommerce-text-muted">
                        {product.approvedRatingSum}
                      </span>
                    </div>

                  {/* Sold count */}
                  <p className="text-[11px] text-ecommerce-text-muted">
                    <ShoppingCart size={10} className="inline me-1 -mt-0.5" />
                    {product.approvedTotalReviews} {t('homepage.common.sold')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
      </div>
    </section>
  );
}