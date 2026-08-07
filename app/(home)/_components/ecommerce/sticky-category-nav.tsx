'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useUIStore } from '../../_lib/store';
import { useTranslations } from 'next-intl';
import HomePageService from '../../_services/HomePageService';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  color: string;
  sortOrder: number;
  featured: boolean;
  _count: { products: number };
}

// Shared visibility state between sentinel and nav
let globalIsVisible = true;
const listeners = new Set<(visible: boolean) => void>();

function setGlobalIsVisible(value: boolean) {
  globalIsVisible = value;
  listeners.forEach((fn) => fn(value));
}

export function CategoryNavSentinel() {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setGlobalIsVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={sentinelRef} className="h-0 w-full" aria-hidden="true" />;
}

function subscribe(callback: () => void) {
  listeners.add(callback as (visible: boolean) => void);
  return () => {
    listeners.delete(callback as (visible: boolean) => void);
  };
}

function getSnapshot() {
  return globalIsVisible;
}

function getServerSnapshot() {
  return true;
}

export function StickyCategoryNav() {
  const t = useTranslations();
  const isVisible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getAllCategories();
      const items = result.succeeded ? result.data : [];
      return items;
    },
    staleTime: 60000,
  });

  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } =
    useUIStore();

  const handleCategoryClick = (slug: string | null) => {
    setSelectedCategory(slug);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const showSticky = !isVisible;

  return (
    <AnimatePresence>
      {showSticky && (
        <motion.div
          initial={{ y: -56, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -56, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 start-0 end-0 z-50 h-14 bg-white/90 dark:bg-ecommerce-surface/90 backdrop-blur-xl border-b border-ecommerce-border shadow-md"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center gap-3">
            {/* Brand text - desktop only */}
            <span className="hidden lg:block font-bold text-sm text-ecommerce-text-primary shrink-0">
              HydraShop
            </span>

            {/* Scrollable category pills */}
            <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-2 py-2 min-w-0">
              {/* "All" pill */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05, duration: 0.2 }}
                onClick={() => handleCategoryClick(null)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${selectedCategory === null
                  ? 'bg-ecommerce-red text-white'
                  : 'bg-ecommerce-surface-hover text-ecommerce-text-secondary hover:bg-ecommerce-surface-hover/80'
                  }`}
              >
                {t('homepage.common.allCategories')}
              </motion.button>

              {/* Category pills with staggered entrance */}
              {categories.map((cat, index) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.05 + (index + 1) * 0.03,
                      duration: 0.2,
                    }}
                    onClick={() => handleCategoryClick(cat.key)}
                    className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${isActive
                      ? 'bg-ecommerce-red/10 text-ecommerce-red border border-ecommerce-red/20'
                      : 'text-ecommerce-text-secondary hover:bg-ecommerce-surface-hover'
                      }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>{cat.name}</span>
                    <span className="text-ecommerce-text-muted text-xs">
                      {cat.productsCount}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Active search query display */}
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                className="hidden sm:flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full bg-ecommerce-surface-hover text-sm text-ecommerce-text-secondary"
              >
                <span className="max-w-[120px] truncate">&ldquo;{searchQuery}&rdquo;</span>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-0.5 rounded-full hover:bg-ecommerce-border/50 transition-colors cursor-pointer"
                  aria-label={t('homepage.common.clear')}
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}