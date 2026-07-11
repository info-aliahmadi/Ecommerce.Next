'use client';

import { GitCompareArrows } from 'lucide-react';
import { useCompareStore } from '../../_lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { GetImage } from '../../_lib/utils';

export function CompareBar() {
  const { items, setCompareOpen } = useCompareStore();
  const t = useTranslations();

  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-16 lg:bottom-4 start-1/2 -translate-x-1/2 z-40"
      >
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-ecommerce-surface border border-ecommerce-border shadow-xl shadow-black/10 dark:shadow-black/30">
          {/* Product thumbnails */}
          <div className="flex items-center -space-x-2">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative"
                >
                  <img
                    src={GetImage(item.image)}
                    alt={item.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-ecommerce-surface shadow-sm"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Count badge */}
          <span className="text-[11px] font-bold text-ecommerce-text-secondary bg-ecommerce-surface-hover dark:bg-[#252836] px-2.5 py-1 rounded-lg">
            {items.length} {items.length === 1 ? t('homepage.common.product') : t('homepage.common.products')}
          </span>

          {/* Compare button */}
          <button
            onClick={() => setCompareOpen(true)}
            className="flex items-center gap-2 h-9 px-4 rounded-xl bg-ecommerce-purple hover:bg-ecommerce-purple/90 text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <GitCompareArrows size={14} />
            {t('homepage.common.compare')}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}