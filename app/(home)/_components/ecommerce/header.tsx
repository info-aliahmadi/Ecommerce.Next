'use client';

import { useState, useEffect, useRef, useSyncExternalStore, useCallback } from 'react';
import { Search, ShoppingCart, Menu, X, User, Heart, ChevronDown, ChevronRight, Sun, Moon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useCartStore, useWishlistStore, useUIStore, useAuthStore } from '../../_lib/store';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchSuggestions } from './search-suggestions';
import { WishlistDrawer } from './wishlist-drawer';
import HomePageService from '../../_services/HomePageService';
import MenuModel from '@root/app/dashboard/(cms)/_types/Menu/MenuModel';

// Extended type interface to guarantee child array handling
interface ExtendedMenuModel extends MenuModel {
  childs?: ExtendedMenuModel[] | null;
}

function buildMenuTree(items: MenuModel[]): ExtendedMenuModel[] {
  const map = new Map<number, ExtendedMenuModel>();
  const roots: ExtendedMenuModel[] = [];

  // Map each item and guarantee an empty childs array
  items.forEach((item) => {
    map.set(item.id, { ...item, childs: [] });
  });

  // Build relationships
  items.forEach((item) => {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.childs?.push(node);
    } else {
      roots.push(node);
    }
  });

  // Helper to recursively sort children by 'order'
  const sortTree = (nodes: ExtendedMenuModel[]): ExtendedMenuModel[] => {
    return nodes
      .sort((a, b) => a.order - b.order)
      .map((node) => ({
        ...node,
        childs: node.childs && node.childs.length > 0 ? sortTree(node.childs) : [],
      }));
  };

  return sortTree(roots);
}

function useMounted() {
  return useSyncExternalStore(
    () => () => { },
    () => true,
    () => false,
  );
}

export function PromoBar() {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mounted = useMounted();

  const { data: promos = [] } = useQuery({
    queryKey: ['promo-links'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getLinksBySectionKey('promobar');
      return result.succeeded ? (result.data ?? []) : [];
    },
  });

  const promoMessages = promos.map((link) => ({ text: link.title }));

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [mounted, promoMessages.length]);

  if (!isVisible || promoMessages.length === 0) return null;

  const message = promoMessages[currentIndex];

  return (
    <div className="bg-ecommerce-red text-white text-center py-2 px-4 text-sm font-medium relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'shimmer 3s ease-in-out infinite' }} />
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
            {message?.text}
          </motion.span>
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="absolute end-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1 hover:rotate-90 transition-transform duration-200 z-10"
        aria-label={t('homepage.common.close')}
      >
        <X size={14} />
      </button>
    </div>
  );
}

function ThemeToggle() {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) return <div className="p-2 w-9 h-9" />;

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors relative group"
      aria-label={t('homepage.header.toggleTheme')}
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

// Helper Component for Mobile Accordion Sub-level items
function MobileMenuItem({ item, onClose }: { item: ExtendedMenuModel; onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.childs && item.childs.length > 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-ecommerce-surface-hover">
        <Link
          href={item.url}
          onClick={onClose}
          className="flex-1 text-sm font-medium text-ecommerce-text-secondary hover:text-ecommerce-text-primary flex items-center gap-2"
        >
          {item.color && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />}
          {item.title}
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-ecommerce-text-secondary hover:text-ecommerce-text-primary"
          >
            <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="ps-4 border-s border-ecommerce-border/60 ms-4 my-1 space-y-1">
          {item.childs!.map((child) => (
            <MobileMenuItem key={child.id} item={child} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const t = useTranslations();
  const { totalItems, toggleCart } = useCartStore();
  const { totalCount: wishlistTotal } = useWishlistStore();
  const { searchQuery, setSearchQuery, isMobileMenuOpen, setMobileMenuOpen, isWishlistOpen, setWishlistOpen } = useUIStore();
  const setLoginOpen = useAuthStore((s) => s.setLoginOpen);
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const total = totalItems();
  const wishCount = wishlistTotal();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getAllCategories();
      return result.succeeded ? result.data : [];
    },
  });

  const { data: menuData } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getMenu();
      const items = Array.isArray(result.data) ? result.data : [];
      return buildMenuTree(items);
    },
  });

  const navItems = menuData ?? [];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchFocused(false);
    } else if (e.key === 'Enter') {
      const query = searchQuery.trim();
      if (query) {
        setIsSearchFocused(false);
        window.location.href = `/products?search=${encodeURIComponent(query)}&page=1`;
      }
    }
  }, [searchQuery]);

  return (
    <>
      <PromoBar />
      <header
        className={`sticky top-0 z-50 theme-transition ${isScrolled
          ? 'bg-background/80 backdrop-blur-xl shadow-sm border-b border-ecommerce-border/50 shadow-[0_1px_0_0_rgba(230,57,70,0.08)] dark:shadow-[0_1px_0_0_rgba(255,107,107,0.06)]'
          : 'bg-white dark:bg-ecommerce-surface'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors"
              aria-label={isMobileMenuOpen ? t('homepage.header.closeMenu') : t('homepage.header.menu')}
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ecommerce-rose to-blue-700 flex items-center justify-center shadow-sm shadow-ecommerce-red/20 group-hover:shadow-md group-hover:shadow-ecommerce-red/60 transition-shadow">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">
                <span className="text-ecommerce-red">Kidy</span>
                <span className="text-ecommerce-text-primary">Toy</span>
              </span>
            </Link>

            {/* Desktop 3-Level Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((lvl1) => (
                <div key={lvl1.id} className="relative group/lvl1">
                  <a
                    href={lvl1.url}
                    className="px-4 py-2 text-sm font-medium text-ecommerce-text-secondary hover:text-ecommerce-text-primary transition-colors rounded-lg hover:bg-ecommerce-surface-hover flex items-center gap-1 cursor-pointer"
                  >
                    {lvl1.title}
                    {lvl1.childs && lvl1.childs.length > 0 && (
                      <ChevronDown size={14} className="transition-transform group-hover/lvl1:rotate-180 duration-200" />
                    )}
                  </a>

                  {/* LEVEL 2 DROPDOWN */}
                  {lvl1.childs && lvl1.childs.length > 0 && (
                    <div className="absolute top-full start-0 pt-2 opacity-0 invisible group-hover/lvl1:opacity-100 group-hover/lvl1:visible transition-all duration-200 z-50">
                      <div className="bg-white dark:bg-ecommerce-surface rounded-xl shadow-xl border border-ecommerce-border py-2 min-w-[220px]">
                        {lvl1.childs.map((lvl2) => (
                          <div key={lvl2.id} className="relative group/lvl2">
                            <a
                              href={lvl2.url}
                              className="w-full text-start px-4 py-2.5 text-sm hover:bg-ecommerce-surface-hover transition-colors flex items-center justify-between text-ecommerce-text-secondary hover:text-ecommerce-text-primary"
                            >
                              <span className="flex items-center gap-2">
                                {lvl2.color && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lvl2.color }} />}
                                {lvl2.title}
                              </span>
                              {lvl2.childs && lvl2.childs.length > 0 && (
                                <ChevronRight size={14} className="text-ecommerce-text-muted" />
                              )}
                            </a>

                            {/* LEVEL 3 FLYOUT MENU */}
                            {lvl2.childs && lvl2.childs.length > 0 && (
                              <div className="absolute top-0 start-full ps-2 opacity-0 invisible group-hover/lvl2:opacity-100 group-hover/lvl2:visible transition-all duration-200 z-50">
                                <div className="bg-white dark:bg-ecommerce-surface rounded-xl shadow-xl border border-ecommerce-border py-2 min-w-[200px]">
                                  {lvl2.childs.map((lvl3) => (
                                    <a
                                      key={lvl3.id}
                                      href={lvl3.url}
                                      className="w-full text-start px-4 py-2 text-sm hover:bg-ecommerce-surface-hover transition-colors flex items-center gap-2 text-ecommerce-text-secondary hover:text-ecommerce-text-primary"
                                    >
                                      {lvl3.color && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lvl3.color }} />}
                                      {lvl3.title}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
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
                <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-ecommerce-text-muted group-focus-within:text-ecommerce-purple transition-colors" />
                <Input
                  placeholder={t('homepage.common.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={handleSearchKeyDown}
                  className="ps-10 pe-10 h-10 bg-ecommerce-surface-hover border-ecommerce-border rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-ecommerce-purple/30 focus-visible:border-ecommerce-purple transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setIsSearchFocused(false); }}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted hover:text-ecommerce-text-primary transition-colors"
                    aria-label={t('homepage.common.clear')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <SearchSuggestions
                isOpen={isSearchFocused}
                onClose={() => setIsSearchFocused(false)}
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors"
                aria-label={t('homepage.common.searchPlaceholder').replace('...', '')}
              >
                <Search size={20} className="text-ecommerce-text-secondary" />
              </button>

              <ThemeToggle />

              {/* Language Switcher */}
              {/* <LanguageSwitcher /> */}

              {/* Notifications */}
              {/* <button
                type="button"
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors group"
                aria-label={t('homepage.header.notifications')}
              >
                <Bell size={18} className="text-ecommerce-text-secondary group-hover:text-ecommerce-amber transition-colors duration-200" />
                <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-ecommerce-red badge-pulse" />
              </button> */}

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                className="relative p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors duration-200 group"
                aria-label={t('homepage.mobileNav.wishlist')}
              >
                <Heart size={18} className="text-ecommerce-text-secondary group-hover:text-ecommerce-rose transition-colors duration-200" />
                {wishCount > 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -end-0.5">
                    <Badge className="h-4 w-4 flex items-center justify-center p-0 text-[9px] font-bold bg-ecommerce-rose text-white border border-white dark:border-ecommerce-surface">
                      {wishCount > 99 ? '99+' : wishCount}
                    </Badge>
                  </motion.div>
                )}
              </button>

              {session ? (
                <Link href="/profile" className="flex p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors duration-200" aria-label={t('homepage.header.account')}>
                  <User size={18} className="text-ecommerce-text-secondary" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  className="flex p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors duration-200"
                  aria-label={t('homepage.header.account')}
                >
                  <User size={18} className="text-ecommerce-text-secondary" />
                </button>
              )}

              <button
                type="button"
                onClick={toggleCart}
                className="relative p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors duration-200 group"
                aria-label={t('homepage.header.cart')}
              >
                <ShoppingCart size={18} className="text-ecommerce-text-secondary" />
                {total > 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -end-0.5">
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
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden">
                <div className="pb-3 relative">
                  <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-ecommerce-text-muted" />
                  <Input
                    placeholder={t('homepage.common.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                        setIsSearchOpen(false);
                      }
                    }}
                    className="ps-10 pe-4 h-10 bg-ecommerce-surface-hover border-ecommerce-border rounded-xl text-sm"
                    autoFocus
                  />
                  <SearchSuggestions isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Multi-level Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-ecommerce-border bg-white dark:bg-ecommerce-surface max-h-[70vh] overflow-y-auto scrollbar-thin"
            >
              <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <MobileMenuItem key={item.id} item={item} onClose={() => setMobileMenuOpen(false)} />
                ))}

                <div className="pt-2 border-t border-ecommerce-border mt-2">
                  <p className="px-4 py-1 text-xs font-semibold text-ecommerce-text-muted uppercase tracking-wider">{t('homepage.header.categories')}</p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.key}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-start px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors text-ecommerce-text-secondary hover:bg-ecommerce-surface-hover"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <WishlistDrawer open={isWishlistOpen} onClose={() => setWishlistOpen(false)} />
      {/* <NotificationPanel open={isNotifOpen} onClose={() => setIsNotifOpen(false)} /> */}
    </>
  );
}