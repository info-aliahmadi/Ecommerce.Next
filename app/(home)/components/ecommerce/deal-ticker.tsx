'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const deals = [
  { icon: '🔥', text: 'Flash Sale: Up to 60% OFF Electronics', color: '#E63946' },
  { icon: '🚚', text: 'Free Shipping on Orders Over $50', color: '#20B2AA' },
  { icon: '🎁', text: 'Use Code WELCOME15 for 15% Off', color: '#6A5ACD' },
  { icon: '⚡', text: 'New Arrivals Just Dropped — Shop Now', color: '#FFC107' },
  { icon: '💎', text: 'Premium Collection — Exclusive Deals', color: '#FF69B4' },
  { icon: '🔄', text: 'Easy 30-Day Returns on All Orders', color: '#20B2AA' },
  { icon: '⭐', text: '50K+ Happy Customers Worldwide', color: '#FFC107' },
  { icon: '🔒', text: '100% Secure Checkout — SSL Encrypted', color: '#E63946' },
];

export function DealTicker() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
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
        {[...deals, ...deals].map((deal, i) => (
          <span
            key={`${deal.text}-${i}`}
            className="flex items-center gap-2 shrink-0"
          >
            {/* Colored dot accent */}
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: deal.color }}
            />
            <span className="text-sm leading-none">{deal.icon}</span>
            <span className="text-xs sm:text-sm font-medium text-ecommerce-text-secondary whitespace-nowrap">
              {deal.text}
            </span>
            {/* Separator */}
            <span className="text-ecommerce-text-muted ml-2 text-xs">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}