'use client';

import { Eye, X, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUIStore, useCartStore, useRecentStore, type RecentItem } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function RecentlyViewed() {
  const { items } = useRecentStore();
  const { setQuickViewProduct } = useUIStore();
  const { addItem } = useCartStore();
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollEl?.scrollTo({ left: 0, behavior: 'smooth' });
  }, [items.length]);

  const handleScroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollEl) return;
    const scrollAmount = direction === 'left' ? -200 : 200;
    scrollEl.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }, [scrollEl]);

  if (items.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ecommerce-purple/10 text-ecommerce-purple text-xs font-semibold uppercase tracking-widest mb-4">
            <Eye size={12} />
            History
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ecommerce-text-primary tracking-tight">
            Recently Viewed
          </h2>
          <p className="text-sm text-ecommerce-text-muted mt-2">
            Pick up where you left off
          </p>
          <div className="flex items-center gap-2 mt-4">
            <div className="h-px w-8 bg-ecommerce-border" />
            <div className="h-1.5 w-1.5 rounded-full bg-ecommerce-purple" />
            <div className="h-px w-8 bg-ecommerce-border" />
          </div>
        </div>

        {/* Horizontal scroll with arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => handleScroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-white dark:bg-ecommerce-surface shadow-lg border border-ecommerce-border items-center justify-center text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => handleScroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-white dark:bg-ecommerce-surface shadow-lg border border-ecommerce-border items-center justify-center text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>

          {/* Scroll Container */}
          <div
            ref={setScrollEl}
            className="flex gap-4 overflow-x-auto scrollbar-thin pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 snap-x snap-mandatory"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group shrink-0 w-48 sm:w-56 snap-start scroll-reveal"
                >
                  <div className="card-lift category-glow bg-white dark:bg-ecommerce-surface rounded-xl border border-ecommerce-border overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-ecommerce-surface-hover dark:bg-[#252836]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Quick View Eye Button */}
                      <button
                        onClick={() => setQuickViewProduct(item.id)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-ecommerce-surface/90 text-ecommerce-text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg"
                        aria-label="Quick view"
                      >
                        <Eye size={18} />
                      </button>
                      {/* Remove Button */}
                      <button
                        onClick={() => {
                          const store = useRecentStore.getState();
                          store.items = store.items.filter((i: RecentItem) => i.id !== item.id);
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                        aria-label="Remove"
                      >
                        <X size={10} />
                      </button>
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <p className="text-xs font-medium text-ecommerce-text-muted">{item.category}</p>
                      <h4 className="text-sm font-semibold text-ecommerce-text-primary line-clamp-1 mt-0.5">{item.name}</h4>
                      <span className="text-sm font-bold text-ecommerce-text-primary mt-2">${item.price.toFixed(2)}</span>
                      <button
                        onClick={() => {
                          addItem({ id: item.id, name: item.name, price: item.price, comparePrice: item.comparePrice, image: item.image, category: item.category });
                          toast.success(`${item.name} added to cart!`);
                        }}
                        className="mt-3 w-full h-9 rounded-lg bg-ecommerce-red/10 text-ecommerce-red text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-ecommerce-red hover:text-white transition-all duration-200"
                      >
                        <ShoppingCart size={13} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}