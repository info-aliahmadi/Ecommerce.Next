'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductCard } from './product-card';
import { useUIStore, useWishlistStore, useCompareStore } from '../../_lib/store';
import { useFlyToCart } from '../../_hooks/use-fly-to-cart';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { SlidersHorizontal, Grid3X3, LayoutList, X, Filter, Loader2, Star, ShoppingCart, Heart, Eye, GitCompareArrows, ArrowDown, PackageSearch, ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useState, useMemo, useCallback } from 'react';
import { Badge } from '../ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useCategoryTranslations } from '../../_lib/category-translations';
import HomePageService from '../../_services/HomePageService';

const PAGE_SIZE = 8;

export function ProductGrid() {
  const t = useTranslations();
  const catTrans = useCategoryTranslations();
  const { searchQuery, selectedCategory, sortBy, setSortBy, setSelectedCategory, setCatalogOpen } = useUIStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999]);
  const [showFilters, setShowFilters] = useState(false);
  const [tempPriceMin, setTempPriceMin] = useState('');
  const [tempPriceMax, setTempPriceMax] = useState('');

  const SORT_LABELS: Record<string, string> = {
    'newest': t('homepage.common.newest'),
    'price-asc': t('homepage.common.priceLowHigh'),
    'price-desc': t('homepage.common.priceHighLow'),
    'popular': t('homepage.common.popular'),
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', selectedCategory, searchQuery, sortBy],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('homepage.category', selectedCategory);
      if (searchQuery) params.set('homepage.search', searchQuery);
      if (sortBy) params.set('homepage.sort', sortBy);
      return fetch(`/api/products?${params}`).then(r => r.json());
    },
  });

  // Reset visible count when filters change
  const filterKey = `${selectedCategory}-${searchQuery}-${sortBy}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  const products = data?.products || [];
  const total = data?.total || 0;

  // Filter by price range
  const filteredProducts = useMemo(() => {
    return products.filter((p: { price: number }) => p.price >= priceRange[0] && p.price <= priceRange[1]);
  }, [products, priceRange]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getAllCategories();
      const items = result.succeeded ? result.data : [];
      return items;
    },
  });

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filteredProducts.length));
  };

  const handleApplyPrice = useCallback(() => {
    const min = tempPriceMin ? parseInt(tempPriceMin) : 0;
    const max = tempPriceMax ? parseInt(tempPriceMax) : 9999;
    setPriceRange([min, max]);
    setVisibleCount(PAGE_SIZE);
  }, [tempPriceMin, tempPriceMax]);

  const handleClearPrice = useCallback(() => {
    setPriceRange([0, 9999]);
    setTempPriceMin('');
    setTempPriceMax('');
    setVisibleCount(PAGE_SIZE);
  }, []);

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
    setPriceRange([0, 9999]);
    setTempPriceMin('');
    setTempPriceMax('');
    setVisibleCount(PAGE_SIZE);
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
          <Button
            onClick={() => setCatalogOpen(true)}
            variant="outline"
            className="shrink-0 rounded-xl border-ecommerce-purple text-ecommerce-purple hover:bg-ecommerce-purple/5 gap-2 h-10"
          >
            <SlidersHorizontal size={16} />
            {t('homepage.catalog.openCatalog')}
            <ArrowRight size={14} />
          </Button>
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
                    {t('homepage.common.category')}: {catTrans[categories.find((c) => c.key === selectedCategory)?.name || ''] || categories.find((c) => c.key === selectedCategory)?.name || selectedCategory}
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
                    {t('homepage.common.sortBy')}: {SORT_LABELS[sortBy] || sortBy}
                    <button onClick={() => setSortBy('newest')} className="hover:bg-ecommerce-red/20 rounded-full p-0.5 transition-colors"><X size={12} /></button>
                  </span>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 9999) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ecommerce-red/10 text-ecommerce-red text-xs font-medium">
                    {t('homepage.common.priceRange')}: ${priceRange[0]} – ${priceRange[1] < 9999 ? priceRange[1] : '∞'}
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
            <span>{t('homepage.common.showing')} <strong className="text-ecommerce-text-primary">{visibleProducts.length}</strong> {visibleProducts.length !== 1 ? t('homepage.common.products') : t('homepage.common.product')}</span>
            {hasMore && <span>{t('homepage.common.of')} {filteredProducts.length}</span>}
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
              <SelectTrigger className="w-[160px] h-9 rounded-xl text-sm bg-white dark:bg-ecommerce-surface border-ecommerce-border">
                <SlidersHorizontal size={14} className="me-2 text-ecommerce-text-muted" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('homepage.common.newest')}</SelectItem>
                <SelectItem value="popular">{t('homepage.common.popular')}</SelectItem>
                <SelectItem value="price-asc">{t('homepage.common.priceLowHigh')}</SelectItem>
                <SelectItem value="price-desc">{t('homepage.common.priceHighLow')}</SelectItem>
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
                {catTrans[cat.name] || cat.name}
                <span className={`text-[10px] ${selectedCategory === cat.key ? 'text-white/70' : 'text-ecommerce-text-muted'}`}>
                  {cat.productsCount || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter Row (desktop always visible, mobile toggle) */}
        <div className={`mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-ecommerce-surface-hover/60 dark:bg-[#252836]/60 border border-ecommerce-border/60">
            <span className="text-xs font-semibold text-ecommerce-text-muted uppercase tracking-wider shrink-0">{t('homepage.common.priceRange')}</span>
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-[120px]">
                <span className="absolute start-2.5 top-1/2 -translate-y-1/2 text-xs text-ecommerce-text-muted">$</span>
                <input
                  type="number"
                  placeholder={t('homepage.common.minPrice')}
                  value={tempPriceMin || (priceRange[0] > 0 ? String(priceRange[0]) : '')}
                  onChange={(e) => setTempPriceMin(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPrice()}
                  className="w-full h-8 ps-6 pe-2 text-xs rounded-lg bg-white dark:bg-ecommerce-surface border border-ecommerce-border focus:outline-none focus:ring-1 focus:ring-ecommerce-red/30 focus:border-ecommerce-red/50 text-ecommerce-text-primary transition-all"
                  min="0"
                />
              </div>
              <span className="text-ecommerce-text-muted text-xs">—</span>
              <div className="relative flex-1 max-w-[120px]">
                <span className="absolute start-2.5 top-1/2 -translate-y-1/2 text-xs text-ecommerce-text-muted">$</span>
                <input
                  type="number"
                  placeholder={t('homepage.common.maxPrice')}
                  value={tempPriceMax || (priceRange[1] < 9999 ? String(priceRange[1]) : '')}
                  onChange={(e) => setTempPriceMax(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPrice()}
                  className="w-full h-8 ps-6 pe-2 text-xs rounded-lg bg-white dark:bg-ecommerce-surface border border-ecommerce-border focus:outline-none focus:ring-1 focus:ring-ecommerce-red/30 focus:border-ecommerce-red/50 text-ecommerce-text-primary transition-all"
                  min="0"
                />
              </div>
              <button
                onClick={handleApplyPrice}
                className="h-8 px-3 text-xs font-medium rounded-lg bg-ecommerce-red text-white hover:bg-ecommerce-red/90 transition-colors"
              >
                {t('homepage.common.apply')}
              </button>
              {(priceRange[0] > 0 || priceRange[1] < 9999) && (
                <button
                  onClick={handleClearPrice}
                  className="h-8 px-2 text-xs text-ecommerce-text-muted hover:text-ecommerce-red transition-colors flex items-center gap-1"
                >
                  <X size={12} />
                  {t('homepage.common.clear')}
                </button>
              )}
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
        {!isLoading && !isError && filteredProducts.length > 0 && (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'
                : 'grid grid-cols-1 sm:grid-cols-2 gap-4'
            }>
              {visibleProducts.map((product: Record<string, unknown>, index: number) => (
                viewMode === 'list' ? (
                  <ProductListCard
                    key={"product-" + product.id}
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
                ) : (
                  <ProductCard
                    key={"product-" + product.id}
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
                )
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex flex-col items-center mt-10 gap-3">
                <p className="text-xs text-ecommerce-text-muted">
                  {t('homepage.common.showing')} {visibleProducts.length} {t('homepage.common.of')} {filteredProducts.length} {t('homepage.common.products')}
                </p>
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  className="h-11 px-8 rounded-xl border-ecommerce-border text-ecommerce-text-secondary hover:border-ecommerce-red hover:text-ecommerce-red font-medium gap-2 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <ArrowDown size={16} />
                  {t('homepage.common.loadMore')} ({filteredProducts.length - visibleProducts.length} {t('homepage.common.remaining')})
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredProducts.length === 0 && (
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

/* List View Product Card */

interface ProductListCardProps {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: { name: string; color: string };
  shortDesc?: string;
  description?: string;
  tags?: string;
  stock?: number;
  sku?: string;
  index?: number;
}

function ProductListCard({
  id, name, price, comparePrice, image, rating, reviewCount, category, shortDesc, description, tags, stock, sku, index = 0
}: ProductListCardProps) {
  const t = useTranslations();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { setQuickViewProduct } = useUIStore();
  const { addItem: addCompareItem, isInCompare } = useCompareStore();
  const { handleAddToCartWithAnimation } = useFlyToCart();

  const wishlisted = isInWishlist(id);
  const inCompare = isInCompare(id);
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
  const parsedTags: string[] = tags ? JSON.parse(tags) : [];

  const handleAddToCart = (e: React.MouseEvent) => {
    handleAddToCartWithAnimation(e, image, {
      id, name, price, comparePrice, image, category: category.name,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({ id, name, price, comparePrice, image, category: category.name });
    toast.success(wishlisted ? t('homepage.common.removeFromWishlist') : t('homepage.common.addToWishlist'));
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      addCompareItem({ id, name, price, comparePrice, image, rating, reviewCount, category, stock: stock || 0, description: description || '', sku });
      toast.success(t('homepage.compare.remove'));
    } else {
      if (useCompareStore.getState().items.length >= 4) {
        toast.warning(t('homepage.compare.maxWarning'));
        return;
      }
      addCompareItem({ id, name, price, comparePrice, image, rating, reviewCount, category, stock: stock || 0, description: description || '', sku });
      toast.success(t('homepage.common.compare'));
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct({
      id, name, price, comparePrice, image, rating, reviewCount, category,
      shortDesc, description: description || '', stock: stock || 0, sku, tags,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group relative bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border overflow-hidden card-lift"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-48 lg:w-56 aspect-square sm:aspect-auto shrink-0 overflow-hidden bg-ecommerce-surface-hover dark:bg-[#252836]">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {discount > 0 && (
            <Badge className="absolute top-2.5 start-2.5 bg-ecommerce-red text-white border-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              {t('homepage.common.off', { percent: discount })}
            </Badge>
          )}
          {parsedTags.includes('new') && (
            <Badge className="absolute top-2.5 start-2.5 bg-ecommerce-teal text-white border-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              {t('homepage.common.newBadge')}
            </Badge>
          )}
          {/* Stock indicator */}
          {stock !== undefined && (
            <div className="absolute bottom-2.5 start-2.5">
              {stock === 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/50 text-white">{t('homepage.common.outOfStock')}</span>
              ) : stock < 10 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-ecommerce-amber/90 text-white">{t('homepage.common.onlyLeft', { count: stock })}</span>
              ) : null}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-[11px] font-medium text-ecommerce-text-muted uppercase tracking-wider">{category.name}</span>
                {sku && <span className="text-[10px] text-ecommerce-text-muted ms-auto sm:ms-2">{t('homepage.common.sku')}: {sku}</span>}
              </div>
              <h3 className="font-semibold text-base text-ecommerce-text-primary line-clamp-1 group-hover:text-ecommerce-red transition-colors">{name}</h3>
              {shortDesc && <p className="text-xs text-ecommerce-text-muted mt-1 line-clamp-2">{shortDesc}</p>}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-3">
            <div className="flex items-center gap-px">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={"star-" + i} size={12} className={i < Math.floor(rating) ? 'fill-ecommerce-amber text-ecommerce-amber' : 'text-ecommerce-border'} />
              ))}
            </div>
            <span className="text-xs text-ecommerce-text-muted">{rating} ({reviewCount})</span>
          </div>

          {/* Tags */}
          {parsedTags.length > 0 && (
            <div className="flex gap-1.5 mt-3">
              {parsedTags.slice(0, 3).map(tag => (
                <span key={"tag-" + tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-ecommerce-surface-hover text-ecommerce-text-muted capitalize">{tag}</span>
              ))}
            </div>
          )}

          {/* Bottom: Price + Actions */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-ecommerce-border mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-ecommerce-text-primary">${price.toFixed(2)}</span>
              {comparePrice && comparePrice > price && (
                <span className="text-sm text-ecommerce-text-muted line-through">${comparePrice.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCompare}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${inCompare ? 'bg-ecommerce-teal/5 border-ecommerce-teal/30 text-ecommerce-teal' : 'border-ecommerce-border hover:bg-ecommerce-teal hover:text-white hover:border-ecommerce-teal'}`}
                aria-label={inCompare ? t('homepage.compare.remove') : t('homepage.common.compare')}
              >
                <GitCompareArrows size={14} />
              </button>
              <button
                onClick={handleQuickView}
                className="w-9 h-9 rounded-lg border border-ecommerce-border flex items-center justify-center hover:bg-ecommerce-purple hover:text-white hover:border-ecommerce-purple transition-all"
                aria-label={t('homepage.common.quickView')}
              >
                <Eye size={14} />
              </button>
              <button
                onClick={handleWishlist}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${wishlisted ? 'bg-ecommerce-red/5 border-ecommerce-red/30 text-ecommerce-red' : 'border-ecommerce-border hover:bg-ecommerce-rose hover:text-white hover:border-ecommerce-rose'}`}
                aria-label={wishlisted ? t('homepage.common.removeFromWishlist') : t('homepage.common.addToWishlist')}
              >
                <Heart size={14} className={wishlisted ? 'fill-ecommerce-red' : ''} />
              </button>
              <Button
                onClick={handleAddToCart}
                size="sm"
                disabled={stock === 0}
                className="h-9 px-4 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-lg text-xs font-medium gap-1.5 transition-all hover:scale-105 active:scale-95 ripple disabled:opacity-50"
              >
                <ShoppingCart size={13} />
                {t('homepage.common.addToCart')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}