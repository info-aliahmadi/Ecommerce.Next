'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCategoryTranslations } from '../_lib/category-translations';
import { ProductCard } from '../_components/ecommerce/product-card';
import { Header } from '../_components/ecommerce/header';
import { Footer } from '../_components/ecommerce/footer';
import { CartDrawer } from '../_components/ecommerce/cart-drawer';
import { QuickViewModal } from '../_components/ecommerce/quick-view-modal';
import { BackToTop } from '../_components/ecommerce/back-to-top';
import { CompareBar } from '../_components/ecommerce/compare-bar';
import { CompareDrawer } from '../_components/ecommerce/compare-drawer';
import { FlyToCart } from '../_components/ecommerce/fly-to-cart';
import { MobileBottomNav } from '../_components/ecommerce/mobile-bottom-nav';
import { I18nProvider } from '../i18n/provider';

import { Button } from '../_components/ui/button';
import { Badge } from '../_components/ui/badge';
import { Checkbox } from '../_components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../_components/ui/radio-group';
import { Input } from '../_components/ui/input';
import { Label } from '../_components/ui/label';
import { Separator } from '../_components/ui/separator';
import { Skeleton } from '../_components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../_components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../_components/ui/sheet';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../_components/ui/breadcrumb';
import { ScrollArea } from '../_components/ui/scroll-area';
import {
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
  ChevronLeft,
  ChevronRight,
  Home,
} from 'lucide-react';
import { useCompareStore } from '../_lib/store';

// ── Types ──────────────────────────────────────────────
type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'popular' | 'rating' | 'name-asc' | 'name-desc';
type StockFilter = 'all' | 'inStock' | 'outOfStock';
type DiscountFilter = 'all' | 'withDiscount' | 'withoutDiscount';
type DateFilter = 'all' | 'today' | 'thisWeek' | 'thisMonth' | 'last3Months' | 'last6Months' | 'thisYear';
type ViewMode = 'grid' | 'list';

interface FilterState {
  search: string;
  categories: string[];
  minPrice: string;
  maxPrice: string;
  appliedMinPrice: string;
  appliedMaxPrice: string;
  discount: DiscountFilter;
  stock: StockFilter;
  dateAdded: DateFilter;
  minRating: number;
  tags: string[];
  sort: SortOption;
  viewMode: ViewMode;
  page: number;
  perPage: number;
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  categories: [],
  minPrice: '',
  maxPrice: '',
  appliedMinPrice: '',
  appliedMaxPrice: '',
  discount: 'all',
  stock: 'all',
  dateAdded: 'all',
  minRating: 0,
  tags: [],
  sort: 'newest',
  viewMode: 'grid',
  page: 1,
  perPage: 12,
};

const PER_PAGE_OPTIONS = [12, 24, 36, 48];

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
    case 'last6Months': {
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return { from: sixMonthsAgo.toISOString() };
    }
    case 'thisYear':
      return { from: new Date(today.getFullYear(), 0, 1).toISOString() };
    default:
      return {};
  }
}

// ── Main Component ────────────────────────────────────
function ProductsPageContent() {
  const t = useTranslations();
  const catTrans = useCategoryTranslations();
  const isCompareOpen = useCompareStore((s) => s.isCompareOpen);
  const setCompareOpen = useCompareStore((s) => s.setCompareOpen);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    discount: false,
    stock: false,
    date: false,
    rating: false,
    tags: false,
  });

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters.page]);

  // ── Fetch categories ────────────────────────────────
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetch('/api/categories').then((r) => r.json()),
    staleTime: 60_000,
  });

  // ── Fetch all products (for tag extraction) ─────────
  const { data: allProductsData } = useQuery({
    queryKey: ['all-products-tags'],
    queryFn: () => fetch('/api/products?limit=100').then((r) => r.json()),
    staleTime: 60_000,
  });

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    (allProductsData?.products || []).forEach((p: { tags?: string }) => {
      if (p.tags) {
        try {
          const parsed: string[] = JSON.parse(p.tags);
          parsed.forEach((tag) => tagSet.add(tag));
        } catch {
          // ignore malformed tags
        }
      }
    });
    return Array.from(tagSet).sort();
  }, [allProductsData]);

  // ── Build API query params ──────────────────────────
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('limit', String(filters.perPage));
    params.set('offset', String((filters.page - 1) * filters.perPage));
    if (filters.search) params.set('search', filters.search);
    if (filters.categories.length > 0) params.set('categories', filters.categories.join(','));
    if (filters.appliedMinPrice) params.set('minPrice', filters.appliedMinPrice);
    if (filters.appliedMaxPrice) params.set('maxPrice', filters.appliedMaxPrice);
    if (filters.discount === 'withDiscount') params.set('hasDiscount', 'true');
    if (filters.discount === 'withoutDiscount') params.set('hasDiscount', 'false');
    if (filters.stock === 'inStock') params.set('inStock', 'true');
    if (filters.stock === 'outOfStock') params.set('inStock', 'false');
    if (filters.minRating > 0) params.set('rating', String(filters.minRating));
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.tags.length > 0) params.set('tags', filters.tags.join(','));
    const dateRange = getDateRange(filters.dateAdded);
    if (dateRange.from) params.set('dateFrom', dateRange.from);
    if (dateRange.to) params.set('dateTo', dateRange.to);
    return params.toString();
  }, [filters]);

  const { data, isLoading } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => fetch(`/api/products?${queryParams}`).then((r) => r.json()),
    staleTime: 30_000,
  });

  const products = data?.products || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.perPage));

  // ── Filter helpers ──────────────────────────────────
  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    [],
  );

  const toggleCategory = useCallback((slug: string) => {
    setFilters((prev) => {
      const cats = prev.categories.includes(slug)
        ? prev.categories.filter((c) => c !== slug)
        : [...prev.categories, slug];
      return { ...prev, categories: cats, page: 1 };
    });
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setFilters((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags, page: 1 };
    });
  }, []);

  const applyPriceRange = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      appliedMinPrice: prev.minPrice,
      appliedMaxPrice: prev.maxPrice,
      page: 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // ── Active filter count ─────────────────────────────
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length > 0) count++;
    if (filters.appliedMinPrice || filters.appliedMaxPrice) count++;
    if (filters.discount !== 'all') count++;
    if (filters.stock !== 'all') count++;
    if (filters.dateAdded !== 'all') count++;
    if (filters.minRating > 0) count++;
    if (filters.tags.length > 0) count++;
    return count;
  }, [filters]);

  // ── Active filter chips ─────────────────────────────
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (filters.search)
      chips.push({
        key: 'search',
        label: filters.search,
        onRemove: () => updateFilter('search', ''),
      });
    filters.categories.forEach((slug) => {
      const cat = categories.find((c: { slug: string }) => c.slug === slug);
      chips.push({
        key: `cat-${slug}`,
        label: cat ? (catTrans[cat.slug] || cat.name) : slug,
        onRemove: () => toggleCategory(slug),
      });
    });
    if (filters.appliedMinPrice || filters.appliedMaxPrice) {
      const min = filters.appliedMinPrice || '0';
      const max = filters.appliedMaxPrice || '∞';
      chips.push({
        key: 'price',
        label: `$${min} – $${max}`,
        onRemove: () =>
          setFilters((p) => ({
            ...p,
            minPrice: '',
            maxPrice: '',
            appliedMinPrice: '',
            appliedMaxPrice: '',
            page: 1,
          })),
      });
    }
    if (filters.discount !== 'all') {
      const label =
        filters.discount === 'withDiscount'
          ? t('shopPage.withDiscount')
          : t('shopPage.withoutDiscount');
      chips.push({
        key: 'discount',
        label,
        onRemove: () => updateFilter('discount', 'all'),
      });
    }
    if (filters.stock !== 'all') {
      const label =
        filters.stock === 'inStock'
          ? t('shopPage.inStockOnly')
          : t('shopPage.outOfStockOnly');
      chips.push({
        key: 'stock',
        label,
        onRemove: () => updateFilter('stock', 'all'),
      });
    }
    if (filters.dateAdded !== 'all') {
      const dateLabels: Record<string, string> = {
        today: t('shopPage.today'),
        thisWeek: t('shopPage.thisWeek'),
        thisMonth: t('shopPage.thisMonth'),
        last3Months: t('shopPage.last3Months'),
        last6Months: t('shopPage.last6Months'),
        thisYear: t('shopPage.thisYear'),
      };
      chips.push({
        key: 'date',
        label: dateLabels[filters.dateAdded] || filters.dateAdded,
        onRemove: () => updateFilter('dateAdded', 'all'),
      });
    }
    if (filters.minRating > 0) {
      chips.push({
        key: 'rating',
        label: `${filters.minRating}+ ★`,
        onRemove: () => updateFilter('minRating', 0),
      });
    }
    filters.tags.forEach((tag) => {
      chips.push({
        key: `tag-${tag}`,
        label: tag,
        onRemove: () => toggleTag(tag),
      });
    });
    return chips;
  }, [filters, categories, catTrans, t, toggleCategory, toggleTag, updateFilter]);

  const toggleSection = (key: string) =>
    setExpandedSections((p) => ({ ...p, [key]: !p[key] }));

  // ── Sort options ────────────────────────────────────
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: t('shopPage.sortNewest') },
    { value: 'oldest', label: t('shopPage.sortOldest') },
    { value: 'price-asc', label: t('shopPage.sortPriceAsc') },
    { value: 'price-desc', label: t('shopPage.sortPriceDesc') },
    { value: 'popular', label: t('shopPage.sortPopular') },
    { value: 'rating', label: t('shopPage.sortRating') },
    { value: 'name-asc', label: t('shopPage.sortNameAsc') },
    { value: 'name-desc', label: t('shopPage.sortNameDesc') },
  ];

  // ── Date filter options ─────────────────────────────
  const dateOptions: { value: DateFilter; labelKey: string }[] = [
    { value: 'all', labelKey: 'allTime' },
    { value: 'today', labelKey: 'today' },
    { value: 'thisWeek', labelKey: 'thisWeek' },
    { value: 'thisMonth', labelKey: 'thisMonth' },
    { value: 'last3Months', labelKey: 'last3Months' },
    { value: 'last6Months', labelKey: 'last6Months' },
    { value: 'thisYear', labelKey: 'thisYear' },
  ];

  // ── Filter Sidebar Content (shared between desktop & sheet) ──
  const filterSidebarContent = (
    <div className="space-y-1">
      {/* Category Filter */}
      <div className="border border-ecommerce-border rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
        >
          {t('shopPage.categoriesFilter')}
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
                    onCheckedChange={() =>
                      setFilters((p) => ({ ...p, categories: [], page: 1 }))
                    }
                    className="rounded-md data-[state=checked]:bg-ecommerce-red data-[state=checked]:border-ecommerce-red"
                  />
                  <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary transition-colors">
                    {t('shopPage.allCategories')}
                  </span>
                  <span className="ms-auto text-xs text-ecommerce-text-muted">{total}</span>
                </label>
                {categories.map((cat: { id: string; slug: string; name: string; _count?: { products: number } }) => (
                  <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group py-1">
                    <Checkbox
                      checked={filters.categories.includes(cat.slug)}
                      onCheckedChange={() => toggleCategory(cat.slug)}
                      className="rounded-md data-[state=checked]:bg-ecommerce-red data-[state=checked]:border-ecommerce-red"
                    />
                    <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary transition-colors">
                      {catTrans[cat.slug] || cat.name}
                    </span>
                    <span className="ms-auto text-xs text-ecommerce-text-muted">
                      {cat._count?.products || 0}
                    </span>
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
          {t('shopPage.priceRange')}
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
              <div className="px-4 pb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label className="text-[10px] text-ecommerce-text-muted uppercase tracking-wider mb-1.5 block">
                      {t('shopPage.minPrice')}
                    </Label>
                    <Input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters((p) => ({ ...p, minPrice: e.target.value }))
                      }
                      placeholder="0"
                      min={0}
                      className="h-9 text-sm bg-ecommerce-surface border-ecommerce-border focus-visible:ring-ecommerce-red/30 focus-visible:border-ecommerce-red/50 rounded-lg"
                    />
                  </div>
                  <span className="text-ecommerce-text-muted mt-5">–</span>
                  <div className="flex-1">
                    <Label className="text-[10px] text-ecommerce-text-muted uppercase tracking-wider mb-1.5 block">
                      {t('shopPage.maxPrice')}
                    </Label>
                    <Input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters((p) => ({ ...p, maxPrice: e.target.value }))
                      }
                      placeholder="2000"
                      min={0}
                      className="h-9 text-sm bg-ecommerce-surface border-ecommerce-border focus-visible:ring-ecommerce-red/30 focus-visible:border-ecommerce-red/50 rounded-lg"
                    />
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={applyPriceRange}
                  className="w-full rounded-lg bg-ecommerce-red hover:bg-ecommerce-red/90 text-white text-xs font-medium h-9"
                >
                  {t('shopPage.apply')}
                </Button>
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
          {t('shopPage.discountFilter')}
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
              <div className="px-4 pb-3">
                <RadioGroup
                  value={filters.discount}
                  onValueChange={(v) => updateFilter('discount', v as DiscountFilter)}
                  className="space-y-2"
                >
                  {[
                    { val: 'all', label: t('shopPage.all') },
                    { val: 'withDiscount', label: t('shopPage.withDiscount') },
                    { val: 'withoutDiscount', label: t('shopPage.withoutDiscount') },
                  ].map(({ val, label }) => (
                    <div key={val} className="flex items-center gap-2.5 cursor-pointer group">
                      <RadioGroupItem value={val} id={`discount-${val}`} className="border-ecommerce-border data-[state=checked]:border-ecommerce-red data-[state=checked]:bg-ecommerce-red" />
                      <Label
                        htmlFor={`discount-${val}`}
                        className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary cursor-pointer transition-colors"
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
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
          {t('shopPage.availabilityFilter')}
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
              <div className="px-4 pb-3">
                <RadioGroup
                  value={filters.stock}
                  onValueChange={(v) => updateFilter('stock', v as StockFilter)}
                  className="space-y-2"
                >
                  {[
                    { val: 'all', label: t('shopPage.all') },
                    { val: 'inStock', label: t('shopPage.inStockOnly') },
                    { val: 'outOfStock', label: t('shopPage.outOfStockOnly') },
                  ].map(({ val, label }) => (
                    <div key={val} className="flex items-center gap-2.5 cursor-pointer group">
                      <RadioGroupItem value={val} id={`stock-${val}`} className="border-ecommerce-border data-[state=checked]:border-ecommerce-red data-[state=checked]:bg-ecommerce-red" />
                      <Label
                        htmlFor={`stock-${val}`}
                        className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary cursor-pointer transition-colors"
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
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
          {t('shopPage.dateFilter')}
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
              <div className="px-4 pb-3 max-h-60 overflow-y-auto custom-scrollbar">
                <RadioGroup
                  value={filters.dateAdded}
                  onValueChange={(v) => updateFilter('dateAdded', v as DateFilter)}
                  className="space-y-2"
                >
                  {dateOptions.map(({ value, labelKey }) => (
                    <div key={value} className="flex items-center gap-2.5 cursor-pointer group">
                      <RadioGroupItem
                        value={value}
                        id={`date-${value}`}
                        className="border-ecommerce-border data-[state=checked]:border-ecommerce-red data-[state=checked]:bg-ecommerce-red"
                      />
                      <Label
                        htmlFor={`date-${value}`}
                        className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary cursor-pointer transition-colors"
                      >
                        {t(`shopPage.${labelKey}`)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
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
          {t('shopPage.ratingFilter')}
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
              <div className="px-4 pb-3">
                <RadioGroup
                  value={String(filters.minRating)}
                  onValueChange={(v) => updateFilter('minRating', Number(v))}
                  className="space-y-2"
                >
                  {[
                    { val: '0', label: t('shopPage.allRatings') },
                    { val: '4', stars: 4 },
                    { val: '3', stars: 3 },
                    { val: '2', stars: 2 },
                    { val: '1', stars: 1 },
                  ].map(({ val, label, stars }) => (
                    <div key={val} className="flex items-center gap-2.5 cursor-pointer group">
                      <RadioGroupItem
                        value={val}
                        id={`rating-${val}`}
                        className="border-ecommerce-border data-[state=checked]:border-ecommerce-red data-[state=checked]:bg-ecommerce-red"
                      />
                      <Label
                        htmlFor={`rating-${val}`}
                        className="flex items-center gap-1.5 text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary cursor-pointer transition-colors"
                      >
                        {label || (
                          <span className="flex items-center gap-1">
                            <span className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < (stars || 0)
                                      ? 'text-ecommerce-amber fill-ecommerce-amber'
                                      : 'text-ecommerce-border'
                                  }
                                />
                              ))}
                            </span>
                            <span className="text-xs text-ecommerce-text-muted">& up</span>
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tags Filter */}
      {availableTags.length > 0 && (
        <div className="border border-ecommerce-border rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('tags')}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
          >
            {t('shopPage.tagsFilter')}
            {expandedSections.tags ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <AnimatePresence>
            {expandedSections.tags && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-3 space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                  {availableTags.map((tag) => (
                    <label key={tag} className="flex items-center gap-2.5 cursor-pointer group py-1">
                      <Checkbox
                        checked={filters.tags.includes(tag)}
                        onCheckedChange={() => toggleTag(tag)}
                        className="rounded-md data-[state=checked]:bg-ecommerce-red data-[state=checked]:border-ecommerce-red"
                      />
                      <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary transition-colors capitalize">
                        {tag}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Reset Button */}
      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full rounded-xl border-ecommerce-border text-ecommerce-text-secondary hover:text-ecommerce-red hover:border-ecommerce-red/50 hover:bg-ecommerce-red/5 gap-2 mt-2"
        >
          <RotateCcw size={14} />
          {t('shopPage.resetFilters')}
        </Button>
      )}
    </div>
  );

  // ── Pagination info ─────────────────────────────────
  const showingStart = total === 0 ? 0 : (filters.page - 1) * filters.perPage + 1;
  const showingEnd = Math.min(filters.page * filters.perPage, total);

  // ── Render ──────────────────────────────────────────
  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col pb-16 lg:pb-0 bg-background">
        <Header />

        <main className="flex-1">
          {/* Page Header */}
          <div className="border-b border-ecommerce-border bg-ecommerce-surface/50">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-5">
              {/* Breadcrumb */}
              <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-ecommerce-text-muted hover:text-ecommerce-text-primary text-sm flex items-center gap-1.5">
                      <Home size={14} />
                      {t('shopPage.breadcrumbHome')}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-ecommerce-text-primary font-medium text-sm">
                      {t('shopPage.breadcrumbShop')}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Title & Description */}
              <div className="mb-5">
                <h1 className="text-2xl sm:text-3xl font-bold text-ecommerce-text-primary">
                  {t('shopPage.title')}
                </h1>
                <p className="text-sm text-ecommerce-text-muted mt-1">
                  {t('shopPage.subtitle')}
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-xl">
                <Search
                  size={18}
                  className="absolute start-4 top-1/2 -translate-y-1/2 text-ecommerce-text-muted"
                />
                <Input
                  type="text"
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  placeholder={t('shopPage.searchProducts')}
                  className="h-11 ps-11 pe-10 rounded-xl bg-white dark:bg-ecommerce-surface border-ecommerce-border text-sm text-ecommerce-text-primary placeholder:text-ecommerce-text-muted focus-visible:ring-ecommerce-red/30 focus-visible:border-ecommerce-red/50 transition-all"
                />
                {filters.search && (
                  <button
                    onClick={() => updateFilter('search', '')}
                    className="absolute end-4 top-1/2 -translate-y-1/2 text-ecommerce-text-muted hover:text-ecommerce-text-primary transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Toolbar & Content */}
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-5">
            {/* Toolbar Row */}
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              {/* Left: Results count + Mobile filter button */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSheetOpen(true)}
                  className="lg:hidden shrink-0 rounded-xl border-ecommerce-border gap-2 relative h-9"
                >
                  <SlidersHorizontal size={15} />
                  {t('shopPage.openFilters')}
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-ecommerce-red text-white text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                <p className="text-sm text-ecommerce-text-muted">
                  {isLoading ? (
                    <Skeleton className="h-4 w-40 inline-block" />
                  ) : (
                    <span>
                      {t('shopPage.showingResults', {
                        shown: total === 0 ? 0 : `${showingStart}-${showingEnd}`,
                        total,
                      })}
                    </span>
                  )}
                </p>
              </div>

              {/* Right: Sort, Per Page, View Mode */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Sort */}
                <Select
                  value={filters.sort}
                  onValueChange={(v) => updateFilter('sort', v as SortOption)}
                >
                  <SelectTrigger className="h-9 min-w-[140px] rounded-xl bg-ecommerce-surface border-ecommerce-border text-sm">
                    <SlidersHorizontal size={14} className="me-1.5 text-ecommerce-text-muted" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-sm">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Per Page (desktop only) */}
                <Select
                  value={String(filters.perPage)}
                  onValueChange={(v) => updateFilter('perPage', Number(v))}
                >
                  <SelectTrigger className="hidden sm:flex h-9 w-auto min-w-[90px] rounded-xl bg-ecommerce-surface border-ecommerce-border text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {PER_PAGE_OPTIONS.map((n) => (
                      <SelectItem key={n} value={String(n)} className="text-sm">
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-ecommerce-surface rounded-xl p-1 border border-ecommerce-border">
                  <button
                    onClick={() => updateFilter('viewMode', 'grid')}
                    className={`p-2 rounded-lg transition-all ${
                      filters.viewMode === 'grid'
                        ? 'bg-ecommerce-red text-white shadow-sm'
                        : 'text-ecommerce-text-muted hover:text-ecommerce-text-primary'
                    }`}
                    aria-label={t('shopPage.gridView')}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => updateFilter('viewMode', 'list')}
                    className={`p-2 rounded-lg transition-all ${
                      filters.viewMode === 'list'
                        ? 'bg-ecommerce-red text-white shadow-sm'
                        : 'text-ecommerce-text-muted hover:text-ecommerce-text-primary'
                    }`}
                    aria-label={t('shopPage.listView')}
                  >
                    <LayoutList size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Bar */}
            <AnimatePresence>
              {activeFilterChips.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-ecommerce-text-muted shrink-0">
                      {t('shopPage.activeFilters')}:
                    </span>
                    {activeFilterChips.map((chip) => (
                      <Badge
                        key={chip.key}
                        variant="secondary"
                        className="shrink-0 rounded-lg px-2.5 py-1 text-xs bg-ecommerce-red/10 text-ecommerce-red border-ecommerce-red/20 hover:bg-ecommerce-red/20 cursor-pointer gap-1 transition-colors"
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
                      {t('shopPage.clearAll')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content Grid: Sidebar + Products */}
            <div className="flex gap-6">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-ecommerce-text-primary">
                      {t('shopPage.filterBy')}
                    </h2>
                    {activeFilterCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-ecommerce-red text-white rounded-full px-2 text-[10px]"
                      >
                        {t('shopPage.filtersCount', { count: activeFilterCount })}
                      </Badge>
                    )}
                  </div>
                  <ScrollArea className="max-h-[calc(100vh-220px)]">
                    {filterSidebarContent}
                  </ScrollArea>
                </div>
              </aside>

              {/* Product Grid Area */}
              <div className="flex-1 min-w-0">
                {isLoading ? (
                  <div
                    className={
                      filters.viewMode === 'grid'
                        ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
                        : 'space-y-3'
                    }
                  >
                    {Array.from({ length: filters.perPage }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-ecommerce-border overflow-hidden"
                      >
                        <Skeleton className="aspect-square w-full" />
                        <div className="p-3 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-5 w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-ecommerce-surface flex items-center justify-center mb-5">
                      <PackageSearch size={36} className="text-ecommerce-text-muted" />
                    </div>
                    <h3 className="text-lg font-bold text-ecommerce-text-primary mb-2">
                      {t('shopPage.noResults')}
                    </h3>
                    <p className="text-sm text-ecommerce-text-muted max-w-sm mb-3">
                      {t('shopPage.noResultsDesc')}
                    </p>
                    <div className="text-sm text-ecommerce-text-muted space-y-1 mb-5">
                      <p>{t('shopPage.noResultsSuggestion')}</p>
                      <ul className="list-disc list-inside space-y-0.5 text-xs">
                        <li>{t('shopPage.tryBroadening')}</li>
                        <li>{t('shopPage.clearFilters')}</li>
                        <li>{t('shopPage.checkSpelling')}</li>
                      </ul>
                    </div>
                    <Button
                      onClick={resetFilters}
                      className="rounded-xl bg-ecommerce-red hover:bg-ecommerce-red/90 text-white gap-2"
                    >
                      <RotateCcw size={14} />
                      {t('shopPage.resetFilters')}
                    </Button>
                  </div>
                ) : (
                  <>
                    <motion.div
                      layout
                      className={
                        filters.viewMode === 'grid'
                          ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
                          : 'space-y-3'
                      }
                    >
                      {products.map(
                        (product: Record<string, unknown>, index: number) => (
                          <motion.div
                            key={product.id as string}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: Math.min(index * 0.04, 0.4),
                            }}
                          >
                            <Link href={`/products/${product.id as string}`} className="block">
                              <ProductCard
                                id={product.id as string}
                                name={product.name as string}
                                price={product.price as number}
                                comparePrice={
                                  product.comparePrice as number | undefined
                                }
                                image={product.image as string}
                                rating={product.rating as number}
                                reviewCount={product.reviewCount as number}
                                category={
                                  product.category as { name: string; color: string }
                                }
                                shortDesc={
                                  product.shortDesc as string | undefined
                                }
                                description={
                                  product.description as string | undefined
                                }
                                stock={product.stock as number | undefined}
                                sku={product.sku as string | undefined}
                                tags={product.tags as string | undefined}
                                index={index}
                              />
                            </Link>
                          </motion.div>
                        ),
                      )}
                    </motion.div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-10">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={filters.page <= 1}
                          onClick={() =>
                            setFilters((p) => ({
                              ...p,
                              page: Math.max(1, p.page - 1),
                            }))
                          }
                          className="h-9 rounded-lg border-ecommerce-border gap-1.5 text-sm disabled:opacity-40"
                        >
                          <ChevronLeft size={15} />
                          {t('shopPage.previousPage')}
                        </Button>

                        {/* Page Numbers */}
                        <div className="hidden sm:flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(totalPages, 7) },
                            (_, i) => {
                              let pageNum: number;
                              if (totalPages <= 7) {
                                pageNum = i + 1;
                              } else if (filters.page <= 4) {
                                pageNum = i + 1;
                              } else if (filters.page >= totalPages - 3) {
                                pageNum = totalPages - 6 + i;
                              } else {
                                pageNum = filters.page - 3 + i;
                              }
                              return (
                                <Button
                                  key={pageNum}
                                  variant={
                                    filters.page === pageNum
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size="sm"
                                  onClick={() =>
                                    setFilters((p) => ({ ...p, page: pageNum }))
                                  }
                                  className={
                                    filters.page === pageNum
                                      ? 'h-9 w-9 p-0 rounded-lg bg-ecommerce-red hover:bg-ecommerce-red/90 text-white'
                                      : 'h-9 w-9 p-0 rounded-lg border-ecommerce-border text-sm'
                                  }
                                >
                                  {pageNum}
                                </Button>
                              );
                            },
                          )}
                        </div>

                        {/* Mobile page indicator */}
                        <span className="sm:hidden text-xs text-ecommerce-text-muted px-2">
                          {filters.page} / {totalPages}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={filters.page >= totalPages}
                          onClick={() =>
                            setFilters((p) => ({
                              ...p,
                              page: Math.min(totalPages, p.page + 1),
                            }))
                          }
                          className="h-9 rounded-lg border-ecommerce-border gap-1.5 text-sm disabled:opacity-40"
                        >
                          {t('shopPage.nextPage')}
                          <ChevronRight size={15} />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />

        {/* Mobile Filter Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent
            side="left"
            className="w-[85vw] max-w-sm p-0 bg-background overflow-y-auto"
          >
            <SheetHeader className="px-5 pt-5 pb-3 sticky top-0 bg-background z-10 border-b border-ecommerce-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-base font-bold text-ecommerce-text-primary">
                    {t('shopPage.filterBy')}
                  </SheetTitle>
                  {activeFilterCount > 0 && (
                    <Badge className="bg-ecommerce-red text-white rounded-full px-2 text-[10px]">
                      {activeFilterCount}
                    </Badge>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-ecommerce-red font-medium hover:underline"
                  >
                    {t('shopPage.clearAll')}
                  </button>
                )}
              </div>
              <SheetDescription className="sr-only">
                {t('shopPage.filterBy')}
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 py-4">{filterSidebarContent}</div>
          </SheetContent>
        </Sheet>

        {/* Global Components */}
        <CartDrawer />
        <QuickViewModal />
        <BackToTop />
        <MobileBottomNav />
        <FlyToCart />
        <CompareBar />
        <CompareDrawer open={isCompareOpen} onClose={() => setCompareOpen(false)} />
      </div>
    </I18nProvider>
  );
}

export default function ProductsPage() {
  return (
    <I18nProvider>
      <ProductsPageContent />
    </I18nProvider>
  );
}