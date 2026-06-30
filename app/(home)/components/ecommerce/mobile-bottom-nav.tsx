'use client';

import { useState } from 'react';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useCartStore, useWishlistStore, useUIStore } from '@/lib/store';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Home', href: '#' },
  { icon: Search, label: 'Search', href: '#', action: 'search' as const },
  { icon: ShoppingBag, label: 'Shop', href: '#products', action: 'cart' as const },
  { icon: Heart, label: 'Wishlist', href: '#', action: 'wishlist' as const },
  { icon: User, label: 'Account', href: '#' },
];

export function MobileBottomNav() {
  const [activeTab, setActiveTab] = useState('Home');
  const { totalItems, toggleCart } = useCartStore();
  const { totalCount: wishlistCount } = useWishlistStore();
  const { setSearchQuery, setWishlistOpen } = useUIStore();
  const total = totalItems();
  const wishCount = wishlistCount();

  const handleClick = (item: (typeof navItems)[number], e: React.MouseEvent) => {
    setActiveTab(item.label);

    if (item.action === 'cart') {
      e.preventDefault();
      toggleCart();
    } else if (item.action === 'search') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSearchQuery(' '), 300);
      setTimeout(() => setSearchQuery(''), 350);
    } else if (item.action === 'wishlist') {
      e.preventDefault();
      setWishlistOpen(true);
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-ecommerce-surface/95 backdrop-blur-xl border-t border-ecommerce-border safe-area-pb before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-ecommerce-red/20 before:to-transparent">
      <div className="flex items-center h-[68px] px-2">
        {navItems.map((item) => {
          const isCart = item.label === 'Shop';
          const isWishlist = item.label === 'Wishlist';
          const badge = isCart ? total : isWishlist ? wishCount : 0;
          const isActive = activeTab === item.label;

          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleClick(item, e)}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full group active:scale-90 transition-transform"
            >
              <div className="relative">
                <item.icon
                  size={20}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? 'text-ecommerce-red'
                      : 'text-ecommerce-text-muted group-hover:text-ecommerce-text-secondary'
                  }`}
                />
                {badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 flex items-center justify-center px-1 text-[10px] font-bold bg-ecommerce-red text-white rounded-full shadow-sm shadow-ecommerce-red/20"
                  >
                    {badge > 99 ? '99+' : badge}
                  </motion.span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-ecommerce-red'
                    : 'text-ecommerce-text-muted group-hover:text-ecommerce-text-secondary'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-px left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-ecommerce-red"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}