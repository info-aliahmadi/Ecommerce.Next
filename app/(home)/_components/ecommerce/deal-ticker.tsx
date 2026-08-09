'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import HomePageService from '../../_services/HomePageService';

export function DealTicker() {
  const t = useTranslations();
  const [isPaused, setIsPaused] = useState(false);

  const { data: deals = [] } = useQuery({
    queryKey: ['deal-ticker-links'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getLinksBySectionKey('dealticker');
      return result.succeeded ? (result.data ?? []) : [];
    },
  });

  const tickerItems = deals.map((link) => ({ text: link.title, color: '#E63946' }));

  if (tickerItems.length === 0) return null;

  return (
    <div
      role="marquee"
      aria-label={t('homepage.dealTicker.title')}
      className="w-full py-2 bg-ecommerce-surface-hover/60 dark:bg-[#0F1117]/40 border-y border-ecommerce-border/50 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left fade edge */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

      {/* Right fade edge */}
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: isPaused ? undefined : ['0%', '-50%'] }}
        transition={
          isPaused
            ? undefined
            : { duration: 40, repeat: Infinity, ease: 'linear' }
        }
        className="flex gap-8 w-max"
      >
        {[...tickerItems, ...tickerItems].map((deal, i) => (
          <span
            key={`${deal.text}-${i}`}
            className="flex items-center gap-2 shrink-0"
          >
            {/* Colored dot accent */}
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: deal.color }}
            />
            <span className="text-xs sm:text-sm font-medium text-ecommerce-text-secondary whitespace-nowrap">
              {deal.text}
            </span>
            {/* Separator */}
            <span className="text-ecommerce-text-muted ms-2 text-xs">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}