'use client';

import { useState, useEffect, useRef, useSyncExternalStore, useCallback } from 'react';
import { Search, ShoppingCart, Menu, X, User, Heart, ChevronDown, Sun, Moon, Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCartStore, useWishlistStore, useUIStore } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchSuggestions } from './search-suggestions';
import { WishlistDrawer } from './wishlist-drawer';
import { NotificationPanel } from './notification-panel';

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const PROMO_MESSAGES = [
  { full: '🔥 Summer Sale — Up to 60% OFF on selected items! | Free shipping on orders $50+', short: '🔥 Summer Sale — Up to 60% OFF!' },
  { full: '✨ New Arrivals Just Dropped — Shop the Latest Collection', short: '✨ New Arrivals Just Dropped!' },
  { full: '🎁 Use code WELCOME15 for 15% off your first order', short: '🎁 Use code WELCOME15 — 15% off!' },
];

export function PromoBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [mounted]);

  if (!isVisible) return null;

  const message = PROMO_MESSAGES[currentIndex];

  return (
    <div className="bg-ecommerce-red text-white text-center py-2 px-4 text-sm font-medium relative overflow-hidden">
      {/* Subtle gradient shimmer effect on promo bar */}
      <div className="absolute inset-0" style={{background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'shimmer 3s ease-in-out infinite'}} />
      <div className="relative flex items-center justify-center gap-2 h-5">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute"
          >
            <span className="hidden sm:inline">{message.full}</span>
            <span className="sm:hidden">{message.short}</span>
          </motion.span>
        </AnimatePresence>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1 hover:rotate-90 transition-transform duration-200 z-10"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) return <div className="p-2 w-9 h-9" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors relative group"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
          >
            <Sun size={18} className="text-ecommerce-amber" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
          >
            <Moon size={18} className="text-ecommerce-text-secondary" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export function Header() {
  const { totalItems, toggleCart } = useCartStore();
  const { totalCount: wishlistTotal } = useWishlistStore();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, isMobileMenuOpen, setMobileMenuOpen, isWishlistOpen, setWishlistOpen } = useUIStore();
  const mounted = useMounted();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const total = totalItems();
  const wishCount = wishlistTotal();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetch('/api/categories').then(r => r.json()),
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  }, []);

  const navItems = [
    { label: 'Home', href: '#' },
    { label: 'Shop', href: '#products', hasDropdown: true },
    { label: 'Categories', href: '#categories' },
    { label: 'Deals', href: '#deals' },
  ];

  return (
    <>
      <PromoBar />
      <header
        className={`sticky top-0 z-50 theme-transition ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl shadow-sm border-b border-ecommerce-border/50 shadow-[0_1px_0_0_rgba(230,57,70,0.08)] dark:shadow-[0_1px_0_0_rgba(255,107,107,0.06)]'
            : 'bg-white dark:bg-ecommerce-surface'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ecommerce-red to-rose-500 flex items-center justify-center shadow-sm shadow-ecommerce-red/20 group-hover:shadow-md group-hover:shadow-ecommerce-red/30 transition-shadow">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">
                <span className="text-ecommerce-red">Shop</span>
                <span className="text-ecommerce-text-primary">Sphere</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-ecommerce-text-secondary hover:text-ecommerce-text-primary transition-colors rounded-lg hover:bg-ecommerce-surface-hover flex items-center gap-1 animated-underline"
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown size={14} className="transition-transform group-hover:rotate-180 duration-200" />}
                  </Link>
                  {item.hasDropdown && categories.length > 0 && (
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white dark:bg-ecommerce-surface rounded-xl shadow-xl border border-ecommerce-border py-2 min-w-[220px]">
                        <button
                          onClick={() => { setSelectedCategory(null); }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-ecommerce-surface-hover transition-colors ${!selectedCategory ? 'text-ecommerce-red font-medium bg-ecommerce-red/5' : 'text-ecommerce-text-secondary'}`}
                        >
                          All Products
                        </button>
                        <div className="my-1 border-t border-ecommerce-border" />
                        {categories.map((cat: { slug: string; name: string; color: string; _count?: { products: number } }) => (
                          <button
                            key={cat.slug}
                            onClick={() => { setSelectedCategory(cat.slug); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-ecommerce-surface-hover transition-colors flex items-center justify-between ${selectedCategory === cat.slug ? 'text-ecommerce-red font-medium bg-ecommerce-red/5' : 'text-ecommerce-text-secondary'}`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                              {cat.name}
                            </span>
                            <span className="text-xs text-ecommerce-text-muted">{cat._count?.products || 0}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
              <div className="relative w-64 focus-within:w-80 transition-all duration-300 group">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ecommerce-text-muted group-focus-within:text-ecommerce-purple transition-colors" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={handleSearchKeyDown}
                  className="pl-10 pr-10 h-10 bg-ecommerce-surface-hover border-ecommerce-border rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-ecommerce-purple/30 focus-visible:border-ecommerce-purple transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setIsSearchFocused(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted hover:text-ecommerce-text-primary transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {/* Search Suggestions Dropdown */}
              <SearchSuggestions
                isOpen={isSearchFocused}
                onClose={() => setIsSearchFocused(false)}
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors"
                aria-label="Search"
              >
                <Search size={20} className="text-ecommerce-text-secondary" />
              </button>

              {/* Dark Mode Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <button
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors group"
                aria-label="Notifications"
              >
                <Bell size={18} className="text-ecommerce-text-secondary group-hover:text-ecommerce-amber transition-colors duration-200" />
                {/* Unread dot */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ecommerce-red badge-pulse" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlistOpen(true)}
                className="relative p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors duration-200 group"
                aria-label="Wishlist"
              >
                <Heart size={18} className="text-ecommerce-text-secondary group-hover:text-ecommerce-rose transition-colors duration-200" />
                {wishCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5"
                  >
                    <Badge className="h-4 w-4 flex items-center justify-center p-0 text-[9px] font-bold bg-ecommerce-rose text-white border border-white dark:border-ecommerce-surface">
                      {wishCount > 99 ? '99+' : wishCount}
                    </Badge>
                  </motion.div>
                )}
              </button>

              {/* Account */}
              <button className="hidden sm:flex p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors duration-200" aria-label="Account">
                <User size={18} className="text-ecommerce-text-secondary" />
              </button>

              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors duration-200 group"
                aria-label="Cart"
              >
                <ShoppingCart size={18} className="text-ecommerce-text-secondary" />
                {total > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5"
                  >
                    <Badge className="h-4 w-4 flex items-center justify-center p-0 text-[9px] font-bold bg-ecommerce-red text-white border border-white dark:border-ecommerce-surface">
                      {total > 99 ? '99+' : total}
                    </Badge>
                  </motion.div>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pb-3 relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ecommerce-text-muted" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 h-10 bg-ecommerce-surface-hover border-ecommerce-border rounded-xl text-sm"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-ecommerce-border bg-white dark:bg-ecommerce-surface max-h-[60vh] overflow-y-auto scrollbar-thin"
            >
              <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-ecommerce-text-secondary hover:text-ecommerce-text-primary hover:bg-ecommerce-surface-hover rounded-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-2 border-t border-ecommerce-border mt-2">
                  <p className="px-4 py-1 text-xs font-semibold text-ecommerce-text-muted uppercase tracking-wider">Categories</p>
                  {categories.map((cat: { slug: string; name: string; color: string }) => (
                    <button
                      key={cat.slug}
                      onClick={() => { setSelectedCategory(cat.slug); setMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors ${selectedCategory === cat.slug ? 'bg-ecommerce-red/10 text-ecommerce-red font-medium' : 'text-ecommerce-text-secondary hover:bg-ecommerce-surface-hover'}`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Wishlist Drawer */}
      <WishlistDrawer open={isWishlistOpen} onClose={() => setWishlistOpen(false)} />
      <NotificationPanel open={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
}