'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/ecommerce/product-card';
import { useFilterParams, type ProductFilters } from '@/hooks/use-filter-params';
import { useUIStore, useWishlistStore, useCompareStore } from '@/lib/store';
import { useFlyToCart } from '@/hooks/use-fly-to-cart';
import { useCategoryTranslations } from '@/lib/category-translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  SlidersHorizontal, Grid3X3, LayoutList, X, Filter, Star,
  ChevronRight, ChevronDown, ChevronUp, Home, Copy, Check,
  PackageSearch, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useLocaleStore, RTL_LOCALES } from '@/lib/store';

// ─── Filterable Product List (resets on key change) ────────────
function ProductList({
  products,
  viewMode,
  catTrans,
}: {
  products: Array<Record<string, unknown>>;
  viewMode: 'grid' | 'list';
  catTrans: Record<string, string>;
}) {
  const t = useTranslations();
  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const ListCard = ({ product }: { product: Record<string, unknown> }) => {
    const id = product.id as string;
    const name = product.name as string;
    const price = product.price as number;
    const comparePrice = product.comparePrice as number | null;
    const image = product.image as string;
    const rating = product.rating as number;
    const reviewCount = product.reviewCount as number;
    const category = product.category as { name: string; color: string };
    const stock = product.stock as number;
    const description = product.description as string;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-ecommerce-surface border border-ecommerce-border hover:shadow-lg hover:shadow-ecommerce-black/5 transition-all group"
      >
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden shrink-0 bg-muted">
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-[10px] px-2 py-0 rounded-full" style={{ backgroundColor: `${category?.color}15`, color: category?.color }}>
                {catTrans[category?.name] || category?.name}
              </Badge>
              {stock <= 3 && stock > 0 && (
                <Badge variant="secondary" className="text-[10px] px-2 py-0 rounded-full bg-ecommerce-amber/15 text-ecommerce-amber">
                  {t('common.onlyLeft', { count: stock })}
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-bold text-ecommerce-text-primary line-clamp-1 mb-1">{name}</h3>
            <p className="text-xs text-ecommerce-text-muted line-clamp-2 leading-relaxed">{description}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-ecommerce-text-primary">${price.toFixed(2)}</span>
              {comparePrice && comparePrice > price && (
                <>
                  <span className="text-xs text-ecommerce-text-muted line-through">${comparePrice.toFixed(2)}</span>
                  <Badge className="bg-ecommerce-emerald/15 text-ecommerce-emerald text-[10px] px-1.5 py-0 rounded-full border-0 font-bold">
                    -{Math.round(((comparePrice - price) / comparePrice) * 100)}%
                  </Badge>
                </>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <Star size={12} className="fill-ecommerce-amber text-ecommerce-amber" />
              <span className="text-xs font-medium text-ecommerce-text-secondary">{rating}</span>
              <span className="text-[10px] text-ecommerce-text-muted">({reviewCount})</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (products.length === 0) return null;

  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product: Record<string, unknown>, i: number) => (
              <ProductCard
                key={product.id as string}
                id={product.id as string}
                name={product.name as string}
                price={product.price as number}
                comparePrice={(product.comparePrice as number) || undefined}
                image={product.image as string}
                rating={product.rating as number}
                reviewCount={product.reviewCount as number}
                category={product.category as { name: string; color: string }}
                shortDesc={(product.shortDesc as string) || undefined}
                description={product.description as string}
                tags={(product.tags as string) || undefined}
                stock={product.stock as number}
                sku={(product.sku as string) || undefined}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product: Record<string, unknown>) => (
              <ListCard key={product.id as string} product={product} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => setVisibleCount(prev => Math.min(prev + PAGE_SIZE, products.length))}
            variant="outline"
            className="rounded-xl px-8 h-10 gap-2 border-ecommerce-purple text-ecommerce-purple hover:bg-ecommerce-purple/5"
          >
            {t('common.loadMore')}
            <span className="text-xs text-ecommerce-text-muted">
              ({products.length - visibleCount} {t('common.remaining')})
            </span>
          </Button>
        </div>
      )}

      <p className="text-center text-xs text-ecommerce-text-muted mt-6">
        {t('productsPage.showing')} {visibleProducts.length} {t('productsPage.of')} {products.length}
      </p>
    </>
  );
}

// ─── Filter Sidebar Section ────────────────────────────────────────
function FilterSection({
  title, children, defaultOpen = true,
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ecommerce-border pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-ecommerce-text-primary mb-3 hover:text-ecommerce-red transition-colors"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StarRatingFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {[4, 3, 2, 1].map((r) => (
        <button
          key={r}
          onClick={() => onChange(value === String(r) ? '' : String(r))}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
            value === String(r)
              ? 'border-ecommerce-amber bg-ecommerce-amber/10 text-ecommerce-amber'
              : 'border-ecommerce-border text-ecommerce-text-secondary hover:border-ecommerce-amber/50'
          }`}
        >
          <Star size={12} className="fill-current" />
          {r}+
        </button>
      ))}
    </div>
  );
}

// ─── Main Products Page ───────────────────────────────────────────
export function ProductsPage() {
  const t = useTranslations();
  const catTrans = useCategoryTranslations();
  const { locale } = useLocaleStore();
  const isRTL = RTL_LOCALES.includes(locale);
  const { goHome } = useUIStore();

  const {
    filters, setFilter, setFilters, resetFilters,
    buildApiUrl, activeFilterCount, filterEntries,
    getProductsPageUrl,
  } = useFilterParams();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [localPriceMin, setLocalPriceMin] = useState(filters.minPrice);
  const [localPriceMax, setLocalPriceMax] = useState(filters.maxPrice);

  const apiUrl = buildApiUrl();

  const { data, isLoading } = useQuery({
    queryKey: ['products-page', apiUrl],
    queryFn: () => fetch(apiUrl).then(r => r.json()),
    staleTime: 30_000,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetch('/api/categories').then(r => r.json()),
  });

  const products: Array<Record<string, unknown>> = data?.products || [];
  const total: number = data?.total || 0;

  const SORT_OPTIONS = [
    { value: 'newest', label: t('productsPage.newest') },
    { value: 'oldest', label: t('productsPage.oldest') },
    { value: 'price-asc', label: t('productsPage.priceAsc') },
    { value: 'price-desc', label: t('productsPage.priceDesc') },
    { value: 'popular', label: t('productsPage.popular') },
    { value: 'rating', label: t('productsPage.topRated') },
    { value: 'name-asc', label: t('productsPage.nameAsc') },
    { value: 'name-desc', label: t('productsPage.nameDesc') },
  ];

  const getCategoryLabel = useCallback((slug: string) => {
    const cat = categories.find((c: { slug: string; name: string }) => c.slug === slug);
    if (cat) return catTrans[cat.name] || cat.name;
    return slug;
  }, [categories, catTrans]);

  const getFilterLabel = useCallback((key: keyof ProductFilters, value: string): string => {
    switch (key) {
      case 'category': return getCategoryLabel(value);
      case 'sort': return SORT_OPTIONS.find(o => o.value === value)?.label || value;
      case 'hasDiscount': return value === 'true' ? t('productsPage.withDiscount') : t('productsPage.withoutDiscount');
      case 'inStock': return value === 'true' ? t('productsPage.inStock') : t('productsPage.outOfStock');
      case 'rating': return `${value}★`;
      case 'minPrice': return `≥ $${value}`;
      case 'maxPrice': return `≤ $${value}`;
      case 'dateFrom': return `${t('productsPage.from')} ${value}`;
      case 'dateTo': return `${t('productsPage.to')} ${value}`;
      case 'search': return `"${value}"`;
      default: return value;
    }
  }, [getCategoryLabel, SORT_OPTIONS, t]);

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setUrlCopied(true);
      toast.success(t('productsPage.urlCopied'));
      setTimeout(() => setUrlCopied(false), 2000);
    });
  }, [t]);

  const handleRemoveFilter = useCallback((key: keyof ProductFilters) => {
    setFilter(key, key === 'sort' ? 'newest' : '');
  }, [setFilter]);

  const handleResetFilters = useCallback(() => {
    resetFilters();
    setLocalPriceMin('');
    setLocalPriceMax('');
  }, [resetFilters]);

  // ─── Filter Sidebar (shared between desktop and mobile) ─────
  const filterSidebar = (
    <div className="space-y-0">
      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted" />
        <Input
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          placeholder={t('common.searchPlaceholder')}
          className="h-10 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border ps-9 text-sm"
        />
        {filters.search && (
          <button onClick={() => setFilter('search', '')} className="absolute end-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted hover:text-ecommerce-red">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title={t('productsPage.category')}>
        <RadioGroup value={filters.category} onValueChange={(v) => setFilter('category', v === '__all__' ? '' : v)} className="space-y-2">
          <label className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors hover:bg-ecommerce-surface-hover ${!filters.category ? 'bg-ecommerce-purple/5' : ''}`}>
            <RadioGroupItem value="__all__" className="data-[state=checked]:border-ecommerce-purple data-[state=checked]:text-ecommerce-purple" />
            <span className="text-sm text-ecommerce-text-primary font-medium">{t('productsPage.allCategories')}</span>
            <span className="ms-auto text-xs text-ecommerce-text-muted">{total}</span>
          </label>
          {categories.map((cat: { id: string; name: string; slug: string; _count?: { products: number } }) => (
            <label key={cat.id} className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors hover:bg-ecommerce-surface-hover ${filters.category === cat.slug ? 'bg-ecommerce-purple/5' : ''}`}>
              <RadioGroupItem value={cat.slug} className="data-[state=checked]:border-ecommerce-purple data-[state=checked]:text-ecommerce-purple" />
              <span className="text-sm text-ecommerce-text-primary">{catTrans[cat.name] || cat.name}</span>
              <span className="ms-auto text-xs text-ecommerce-text-muted">{cat._count?.products || 0}</span>
            </label>
          ))}
        </RadioGroup>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title={t('productsPage.priceRange')}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[11px] text-ecommerce-text-muted mb-1 block">{t('productsPage.priceMin')}</Label>
              <Input type="number" min="0" value={localPriceMin} onChange={(e) => setLocalPriceMin(e.target.value)} placeholder="$0" className="h-9 rounded-lg bg-ecommerce-surface-hover border-ecommerce-border text-sm" />
            </div>
            <div>
              <Label className="text-[11px] text-ecommerce-text-muted mb-1 block">{t('productsPage.priceMax')}</Label>
              <Input type="number" min="0" value={localPriceMax} onChange={(e) => setLocalPriceMax(e.target.value)} placeholder="$9999" className="h-9 rounded-lg bg-ecommerce-surface-hover border-ecommerce-border text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setFilters({ minPrice: localPriceMin, maxPrice: localPriceMax })} className="flex-1 h-8 bg-ecommerce-purple hover:bg-ecommerce-purple/90 text-white rounded-lg text-xs">
              {t('productsPage.applyPrice')}
            </Button>
            {(filters.minPrice || filters.maxPrice) && (
              <Button size="sm" variant="ghost" onClick={() => { setLocalPriceMin(''); setLocalPriceMax(''); setFilters({ minPrice: '', maxPrice: '' }); }} className="h-8 text-xs text-ecommerce-text-muted">
                {t('common.clear')}
              </Button>
            )}
          </div>
        </div>
      </FilterSection>

      {/* Discount */}
      <FilterSection title={t('productsPage.discount')}>
        <RadioGroup value={filters.hasDiscount} onValueChange={(v) => setFilter('hasDiscount', v === '__all__' ? '' : v)} className="space-y-2">
          <label className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-ecommerce-surface-hover transition-colors">
            <RadioGroupItem value="__all__" className="data-[state=checked]:border-ecommerce-purple data-[state=checked]:text-ecommerce-purple" />
            <span className="text-sm text-ecommerce-text-primary">{t('common.all')}</span>
          </label>
          <label className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-ecommerce-surface-hover transition-colors">
            <RadioGroupItem value="true" className="data-[state=checked]:border-ecommerce-purple data-[state=checked]:text-ecommerce-purple" />
            <span className="text-sm text-ecommerce-text-primary">{t('productsPage.withDiscount')}</span>
            <span className="ms-auto text-xs text-ecommerce-emerald font-medium">%</span>
          </label>
          <label className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-ecommerce-surface-hover transition-colors">
            <RadioGroupItem value="false" className="data-[state=checked]:border-ecommerce-purple data-[state=checked]:text-ecommerce-purple" />
            <span className="text-sm text-ecommerce-text-primary">{t('productsPage.withoutDiscount')}</span>
          </label>
        </RadioGroup>
      </FilterSection>

      {/* Availability */}
      <FilterSection title={t('productsPage.availability')}>
        <RadioGroup value={filters.inStock} onValueChange={(v) => setFilter('inStock', v === '__all__' ? '' : v)} className="space-y-2">
          <label className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-ecommerce-surface-hover transition-colors">
            <RadioGroupItem value="__all__" className="data-[state=checked]:border-ecommerce-purple data-[state=checked]:text-ecommerce-purple" />
            <span className="text-sm text-ecommerce-text-primary">{t('common.all')}</span>
          </label>
          <label className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-ecommerce-surface-hover transition-colors">
            <RadioGroupItem value="true" className="data-[state=checked]:border-ecommerce-purple data-[state=checked]:text-ecommerce-purple" />
            <span className="text-sm text-ecommerce-text-primary">{t('productsPage.inStock')}</span>
          </label>
          <label className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-ecommerce-surface-hover transition-colors">
            <RadioGroupItem value="false" className="data-[state=checked]:border-ecommerce-purple data-[state=checked]:text-ecommerce-purple" />
            <span className="text-sm text-ecommerce-text-primary">{t('productsPage.outOfStock')}</span>
          </label>
        </RadioGroup>
      </FilterSection>

      {/* Date Added */}
      <FilterSection title={t('productsPage.dateAdded')} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[11px] text-ecommerce-text-muted mb-1 block">{t('productsPage.from')}</Label>
            <Input type="date" value={filters.dateFrom} onChange={(e) => setFilter('dateFrom', e.target.value)} className="h-9 rounded-lg bg-ecommerce-surface-hover border-ecommerce-border text-sm" />
          </div>
          <div>
            <Label className="text-[11px] text-ecommerce-text-muted mb-1 block">{t('productsPage.to')}</Label>
            <Input type="date" value={filters.dateTo} onChange={(e) => setFilter('dateTo', e.target.value)} className="h-9 rounded-lg bg-ecommerce-surface-hover border-ecommerce-border text-sm" />
          </div>
        </div>
        {(filters.dateFrom || filters.dateTo) && (
          <Button size="sm" variant="ghost" onClick={() => setFilters({ dateFrom: '', dateTo: '' })} className="mt-2 h-7 text-xs text-ecommerce-text-muted">
            {t('common.clear')}
          </Button>
        )}
      </FilterSection>

      {/* Rating */}
      <FilterSection title={t('productsPage.minRating')} defaultOpen={false}>
        <StarRatingFilter value={filters.rating} onChange={(v) => setFilter('rating', v)} />
      </FilterSection>

      {/* Clear all */}
      {activeFilterCount > 0 && (
        <Button variant="ghost" onClick={handleResetFilters} className="w-full mt-2 text-ecommerce-red hover:text-ecommerce-red/80 hover:bg-ecommerce-red/5 text-sm gap-1.5">
          <X size={14} />
          {t('productsPage.clearAll')} ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ecommerce-text-muted mb-6">
        <button onClick={goHome} className="hover:text-ecommerce-text-primary transition-colors flex items-center gap-1">
          <Home size={14} />
          {t('productsPage.home')}
        </button>
        <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
        <span className="text-ecommerce-text-primary font-medium">{t('productsPage.title')}</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ecommerce-text-primary tracking-tight">
            {t('productsPage.title')}
          </h1>
          <p className="text-sm text-ecommerce-text-muted mt-1">
            {isLoading ? '...' : t('productsPage.resultsCount', { count: total })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyUrl} className="h-9 rounded-xl gap-1.5 text-xs border-ecommerce-border">
            {urlCopied ? <Check size={14} className="text-ecommerce-emerald" /> : <Copy size={14} />}
            {urlCopied ? t('productsPage.urlCopied') : t('productsPage.copyFilterUrl')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowMobileFilters(true)} className="lg:hidden h-9 rounded-xl gap-1.5 text-xs border-ecommerce-border">
            <SlidersHorizontal size={14} />
            {t('productsPage.filters')}
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-ecommerce-red text-white text-[10px] flex items-center justify-center font-bold">{activeFilterCount}</span>
            )}
          </Button>
        </div>
      </div>

      {/* Active filter chips */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-6 overflow-hidden">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-ecommerce-text-muted uppercase tracking-wider">{t('productsPage.activeFilters')}:</span>
              {filterEntries.map(([key, value]) => (
                <Badge key={key} variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ecommerce-purple/10 text-ecommerce-purple text-xs font-medium border-0 cursor-pointer hover:bg-ecommerce-purple/20 transition-colors" onClick={() => handleRemoveFilter(key)}>
                  {getFilterLabel(key, value)}
                  <X size={12} />
                </Badge>
              ))}
              <button onClick={handleResetFilters} className="text-xs text-ecommerce-red hover:text-ecommerce-red/80 font-medium ms-2">
                {t('common.clearAll')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-ecommerce-text-primary flex items-center gap-2">
                <Filter size={14} className="text-ecommerce-purple" />
                {t('productsPage.filterBy')}
              </h2>
              {activeFilterCount > 0 && <span className="w-5 h-5 rounded-full bg-ecommerce-red text-white text-[10px] flex items-center justify-center font-bold">{activeFilterCount}</span>}
            </div>
            {filterSidebar}
          </div>
        </aside>

        {/* Product listing */}
        <div className="flex-1 min-w-0">
          {/* Sort + View controls */}
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-ecommerce-text-muted whitespace-nowrap">{t('productsPage.sortBy')}:</span>
              <Select value={filters.sort} onValueChange={(v) => setFilter('sort', v)}>
                <SelectTrigger className="w-[180px] h-9 rounded-xl border-ecommerce-border text-xs bg-white dark:bg-ecommerce-surface">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1 bg-ecommerce-surface-hover rounded-lg p-0.5">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-ecommerce-surface shadow-sm text-ecommerce-text-primary' : 'text-ecommerce-text-muted hover:text-ecommerce-text-primary'}`}>
                <Grid3X3 size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-ecommerce-surface shadow-sm text-ecommerce-text-primary' : 'text-ecommerce-text-muted hover:text-ecommerce-text-primary'}`}>
                <LayoutList size={16} />
              </button>
            </div>
          </div>

          {/* Loading skeleton */}
          {isLoading && (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-4'}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={viewMode === 'grid' ? '' : 'flex gap-4 p-4 rounded-2xl border border-ecommerce-border'}>
                  <Skeleton className={viewMode === 'grid' ? 'aspect-square w-full rounded-2xl' : 'w-32 h-32 sm:w-40 sm:h-40 rounded-xl shrink-0'} />
                  <div className="flex-1 space-y-2 py-1">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-full rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                    <Skeleton className="h-5 w-24 rounded mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {!isLoading && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-ecommerce-surface-hover flex items-center justify-center mb-4">
                <PackageSearch size={36} className="text-ecommerce-text-muted" />
              </div>
              <h3 className="text-lg font-bold text-ecommerce-text-primary mb-1">{t('productsPage.noResults')}</h3>
              <p className="text-sm text-ecommerce-text-muted mb-6 max-w-sm">{t('productsPage.noResultsDesc')}</p>
              <Button onClick={handleResetFilters} className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl px-6 h-10 text-sm">
                {t('productsPage.clearAll')}
              </Button>
            </div>
          )}

          {/* Product list — key on apiUrl forces remount when filters change */}
          {!isLoading && products.length > 0 && (
            <ProductList key={apiUrl} products={products} viewMode={viewMode} catTrans={catTrans} />
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setShowMobileFilters(false)} />
            <motion.div
              initial={{ x: isRTL ? -300 : 300 }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? -300 : 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-80 max-w-[85vw] bg-white dark:bg-ecommerce-surface z-50 overflow-y-auto shadow-2xl lg:hidden`}
            >
              <div className="flex items-center justify-between p-4 border-b border-ecommerce-border sticky top-0 bg-white dark:bg-ecommerce-surface z-10">
                <h2 className="text-base font-bold text-ecommerce-text-primary flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-ecommerce-purple" />
                  {t('productsPage.sortAndFilter')}
                </h2>
                <button onClick={() => setShowMobileFilters(false)} className="w-8 h-8 rounded-lg bg-ecommerce-surface-hover flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <div className="p-4">{filterSidebar}</div>
              <div className="sticky bottom-0 p-4 bg-white dark:bg-ecommerce-surface border-t border-ecommerce-border">
                <Button onClick={() => setShowMobileFilters(false)} className="w-full h-11 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm">
                  {t('productsPage.showing')} {total} {t('common.products').toLowerCase()}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}