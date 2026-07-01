'use client';

import { useState } from 'react';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useCartStore, useWishlistStore, useUIStore } from '../../lib/store';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface NavItem {
  icon: typeof Home;
  id: string;
  href: string;
  action?: 'search' | 'cart' | 'wishlist';
}

export function MobileBottomNav() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState('home');
  const { totalItems, toggleCart } = useCartStore();
  const { totalCount: wishlistCount } = useWishlistStore();
  const { setSearchQuery, setWishlistOpen } = useUIStore();
  const total = totalItems();
  const wishCount = wishlistCount();

  const navItems: NavItem[] = [
    { icon: Home, id: 'home', href: '/' },
    { icon: Search, id: 'search', href: '/products', action: 'search' },
    { icon: ShoppingBag, id: 'cart', href: '/products', action: 'cart' },
    { icon: Heart, id: 'wishlist', href: '/profile', action: 'wishlist' },
    { icon: User, id: 'account', href: '/profile' },
  ];

  const labels: Record<string, string> = {
    home: t('mobileNav.home'),
    search: t('common.searchPlaceholder').split(' ')[0],
    cart: t('mobileNav.cart'),
    wishlist: t('mobileNav.wishlist'),
    account: t('mobileNav.account'),
  };

  const handleClick = (item: NavItem, e: React.MouseEvent) => {
    setActiveTab(item.id);

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
    <nav className="lg:hidden fixed bottom-0 start-0 end-0 z-50 bg-white/95 dark:bg-ecommerce-surface/95 backdrop-blur-xl border-t border-ecommerce-border safe-area-pb before:absolute before:top-0 before:start-0 before:end-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-ecommerce-red/20 before:to-transparent">
      <div className="flex items-center h-[68px] px-2">
        {navItems.map((item) => {
          const isCart = item.id === 'cart';
          const isWishlist = item.id === 'wishlist';
          const badge = isCart ? total : isWishlist ? wishCount : 0;
          const isActive = activeTab === item.id;

          return (
            <a
              key={item.id}
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
                    className="absolute -top-1.5 -end-2.5 min-w-[16px] h-4 flex items-center justify-center px-1 text-[10px] font-bold bg-ecommerce-red text-white rounded-full shadow-sm shadow-ecommerce-red/20"
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
                {labels[item.id]}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-px start-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-ecommerce-red"
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