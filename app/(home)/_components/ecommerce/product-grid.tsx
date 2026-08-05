'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ProductCard } from './product-card';
import { useUIStore } from '../../_lib/store';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Slider } from '../ui/slider';
import { SlidersHorizontal, Grid3X3, LayoutList, X, Filter, ArrowDown, PackageSearch, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import HomePageService from '../../_services/HomePageService';
import ProductFilterModel from '../../_types/Product/ProductFilterModel';
import SortingType, { SortOption } from '@root/app/types/enums/SortingType';
import Link from 'next/link';
import ProductListCard from './product-list';
import CurrencyViewer, { GetCurrencySymbol } from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';
import { resolveLocale } from '@root/utils/resolver';
import { Locale } from '@root/locales/Language';


const SORT_MAP: Record<SortOption, SortingType> = {
  'newest': SortingType.SortNewest,
  'oldest': SortingType.SortOldest,
  'price-asc': SortingType.SortPriceAsc,
  'price-desc': SortingType.SortPriceDesc,
  'popular': SortingType.SortPopular,
  'rating': SortingType.SortRating,
  'name-asc': SortingType.SortNameAsc,
  'name-desc': SortingType.SortNameDesc,
};
export function ProductGrid() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const isRTL = resolveLocale(locale).direction === 'rtl';
  const { searchQuery, selectedCategory, sortBy, setSortBy, setSelectedCategory } = useUIStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  // ── Sort options ────────────────────────────────────
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: t('homepage.shopPage.sortNewest') },
    { value: 'oldest', label: t('homepage.shopPage.sortOldest') },
    { value: 'price-asc', label: t('homepage.shopPage.sortPriceAsc') },
    { value: 'price-desc', label: t('homepage.shopPage.sortPriceDesc') },
    { value: 'popular', label: t('homepage.shopPage.sortPopular') },
    { value: 'rating', label: t('homepage.shopPage.sortRating') },
    { value: 'name-asc', label: t('homepage.shopPage.sortNameAsc') },
    { value: 'name-desc', label: t('homepage.shopPage.sortNameDesc') },
  ];

  const { data: categories = [] } = useQuery({
    queryKey: ['featured-categories'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getAllFeaturedCategories();
      return result.succeeded ? result.data ?? [] : [];
    },
  });

  const selectedCategoryId = useMemo(() => {
    if (!selectedCategory) return null;
    const cat = categories.find((c) => c.key === selectedCategory);
    return cat?.id ?? null;
  }, [selectedCategory, categories]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999]);
  const [sliderValue, setSliderValue] = useState<[number, number]>([0, 9999]);

  const filter = useMemo((): Omit<ProductFilterModel, 'pageIndex'> => ({
    pageSize: CONFIG.PRODUCTS_PER_PAGE,
    searchInput: searchQuery,
    categoryIds: selectedCategoryId ? [selectedCategoryId] : undefined,
    sorting: SORT_MAP[sortBy] ?? SortingType.SortNewest,
    fromSellUnitPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    toSellUnitPrice: priceRange[1] < sliderValue[1] ? priceRange[1] : undefined,
  }), [searchQuery, selectedCategoryId, sortBy, priceRange]);


  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['productsFeatured', filter],
    queryFn: async ({ pageParam }) => {
      const service = new HomePageService();
      const result = await service.getFeaturedProductsByFilter({ ...filter, pageIndex: pageParam } as ProductFilterModel);
      if (!result.succeeded) throw new Error(result.message ?? 'Failed to load products');
      return result.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const currentPage = lastPage.pageIndex ?? 1;
      const totalPages = lastPage.totalPages ?? 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  const products = data?.pages.flatMap((page) => page?.items ?? []) ?? [];
  const total = data?.pages[0]?.totalItems ?? 0;
  const maxRange = data?.pages[0]?.maxRange ?? 0;


  const handleClearPrice = useCallback(() => {
    setPriceRange([0, maxRange]);
    setSliderValue([0, maxRange]);
  }, [maxRange]);

  const handleCategoryClick = useCallback((slug: string | null) => {
    setSelectedCategory(slug);
  }, [setSelectedCategory]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (priceRange[0] > 0 || priceRange[1] < 9999) count++;
    if (searchQuery) count++;
    if (sortBy && sortBy !== 'newest') count++;
    return count;
  }, [selectedCategory, priceRange, searchQuery, sortBy]);

  const handleClearAll = useCallback(() => {
    setSelectedCategory(null);
    setSortBy('newest');
    useUIStore.getState().setSearchQuery('');
    setPriceRange([0, maxRange]);
    setSliderValue([0, maxRange]);
  }, [setSelectedCategory, setSortBy]);

  return (
    <section id="products" className="py-12 sm:py-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 grid-bg-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -end-32 w-64 h-64 bg-ecommerce-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -start-32 w-64 h-64 bg-ecommerce-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ecommerce-purple/10 text-ecommerce-purple text-xs font-semibold uppercase tracking-widest mb-3">
              <Grid3X3 size={12} />
              {t('homepage.featuredProducts.handpicked')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ecommerce-text-primary tracking-tight">
              {t('homepage.featuredProducts.title')}
            </h2>
            <p className="text-sm text-ecommerce-text-muted mt-1">{t('homepage.featuredProducts.subtitle')}</p>
            {/* Decorative dot divider */}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-px w-8 bg-ecommerce-border" />
              <div className="h-1.5 w-1.5 rounded-full bg-ecommerce-purple" />
              <div className="h-px w-8 bg-ecommerce-border" />
            </div>
          </div>
          <Link
            href={"/products"}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none 
            disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring 
            focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 px-4 py-2 has-[>svg]:px-3 shrink-0 rounded-xl border-ecommerce-purple text-ecommerce-purple hover:bg-ecommerce-purple/5 gap-2 h-10"
          >
            <SlidersHorizontal size={16} />
            {t('homepage.catalog.openCatalog')}
           {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />} 
          </Link>
        </div>

        {/* Active Filter Chips */}
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex items-center gap-2 flex-wrap">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ecommerce-red/10 text-ecommerce-red text-xs font-medium">
                    {t('homepage.common.category')}: {categories.find((c) => c.key === selectedCategory)?.name || selectedCategory}
                    <button onClick={() => setSelectedCategory(null)} className="hover:bg-ecommerce-red/20 rounded-full p-0.5 transition-colors"><X size={12} /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ecommerce-red/10 text-ecommerce-red text-xs font-medium">
                    {t('homepage.common.searchPlaceholder').replace('...', '').replace('...', '')}: &quot;{searchQuery}&quot;
                    <button onClick={() => useUIStore.getState().setSearchQuery('')} className="hover:bg-ecommerce-red/20 rounded-full p-0.5 transition-colors"><X size={12} /></button>
                  </span>
                )}
                {sortBy && sortBy !== 'newest' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ecommerce-red/10 text-ecommerce-red text-xs font-medium">
                    {t('homepage.common.sortBy')}: {sortOptions.find(x => x.value == sortBy)?.label}
                    <button onClick={() => setSortBy('newest')} className="hover:bg-ecommerce-red/20 rounded-full p-0.5 transition-colors"><X size={12} /></button>
                  </span>
                )}
                {(priceRange[0] > 0 || priceRange[1] < maxRange) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ecommerce-red/10 text-ecommerce-red text-xs font-medium">
                    {t('homepage.common.priceRange')}: {CurrencyViewer(priceRange[0], CONFIG.DEFAULT_CURRENCY)} –
                    {priceRange[1] < maxRange ? CurrencyViewer(priceRange[1], CONFIG.DEFAULT_CURRENCY) : CurrencyViewer(maxRange, CONFIG.DEFAULT_CURRENCY)}
                    <button onClick={handleClearPrice} className="hover:bg-ecommerce-red/20 rounded-full p-0.5 transition-colors"><X size={12} /></button>
                  </span>
                )}
                <button
                  onClick={handleClearAll}
                  className="text-xs text-ecommerce-red hover:underline font-medium ms-1"
                >
                  {t('homepage.common.clearAll')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolbar: Controls Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-ecommerce-text-muted">
            <span>{t('homepage.common.showing')} <strong className="text-ecommerce-text-primary">{products.length}</strong> {products.length !== 1 ? t('homepage.common.products') : t('homepage.common.product')}</span>
            {hasNextPage && <span>{t('homepage.common.of')} {total}</span>}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Filter toggle (mobile) */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
              className="md:hidden h-9 rounded-xl border-ecommerce-border gap-2 relative"
            >
              <Filter size={14} />
              {t('homepage.common.activeFilters').split('homepage. ').pop()}
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-ecommerce-red text-white text-[9px] font-bold flex items-center justify-center absolute -top-1 -end-1">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="h-9 rounded-xl text-sm bg-white dark:bg-ecommerce-surface border-ecommerce-border">
                <SlidersHorizontal size={14} className="me-2 text-ecommerce-text-muted" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-sm">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="hidden sm:flex items-center border border-ecommerce-border rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-all duration-200 ${viewMode === 'grid' ? 'bg-ecommerce-red text-white shadow-sm' : 'text-ecommerce-text-muted hover:bg-ecommerce-surface-hover'}`}
                aria-label={t('homepage.common.grid')}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-all duration-200 ${viewMode === 'list' ? 'bg-ecommerce-red text-white shadow-sm' : 'text-ecommerce-text-muted hover:bg-ecommerce-surface-hover'}`}
                aria-label={t('homepage.common.list')}
              >
                <LayoutList size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Chips - Horizontal Scroll */}
        <div className="mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border whitespace-nowrap ${!selectedCategory
                ? 'bg-ecommerce-red text-white border-ecommerce-red shadow-sm shadow-ecommerce-red/20'
                : 'bg-white dark:bg-ecommerce-surface text-ecommerce-text-secondary border-ecommerce-border hover:border-ecommerce-red/40 hover:text-ecommerce-red'
                }`}
            >
              {t('homepage.common.allCategories')}
            </button>
            {categories.map((cat) => (
              <button
                key={"cat-" + cat.id}
                onClick={() => handleCategoryClick(cat.key)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border whitespace-nowrap flex items-center gap-2 ${selectedCategory === cat.key
                  ? 'bg-ecommerce-red text-white border-ecommerce-red shadow-sm shadow-ecommerce-red/20'
                  : 'bg-white dark:bg-ecommerce-surface text-ecommerce-text-secondary border-ecommerce-border hover:border-ecommerce-red/40 hover:text-ecommerce-red'
                  }`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                {cat.name}
                <span className={`text-[10px] ${selectedCategory === cat.key ? 'text-white/70' : 'text-ecommerce-text-muted'}`}>
                  {cat.productsCount || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter Row (desktop always visible, mobile toggle) */}
        <div className={`mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="p-3 rounded-xl bg-ecommerce-surface-hover/60 dark:bg-[#252836]/60 border border-ecommerce-border/60 space-y-3">
            <div style={{ maxWidth: "450px" }} className="p-3 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ecommerce-text-muted uppercase tracking-wider">{t('homepage.common.priceRange')}</span>
                {(priceRange[0] > 0 || priceRange[1] < maxRange) && (
                  <button
                    onClick={handleClearPrice}
                    className="text-xs text-ecommerce-text-muted hover:text-ecommerce-red transition-colors flex items-center gap-1"
                  >
                    <X size={12} />
                    {t('homepage.common.clear')}
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ecommerce-text-primary font-medium">{CurrencyViewer(sliderValue[0], CONFIG.DEFAULT_CURRENCY)}</span>
                <span className="text-ecommerce-text-primary font-medium">{CurrencyViewer(Math.min(sliderValue[1], maxRange), CONFIG.DEFAULT_CURRENCY)}</span>
              </div>
              <Slider
                value={sliderValue}
                onValueChange={(value) => setSliderValue(value as [number, number])}
                onValueCommit={([min, max]) => setPriceRange([min, max])}
                min={0}
                max={maxRange}
                step={1}
                className="w-full"
              />
              <div className="flex items-center gap-2 ">
                <div className="relative flex-1 max-w-[120px]">
                  <span className="absolute start-2.5 top-1/2 -translate-y-1/2 text-xs text-ecommerce-text-muted">{GetCurrencySymbol(CONFIG.DEFAULT_CURRENCY)}</span>
                  <input
                    type="number"
                    value={priceRange[0] > 0 ? priceRange[0] : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = val === '' ? 0 : Math.max(0, Number(val) || 0);
                      setSliderValue([num, sliderValue[1]]);
                      setPriceRange([num, priceRange[1]]);
                    }}
                    placeholder="0"
                    className="w-full h-8 ps-6 pe-2 text-xs rounded-lg bg-white dark:bg-ecommerce-surface border border-ecommerce-border focus:outline-none focus:ring-1 focus:ring-ecommerce-red/30 focus:border-ecommerce-red/50 text-ecommerce-text-primary transition-all"
                    min="0"
                    max={maxRange - 1}
                  />
                </div>
                <span className="text-ecommerce-text-muted text-xs">—</span>
                <div className="relative flex-1 max-w-[120px]">
                  <span className="absolute start-2.5 top-1/2 -translate-y-1/2 text-xs text-ecommerce-text-muted">{GetCurrencySymbol(CONFIG.DEFAULT_CURRENCY)}</span>
                  <input
                    type="number"
                    value={priceRange[1] < maxRange ? priceRange[1] : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = val === '' ? maxRange : Math.min(maxRange, Number(val) || maxRange);
                      setSliderValue([sliderValue[0], num]);
                      setPriceRange([priceRange[0], num]);
                    }}
                    placeholder={maxRange.toString()}
                    className="w-full h-8 ps-6 pe-2 text-xs rounded-lg bg-white dark:bg-ecommerce-surface border border-ecommerce-border focus:outline-none focus:ring-1 focus:ring-ecommerce-red/30 focus:border-ecommerce-red/50 text-ecommerce-text-primary transition-all"
                    min="0"
                    max={maxRange}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'
            : 'flex flex-col gap-4'
          }>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={"skeleton-" + i} className={`rounded-2xl border border-ecommerce-border overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
                <Skeleton className={viewMode === 'list' ? 'w-40 h-40 sm:w-48 sm:h-48 shrink-0' : 'aspect-square'} />
                <div className="p-4 space-y-3 flex-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-24" />
                  <div className="flex justify-between pt-3 border-t border-ecommerce-border">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-8 w-16 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-ecommerce-red/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-ecommerce-text-primary">{t('homepage.common.noProductsFound')}</h3>
            <p className="text-sm text-ecommerce-text-muted mt-1">{t('homepage.common.pleaseTryAgain')}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 rounded-xl">
              {t('homepage.common.retry')}
            </Button>
          </div>
        )}

        {/* Products Grid/List */}
        {!isLoading && !isError && products.length > 0 && (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
                : 'grid grid-cols-2 xl:grid-cols-2 gap-4'
            }>
              {products.map((product, index) => (
                viewMode === 'list' ? (
                  <ProductListCard
                    key={"product-" + product.id}
                    product={product}
                    index={index}
                  />
                ) : (
                  <ProductCard
                    key={"product-" + product.id}
                    product={product}
                    index={index}
                  />
                )
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex flex-col items-center mt-10 gap-3">
                <p className="text-xs text-ecommerce-text-muted">
                  {t('homepage.common.showing')} {products.length} {t('homepage.common.of')} {total} {t('homepage.common.products')}
                </p>
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="outline"
                  className="h-11 px-8 rounded-xl border-ecommerce-border text-ecommerce-text-secondary hover:border-ecommerce-red hover:text-ecommerce-red font-medium gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {isFetchingNextPage ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ArrowDown size={16} />
                  )}
                  {isFetchingNextPage
                    ? t('homepage.common.loading')
                    : `${t('homepage.common.loadMore')} (${total - products.length} ${t('homepage.common.remaining')})`
                  }
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !isError && products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-ecommerce-surface-hover dark:bg-ecommerce-surface flex items-center justify-center mx-auto mb-5">
              <PackageSearch size={32} className="text-ecommerce-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-ecommerce-text-primary">{t('homepage.common.noProductsFound')}</h3>
            <p className="text-sm text-ecommerce-text-muted mt-2 max-w-sm mx-auto">
              {searchQuery
                ? t('homepage.common.noProductsDesc', { query: searchQuery })
                : t('homepage.common.noProductsFilterDesc')}
            </p>
            {(selectedCategory || priceRange[0] > 0 || priceRange[1] < 9999 || searchQuery || (sortBy && sortBy !== 'newest')) && (
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="mt-5 rounded-xl border-ecommerce-border hover:border-ecommerce-red hover:text-ecommerce-red gap-2 transition-colors"
              >
                <X size={14} />
                {t('homepage.common.clearAll')}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
