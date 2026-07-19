'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductCard } from './product-card';
import { ArrowRight, Flame, Clock, TrendingDown } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import HomePageService from '../../_services/HomePageService';
import ProductDisplayModel, { getCheapestVariant } from '../../_types/ProductDisplayModel';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';

function StockBar({ stock, maxStock = 50 }: { stock: number; maxStock?: number }) {
  const t = useTranslations();
  const percentage = Math.min((stock / maxStock) * 100, 100);
  const isLow = stock < 10;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[10px] font-semibold ${isLow ? 'text-ecommerce-red' : 'text-ecommerce-text-muted'}`}>
          {isLow ? t('homepage.common.onlyLeft', { count: stock }) : `${stock} ${t('homepage.common.inStock').toLowerCase()}`}
        </span>
        <span className="text-[10px] text-ecommerce-text-muted">{Math.round(percentage)}% {t('homepage.deals.available')}</span>
      </div>
      <div className="h-1.5 bg-ecommerce-surface-hover dark:bg-[#252836] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #20B2AA, #10B981)' }}
        />
      </div>
    </div>
  );
}

function DealUrgencyBanner() {
  const t = useTranslations();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-ecommerce-red/5 via-ecommerce-amber/5 to-ecommerce-red/5 border border-ecommerce-red/10"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-ecommerce-red/10 flex items-center justify-center shrink-0">
            <Flame size={22} className="text-ecommerce-red" />
          </div>
          <div>
            <h3 className="font-bold text-ecommerce-text-primary text-sm">{t('homepage.deals.flashSaleLive')}</h3>
            <p className="text-xs text-ecommerce-text-muted mt-0.5">{t('homepage.deals.flashSaleDesc')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-ecommerce-text-muted">
            <Clock size={14} className="text-ecommerce-red" />
            <span>{t('homepage.deals.endsToday')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <TrendingDown size={14} className="text-ecommerce-emerald" />
            <span className="text-ecommerce-emerald">{t('homepage.deals.upToOff')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DealsSection() {
  const t = useTranslations();

  const { data } = useQuery({
    queryKey: ['products', 'deals'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getBestDealProducts();
      const data = result.succeeded ? result.data : undefined;
      return data;
    }
  });

  //const deals = (data?.products || []).filter((p: { comparePrice: number | null; price: number }) => p.comparePrice && p.comparePrice > p.price);

  const deals = data?.items || [];

  if (deals.length === 0) return null;

  const totalSavings = deals.reduce((sum: number, p: ProductDisplayModel) => {
    const v = getCheapestVariant(p.variants);
    return v ? sum + (v.oldSellPrice - v.sellPrice) : sum;
  }, 0);
  const maxDiscount = Math.max(...deals.map((p: ProductDisplayModel) => {
    const v = getCheapestVariant(p.variants);
    return v && v.oldSellPrice > 0 ? Math.round(((v.oldSellPrice - v.sellPrice) / v.oldSellPrice) * 100) : 0;
  }));

  return (
    <section id="deals" className="py-12 sm:py-16 bg-ecommerce-surface-hover/40 dark:bg-[#0F1117]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ecommerce-teal/10 text-ecommerce-teal text-xs font-semibold uppercase tracking-widest mb-3">
              <span className="badge-pulse">⏰</span> {t('homepage.deals.limitedTime')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ecommerce-text-primary tracking-tight">{t('homepage.deals.title')}</h2>
            <p className="text-sm text-ecommerce-text-muted mt-1">{t('homepage.deals.subtitle')}</p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="hidden sm:flex text-ecommerce-red hover:text-ecommerce-red/80 hover:bg-ecommerce-red/5 rounded-xl gap-1.5"
          >
            <Link href="#products">
              {t('homepage.deals.shopDeals')} <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        {/* Urgency Banner */}
        <DealUrgencyBanner />

        {/* Savings Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-ecommerce-surface border border-ecommerce-border">
            <div className="w-9 h-9 rounded-lg bg-ecommerce-red/10 flex items-center justify-center shrink-0">
              <span className="text-base">🏷️</span>
            </div>
            <div>
              <p className="text-xs text-ecommerce-text-muted">{t('homepage.deals.maxDiscount')}</p>
              <p className="text-sm font-bold text-ecommerce-red">{maxDiscount}% OFF</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-ecommerce-surface border border-ecommerce-border">
            <div className="w-9 h-9 rounded-lg bg-ecommerce-emerald/10 flex items-center justify-center shrink-0">
              <span className="text-base">💰</span>
            </div>
            <div>
              <p className="text-xs text-ecommerce-text-muted">{t('homepage.deals.totalSavings')}</p>
              <p className="text-sm font-bold text-ecommerce-emerald">{ CurrencyViewer(totalSavings, CONFIG.DEFAULT_CURRENCY)}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-ecommerce-surface border border-ecommerce-border">
            <div className="w-9 h-9 rounded-lg bg-ecommerce-amber/10 flex items-center justify-center shrink-0">
              <span className="text-base">📦</span>
            </div>
            <div>
              <p className="text-xs text-ecommerce-text-muted">{t('homepage.deals.dealsAvailable')}</p>
              <p className="text-sm font-bold text-ecommerce-text-primary">{deals.length} {t('homepage.common.products')}</p>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {deals.map((product, index: number) => {
            const stock = (product.stockQuantity as number) || 0;
            return (
              <div key={"pros-" + product.id as string} className="relative hover:scale-[1.02] transition-transform duration-300">
                <ProductCard
                  product={product}
                  index={index}
                />
                {stock > 0 && (
                  <div className="px-3.5 pb-3 sm:px-4">
                    <StockBar stock={stock} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden mt-6 text-center">
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-ecommerce-red text-ecommerce-red hover:bg-ecommerce-red/5 gap-1.5"
          >
            <Link href="#products">
              {t('homepage.deals.shopDeals')} <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}