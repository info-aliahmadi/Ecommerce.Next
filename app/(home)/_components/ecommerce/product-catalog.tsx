'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore, useWishlistStore, useCompareStore, useRecentStore } from '../../_lib/store';
import { useFlyToCart } from '../../_hooks/use-fly-to-cart';
import { useCategoryTranslations } from '../../_lib/category-translations';
import { ProductCard } from './product-card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  Grid3X3,
  LayoutList,
  ChevronDown,
  ChevronUp,
  Star,
  RotateCcw,
  PackageSearch,
  Filter,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';

// ── Types ──────────────────────────────────────────────
type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'popular' | 'rating' | 'name-asc' | 'name-desc';
type StockFilter = 'all' | 'inStock' | 'outOfStock';
type DiscountFilter = 'all' | 'withDiscount' | 'withoutDiscount';
type DateFilter = 'all' | 'today' | 'thisWeek' | 'thisMonth' | 'last3Months';

interface FilterState {
  search: string;
  categories: string[];
  minPrice: number;
  maxPrice: number;
  discount: DiscountFilter;
  stock: StockFilter;
  dateAdded: DateFilter;
  minRating: number;
  sort: SortOption;
  viewMode: 'grid' | 'list';
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  categories: [],
  minPrice: 0,
  maxPrice: 2000,
  discount: 'all',
  stock: 'all',
  dateAdded: 'all',
  minRating: 0,
  sort: 'newest',
  viewMode: 'grid',
};

const PAGE_SIZE = 12;

// ── Helper: getDateRange ──────────────────────────────
function getDateRange(filter: DateFilter): { from?: string; to?: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (filter) {
    case 'today':
      return { from: today.toISOString() };
    case 'thisWeek': {
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      return { from: startOfWeek.toISOString() };
    }
    case 'thisMonth':
      return { from: new Date(today.getFullYear(), today.getMonth(), 1).toISOString() };
    case 'last3Months': {
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return { from: threeMonthsAgo.toISOString() };
    }
    default:
      return {};
  }
}

// ── Main Component ────────────────────────────────────
export function ProductCatalog() {
  const t = useTranslations();
  const catTrans = useCategoryTranslations();
  const { isCatalogOpen, setCatalogOpen } = useUIStore();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    discount: true,
    stock: true,
    date: true,
    rating: true,
  });
  const topRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when catalog is open
  useEffect(() => {
    if (isCatalogOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCatalogOpen]);

  // Build API query params from filters
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('limit', '100');
    if (filters.search) params.set('search', filters.search);
    if (filters.categories.length > 0) params.set('categories', filters.categories.join(','));
    if (filters.minPrice > 0) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice < 2000) params.set('maxPrice', String(filters.maxPrice));
    if (filters.discount === 'withDiscount') params.set('hasDiscount', 'true');
    if (filters.discount === 'withoutDiscount') params.set('hasDiscount', 'false');
    if (filters.stock === 'inStock') params.set('inStock', 'true');
    if (filters.stock === 'outOfStock') params.set('inStock', 'false');
    if (filters.minRating > 0) params.set('rating', String(filters.minRating));
    if (filters.sort) params.set('sort', filters.sort);
    const dateRange = getDateRange(filters.dateAdded);
    if (dateRange.from) params.set('dateFrom', dateRange.from);
    if (dateRange.to) params.set('dateTo', dateRange.to);
    return params.toString();
  }, [filters]);

  const { data, isLoading } = useQuery({
    queryKey: ['catalog', queryParams],
    queryFn: () => fetch(`/api/products?${queryParams}`).then(r => r.json()),
    enabled: isCatalogOpen,
    staleTime: 30_000,
  });

  const products = data?.products || [];
  const total = data?.total || 0;
  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  // Filter update helpers
  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setVisibleCount(PAGE_SIZE);
  }, []);

  const toggleCategory = useCallback((slug: string) => {
    setFilters(prev => {
      const cats = prev.categories.includes(slug)
        ? prev.categories.filter(c => c !== slug)
        : [...prev.categories, slug];
      return { ...prev, categories: cats };
    });
    setVisibleCount(PAGE_SIZE);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setVisibleCount(PAGE_SIZE);
  }, []);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length > 0) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 2000) count++;
    if (filters.discount !== 'all') count++;
    if (filters.stock !== 'all') count++;
    if (filters.dateAdded !== 'all') count++;
    if (filters.minRating > 0) count++;
    return count;
  }, [filters]);

  // Active filter chips
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (filters.search) chips.push({ key: 'search', label: filters.search, onRemove: () => updateFilter('search', '') });
    filters.categories.forEach(slug => {
      chips.push({ key: `cat-${slug}`, label: catTrans[slug] || slug, onRemove: () => toggleCategory(slug) });
    });
    if (filters.minPrice > 0 || filters.maxPrice < 2000) {
      chips.push({ key: 'price', label: `$${filters.minPrice} – $${filters.maxPrice}`, onRemove: () => setFilters(p => ({ ...p, minPrice: 0, maxPrice: 2000 })) });
    }
    if (filters.discount !== 'all') {
      const label = filters.discount === 'withDiscount' ? t('catalog.filterWithDiscount') : t('catalog.filterWithoutDiscount');
      chips.push({ key: 'discount', label, onRemove: () => updateFilter('discount', 'all') });
    }
    if (filters.stock !== 'all') {
      const label = filters.stock === 'inStock' ? t('catalog.filterInStock') : t('catalog.filterOutOfStock');
      chips.push({ key: 'stock', label, onRemove: () => updateFilter('stock', 'all') });
    }
    if (filters.dateAdded !== 'all') {
      const labels: Record<string, string> = {
        today: t('catalog.filterDateToday'),
        thisWeek: t('catalog.filterDateThisWeek'),
        thisMonth: t('catalog.filterDateThisMonth'),
        last3Months: t('catalog.filterDateLast3Months'),
      };
      chips.push({ key: 'date', label: labels[filters.dateAdded], onRemove: () => updateFilter('dateAdded', 'all') });
    }
    if (filters.minRating > 0) {
      chips.push({ key: 'rating', label: `${filters.minRating}+ ★`, onRemove: () => updateFilter('minRating', 0) });
    }
    return chips;
  }, [filters, catTrans, t, toggleCategory, updateFilter]);

  const toggleSection = (key: string) => setExpandedSections(p => ({ ...p, [key]: !p[key] }));

  // Sort options
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: t('catalog.sortNewest') },
    { value: 'oldest', label: t('catalog.sortOldest') },
    { value: 'price-asc', label: t('catalog.sortPriceAsc') },
    { value: 'price-desc', label: t('catalog.sortPriceDesc') },
    { value: 'popular', label: t('catalog.sortPopular') },
    { value: 'rating', label: t('catalog.sortRating') },
    { value: 'name-asc', label: t('catalog.sortNameAsc') },
    { value: 'name-desc', label: t('catalog.sortNameDesc') },
  ];

  // Fetch categories for filter sidebar
  const { data: catData } = useQuery({
    queryKey: ['categories-all'],
    queryFn: () => fetch('/api/categories?limit=50').then(r => r.json()),
    staleTime: 60_000,
  });
  const categories = catData?.categories || [];

  // ── Filter Sidebar Content ──────────────────────────
  const filterSidebar = (
    <div className="space-y-1">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted" />
        <input
          type="text"
          value={filters.search}
          onChange={e => updateFilter('search', e.target.value)}
          placeholder={t('common.searchPlaceholder')}
          className="w-full h-10 ps-9 pe-3 rounded-xl bg-ecommerce-surface border border-ecommerce-border text-sm text-ecommerce-text-primary placeholder:text-ecommerce-text-muted focus:outline-none focus:ring-2 focus:ring-ecommerce-red/30 focus:border-ecommerce-red/50 transition-all"
        />
        {filters.search && (
          <button onClick={() => updateFilter('search', '')} className="absolute end-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted hover:text-ecommerce-text-primary">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="border border-ecommerce-border rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
        >
          {t('catalog.filterCategory')}
          {expandedSections.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {expandedSections.category && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                <label className="flex items-center gap-2.5 cursor-pointer group py-1">
                  <Checkbox
                    checked={filters.categories.length === 0}
                    onCheckedChange={() => setFilters(p => ({ ...p, categories: [] }))}
                    className="rounded-md data-[state=checked]:bg-ecommerce-red data-[state=checked]:border-ecommerce-red"
                  />
                  <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary transition-colors">
                    {t('catalog.filterCategoryAll')}
                  </span>
                  <span className="ms-auto text-xs text-ecommerce-text-muted">{total}</span>
                </label>
                {categories.map((cat : any) => (
                  <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group py-1">
                    <Checkbox
                      checked={filters.categories.includes(cat.slug)}
                      onCheckedChange={() => toggleCategory(cat.slug)}
                      className="rounded-md data-[state=checked]:bg-ecommerce-red data-[state=checked]:border-ecommerce-red"
                    />
                    <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary transition-colors">
                      {catTrans[cat.slug] || cat.name}
                    </span>
                    <span className="ms-auto text-xs text-ecommerce-text-muted">{cat._count?.products || 0}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range */}
      <div className="border border-ecommerce-border rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
        >
          {t('catalog.filterPrice')}
          {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-4">
                <Slider
                  value={[filters.minPrice, filters.maxPrice]}
                  min={0}
                  max={2000}
                  step={10}
                  onValueChange={([min, max]) => {
                    setFilters(p => ({ ...p, minPrice: min, maxPrice: max }));
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className="py-2"
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-ecommerce-text-muted uppercase tracking-wider mb-1 block">{t('catalog.priceMin')}</label>
                    <div className="relative">
                      <span className="absolute start-2.5 top-1/2 -translate-y-1/2 text-xs text-ecommerce-text-muted">$</span>
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={e => setFilters(p => ({ ...p, minPrice: Math.max(0, parseInt(e.target.value) || 0) }))}
                        className="w-full h-9 ps-6 pe-2 rounded-lg bg-ecommerce-surface border border-ecommerce-border text-sm text-ecommerce-text-primary focus:outline-none focus:ring-2 focus:ring-ecommerce-red/30"
                        min={0}
                      />
                    </div>
                  </div>
                  <span className="text-ecommerce-text-muted mt-4">–</span>
                  <div className="flex-1">
                    <label className="text-[10px] text-ecommerce-text-muted uppercase tracking-wider mb-1 block">{t('catalog.priceMax')}</label>
                    <div className="relative">
                      <span className="absolute start-2.5 top-1/2 -translate-y-1/2 text-xs text-ecommerce-text-muted">$</span>
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={e => setFilters(p => ({ ...p, maxPrice: Math.min(2000, parseInt(e.target.value) || 2000) }))}
                        className="w-full h-9 ps-6 pe-2 rounded-lg bg-ecommerce-surface border border-ecommerce-border text-sm text-ecommerce-text-primary focus:outline-none focus:ring-2 focus:ring-ecommerce-red/30"
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Discount Filter */}
      <div className="border border-ecommerce-border rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('discount')}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
        >
          {t('catalog.filterDiscount')}
          {expandedSections.discount ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {expandedSections.discount && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 space-y-1.5">
                {(['all', 'withDiscount', 'withoutDiscount'] as DiscountFilter[]).map(val => {
                  const labelMap: Record<string, string> = {
                    all: t('catalog.filterDiscountAll'),
                    withDiscount: t('catalog.filterWithDiscount'),
                    withoutDiscount: t('catalog.filterWithoutDiscount'),
                  };
                  return (
                    <label key={val} className="flex items-center gap-2.5 cursor-pointer group py-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      filters.discount === val
                        ? 'border-ecommerce-red bg-ecommerce-red'
                        : 'border-ecommerce-border group-hover:border-ecommerce-text-muted'
                    }`}>
                      {filters.discount === val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary transition-colors">
                      {labelMap[val]}
                    </span>
                  </label>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stock Filter */}
      <div className="border border-ecommerce-border rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('stock')}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
        >
          {t('catalog.filterStock')}
          {expandedSections.stock ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {expandedSections.stock && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 space-y-1.5">
                {([
                  { val: 'all' as StockFilter, label: 'filterStockAll' },
                  { val: 'inStock' as StockFilter, label: 'filterInStock' },
                  { val: 'outOfStock' as StockFilter, label: 'filterOutOfStock' },
                ]).map(({ val, label }) => (
                  <label key={val} className="flex items-center gap-2.5 cursor-pointer group py-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      filters.stock === val
                        ? 'border-ecommerce-red bg-ecommerce-red'
                        : 'border-ecommerce-border group-hover:border-ecommerce-text-muted'
                    }`}>
                      {filters.stock === val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary transition-colors">
                      {t(`catalog.${label}`)}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Date Filter */}
      <div className="border border-ecommerce-border rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('date')}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
        >
          {t('catalog.filterDate')}
          {expandedSections.date ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {expandedSections.date && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 space-y-1.5">
                {([
                  { val: 'all' as DateFilter, label: 'filterDateAll' },
                  { val: 'today' as DateFilter, label: 'filterDateToday' },
                  { val: 'thisWeek' as DateFilter, label: 'filterDateThisWeek' },
                  { val: 'thisMonth' as DateFilter, label: 'filterDateThisMonth' },
                  { val: 'last3Months' as DateFilter, label: 'filterDateLast3Months' },
                ]).map(({ val, label }) => (
                  <label key={val} className="flex items-center gap-2.5 cursor-pointer group py-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      filters.dateAdded === val
                        ? 'border-ecommerce-red bg-ecommerce-red'
                        : 'border-ecommerce-border group-hover:border-ecommerce-text-muted'
                    }`}>
                      {filters.dateAdded === val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary transition-colors">
                      {t(`catalog.${label}`)}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rating Filter */}
      <div className="border border-ecommerce-border rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
        >
          {t('catalog.filterRating')}
          {expandedSections.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {expandedSections.rating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 space-y-1.5">
                {[0, 4, 4.5, 3, 2].map(r => (
                  <label key={r} className="flex items-center gap-2.5 cursor-pointer group py-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      filters.minRating === r
                        ? 'border-ecommerce-red bg-ecommerce-red'
                        : 'border-ecommerce-border group-hover:border-ecommerce-text-muted'
                    }`}>
                      {filters.minRating === r && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="flex items-center gap-1">
                      {r === 0 ? (
                        <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary">{t('catalog.filterRatingAll')}</span>
                      ) : (
                        <>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                size={14}
                                className={star <= Math.floor(r) ? 'text-ecommerce-amber fill-ecommerce-amber' : 'text-ecommerce-border'}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-ecommerce-text-muted">&amp; up</span>
                        </>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reset Button */}
      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full rounded-xl border-ecommerce-border text-ecommerce-text-secondary hover:text-ecommerce-red hover:border-ecommerce-red/50 hover:bg-ecommerce-red/5 gap-2"
        >
          <RotateCcw size={14} />
          {t('catalog.resetAll')}
        </Button>
      )}
    </div>
  );

  // ── Render ──────────────────────────────────────────
  return (
    <AnimatePresence>
      {isCatalogOpen && (
        <motion.div
          ref={topRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-background"
        >
          {/* Top Bar */}
          <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-ecommerce-border">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
              {/* Back */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCatalogOpen(false)}
                className="shrink-0 rounded-xl hover:bg-ecommerce-surface-hover gap-2 text-ecommerce-text-secondary hover:text-ecommerce-text-primary"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">{t('catalog.backToHome')}</span>
              </Button>

              {/* Title */}
              <h1 className="text-lg font-bold text-ecommerce-text-primary hidden md:block">
                {t('catalog.title')}
              </h1>

              {/* Search (desktop) */}
              <div className="flex-1 max-w-md mx-auto hidden md:block relative">
                <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={e => updateFilter('search', e.target.value)}
                  placeholder={t('common.searchPlaceholder')}
                  className="w-full h-10 ps-9 pe-3 rounded-xl bg-ecommerce-surface border border-ecommerce-border text-sm text-ecommerce-text-primary placeholder:text-ecommerce-text-muted focus:outline-none focus:ring-2 focus:ring-ecommerce-red/30 focus:border-ecommerce-red/50 transition-all"
                />
                {filters.search && (
                  <button onClick={() => updateFilter('search', '')} className="absolute end-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted hover:text-ecommerce-text-primary">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <Select value={filters.sort} onValueChange={v => updateFilter('sort', v as SortOption)}>
                <SelectTrigger className="w-auto h-10 min-w-[140px] rounded-xl bg-ecommerce-surface border-ecommerce-border text-sm">
                  <SlidersHorizontal size={14} className="me-1.5 text-ecommerce-text-muted" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {sortOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className="text-sm">{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-ecommerce-surface rounded-xl p-1 border border-ecommerce-border">
                <button
                  onClick={() => updateFilter('viewMode', 'grid')}
                  className={`p-2 rounded-lg transition-all ${filters.viewMode === 'grid' ? 'bg-ecommerce-red text-white shadow-sm' : 'text-ecommerce-text-muted hover:text-ecommerce-text-primary'}`}
                  aria-label={t('catalog.gridView')}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => updateFilter('viewMode', 'list')}
                  className={`p-2 rounded-lg transition-all ${filters.viewMode === 'list' ? 'bg-ecommerce-red text-white shadow-sm' : 'text-ecommerce-text-muted hover:text-ecommerce-text-primary'}`}
                  aria-label={t('catalog.listView')}
                >
                  <LayoutList size={16} />
                </button>
              </div>

              {/* Mobile filter button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden shrink-0 rounded-xl border-ecommerce-border gap-2 relative"
              >
                <Filter size={16} />
                {t('catalog.filters')}
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-ecommerce-red text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Active Filters Bar */}
            <AnimatePresence>
              {activeFilterChips.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-ecommerce-border overflow-hidden"
                >
                  <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="text-xs font-semibold text-ecommerce-text-muted shrink-0">{t('catalog.activeFilters')}:</span>
                    {activeFilterChips.map(chip => (
                      <Badge
                        key={chip.key}
                        variant="secondary"
                        className="shrink-0 rounded-lg px-2.5 py-1 text-xs bg-ecommerce-red/10 text-ecommerce-red border-ecommerce-red/20 hover:bg-ecommerce-red/20 cursor-pointer gap-1"
                        onClick={chip.onRemove}
                      >
                        {chip.label}
                        <X size={12} />
                      </Badge>
                    ))}
                    <button
                      onClick={resetFilters}
                      className="text-xs text-ecommerce-text-muted hover:text-ecommerce-red shrink-0 font-medium transition-colors"
                    >
                      {t('catalog.clearAllFilters')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Content */}
          <div className="max-w-[1600px] mx-auto flex min-h-[calc(100vh-4rem)]">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 shrink-0 border-e border-ecommerce-border p-4 overflow-y-auto max-h-[calc(100vh-4rem)] sticky top-16 custom-scrollbar">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-ecommerce-text-primary">{t('catalog.filters')}</h2>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="bg-ecommerce-red text-white rounded-full px-2 text-[10px]">
                    {activeFilterCount}
                  </Badge>
                )}
              </div>
              {filterSidebar}
            </aside>

            {/* Product Area */}
            <main className="flex-1 p-4 sm:p-6">
              {/* Results Count */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-ecommerce-text-muted">
                  {isLoading ? (
                    <Skeleton className="h-4 w-40" />
                  ) : (
                    t('catalog.showingResults', { shown: visibleProducts.length, total })
                  )}
                </p>
                {/* Mobile view toggle & search */}
                <div className="flex sm:hidden items-center gap-2">
                  <div className="flex items-center bg-ecommerce-surface rounded-lg p-0.5 border border-ecommerce-border">
                    <button
                      onClick={() => updateFilter('viewMode', 'grid')}
                      className={`p-1.5 rounded-md transition-all ${filters.viewMode === 'grid' ? 'bg-ecommerce-red text-white' : 'text-ecommerce-text-muted'}`}
                    >
                      <Grid3X3 size={14} />
                    </button>
                    <button
                      onClick={() => updateFilter('viewMode', 'list')}
                      className={`p-1.5 rounded-md transition-all ${filters.viewMode === 'list' ? 'bg-ecommerce-red text-white' : 'text-ecommerce-text-muted'}`}
                    >
                      <LayoutList size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-ecommerce-border overflow-hidden">
                      <Skeleton className="aspect-square w-full" />
                      <div className="p-3 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-5 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : visibleProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-ecommerce-surface flex items-center justify-center mb-5">
                    <PackageSearch size={36} className="text-ecommerce-text-muted" />
                  </div>
                  <h3 className="text-lg font-bold text-ecommerce-text-primary mb-2">{t('catalog.noResults')}</h3>
                  <p className="text-sm text-ecommerce-text-muted max-w-sm mb-5">{t('catalog.noResultsDesc')}</p>
                  <Button
                    onClick={resetFilters}
                    className="rounded-xl bg-ecommerce-red hover:bg-ecommerce-red/90 text-white gap-2"
                  >
                    <RotateCcw size={14} />
                    {t('catalog.resetAll')}
                  </Button>
                </div>
              ) : (
                <>
                  <motion.div
                    layout
                    className={filters.viewMode === 'grid'
                      ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
                      : 'space-y-3'
                    }
                  >
                    {visibleProducts.map((product: Record<string, unknown>, index: number) => (
                      <motion.div
                        key={product.id as string}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                      >
                        <ProductCard
                          id={product.id as string}
                          name={product.name as string}
                          price={product.price as number}
                          comparePrice={product.comparePrice as number | undefined}
                          image={product.image as string}
                          rating={product.rating as number}
                          reviewCount={product.reviewCount as number}
                          category={product.category as { name: string; color: string }}
                          shortDesc={product.shortDesc as string | undefined}
                          description={product.description as string | undefined}
                          stock={product.stock as number | undefined}
                          sku={product.sku as string | undefined}
                          tags={product.tags as string | undefined}
                          index={index}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Load More */}
                  {hasMore && (
                    <div className="flex justify-center mt-10">
                      <Button
                        variant="outline"
                        onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                        className="rounded-xl border-ecommerce-red text-ecommerce-red hover:bg-ecommerce-red/5 px-8 gap-2 h-11"
                      >
                        {t('common.loadMore')}
                        <span className="text-xs text-ecommerce-text-muted">
                          ({products.length - visibleCount} {t('common.remaining')})
                        </span>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>

          {/* Mobile Filter Sheet */}
          <AnimatePresence>
            {showMobileFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="fixed inset-0 bg-black/40 z-[110] md:hidden"
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="fixed inset-x-0 bottom-0 z-[115] bg-background rounded-t-3xl max-h-[85vh] overflow-y-auto md:hidden custom-scrollbar"
                >
                  {/* Sheet Header */}
                  <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-ecommerce-border px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-ecommerce-text-primary">{t('catalog.filters')}</h2>
                      {activeFilterCount > 0 && (
                        <Badge className="bg-ecommerce-red text-white rounded-full px-2 text-[10px]">{activeFilterCount}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {activeFilterCount > 0 && (
                        <button onClick={resetFilters} className="text-xs text-ecommerce-red font-medium">
                          {t('catalog.resetAll')}
                        </button>
                      )}
                      <button onClick={() => setShowMobileFilters(false)} className="p-1.5 rounded-lg hover:bg-ecommerce-surface-hover">
                        <X size={18} className="text-ecommerce-text-muted" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Search */}
                  <div className="px-5 pt-4">
                    <div className="relative">
                      <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted" />
                      <input
                        type="text"
                        value={filters.search}
                        onChange={e => updateFilter('search', e.target.value)}
                        placeholder={t('common.searchPlaceholder')}
                        className="w-full h-10 ps-9 pe-3 rounded-xl bg-ecommerce-surface border border-ecommerce-border text-sm text-ecommerce-text-primary placeholder:text-ecommerce-text-muted focus:outline-none focus:ring-2 focus:ring-ecommerce-red/30 focus:border-ecommerce-red/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Filter Content */}
                  <div className="p-5 space-y-1">
                    {filterSidebar}
                  </div>

                  {/* Apply Button */}
                  <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-ecommerce-border p-5">
                    <Button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full h-12 rounded-xl bg-ecommerce-red hover:bg-ecommerce-red/90 text-white font-semibold text-sm"
                    >
                      {t('catalog.showingResults', { shown: visibleProducts.length, total })} — {t('catalog.closeFilters')}
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}