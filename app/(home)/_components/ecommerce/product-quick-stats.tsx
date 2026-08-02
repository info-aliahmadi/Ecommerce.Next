'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Eye, Heart, ShoppingCart, ChevronUp } from 'lucide-react';
import { useCartStore, useWishlistStore, useRecentStore } from '../../_lib/store';
import { useTranslations } from 'next-intl';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';

const emptySubscribe = () => () => { };
function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function AnimatedNumber({ value, duration = 600 }: Readonly<{ value: number; duration?: number }>) {
  const [displayed, setDisplayed] = useState(value);
  const prevValue = useRef(value);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const from = prevValue.current;
    const to = value;
    if (from === to) return;

    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    prevValue.current = value;

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  return <>{displayed}</>;
}

export function ProductQuickStats() {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);
  const hasMounted = useHasMounted();

  const totalCartPrice = useCartStore((s) => s.totalPrice());
  const totalCartItems = useCartStore((s) => s.totalItems());

  const wishlistItems = useWishlistStore((s) => s.items);
  const recentItems = useRecentStore((s) => s.items);

  const viewedCount = recentItems.length;
  const wishlistCount = wishlistItems.length;
  const cartCount = totalCartItems;

  const totalBadge = viewedCount + wishlistCount + cartCount;

  if (!hasMounted || totalBadge === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-8 start-4 sm:start-6 z-40">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-14 left-0 w-56 rounded-xl overflow-hidden shadow-xl border border-ecommerce-border"
          >
            <div className="glass dark:glass-dark bg-white/80 dark:bg-ecommerce-surface/80 backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-ecommerce-border">
                <div className="flex items-center gap-2">
                  <BarChart3 size={14} className="text-ecommerce-purple" />
                  <span className="text-xs font-semibold text-ecommerce-text-primary">{t('homepage.quickStats.title')}</span>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-ecommerce-text-muted hover:text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
                  aria-label={t('homepage.quickStats.collapseStats')}
                >
                  <ChevronUp size={12} />
                </button>
              </div>

              {/* Stats rows */}
              <div className="p-3 space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-ecommerce-surface-hover/50">
                  <div className="w-7 h-7 rounded-lg bg-ecommerce-teal/10 flex items-center justify-center shrink-0">
                    <Eye size={14} className="text-ecommerce-teal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-ecommerce-text-muted">{t('homepage.quickStats.viewed')}</p>
                    <p className="text-sm font-bold text-ecommerce-text-primary tabular-nums">
                      <AnimatedNumber value={viewedCount} />
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-ecommerce-surface-hover/50">
                  <div className="w-7 h-7 rounded-lg bg-ecommerce-rose/10 flex items-center justify-center shrink-0">
                    <Heart size={14} className="text-ecommerce-rose" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-ecommerce-text-muted">{t('homepage.quickStats.inWishlist')}</p>
                    <p className="text-sm font-bold text-ecommerce-text-primary tabular-nums">
                      <AnimatedNumber value={wishlistCount} />
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-ecommerce-surface-hover/50">
                  <div className="w-7 h-7 rounded-lg bg-ecommerce-red/10 flex items-center justify-center shrink-0">
                    <ShoppingCart size={14} className="text-ecommerce-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-ecommerce-text-muted">{t('homepage.quickStats.inCart')}</p>
                    <p className="text-sm font-bold text-ecommerce-text-primary tabular-nums">
                      {CurrencyViewer(totalCartPrice, CONFIG.DEFAULT_CURRENCY)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed button */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-12 h-12 rounded-full bg-white dark:bg-ecommerce-surface shadow-lg border border-ecommerce-border flex items-center justify-center hover:shadow-xl transition-shadow group"
        aria-label={t('homepage.quickStats.quickStatsLabel')}
      >
        <BarChart3 size={18} className="text-ecommerce-text-primary group-hover:text-ecommerce-purple transition-colors" />

        {/* Count badge */}
        {totalBadge > 0 && (
          <span className="absolute -top-1 -end-1 min-w-[20px] h-5 px-1 rounded-full bg-ecommerce-purple text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
            <AnimatedNumber value={totalBadge} duration={400} />
          </span>
        )}
      </motion.button>
    </div>
  );
}