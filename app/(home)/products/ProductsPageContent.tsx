'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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
import HomePageService from '../_services/HomePageService';
import ProductDisplayModel from '../_types/ProductDisplayModel';
import ProductFilterModel from '../_types/ProductFilterModel';
import ProductTags from '@root/app/types/enums/ProductTags';
import SortingType, { SortOption } from '@root/app/types/enums/SortingType';
import DateFilterEnum from '@root/app/types/enums/DateFilter';
import CategoryDisplayModel from '../_types/CategoryDisplayModel';
import ManufacturerDisplayModel from '../_types/ManufacturerDisplayModel';
import ProductTagDisplayModel from '../_types/ProductTagDisplayModel';
import ProductAttributeDisplayModel from '../_types/ProductAttributeDisplayModel';
import PaginatedDisplayList from '../_types/PaginatedList';

import { Button } from '../_components/ui/button';
import { Badge } from '../_components/ui/badge';
import { Checkbox } from '../_components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../_components/ui/radio-group';
import { Input } from '../_components/ui/input';
import { Label } from '../_components/ui/label';
import { Skeleton } from '../_components/ui/skeleton';
import { Slider } from '../_components/ui/slider';
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
  RotateCcw,
  PackageSearch,
  ChevronLeft,
  ChevronRight,
  Home,
} from 'lucide-react';
import { useCompareStore } from '../_lib/store';
import ProductListCard from '../_components/ecommerce/product-list';
import AttributeType from '@root/app/types/enums/AttributeType';

// ── Types ──────────────────────────────────────────────
type StockFilter = 'all' | 'inStock' | 'outOfStock';
type DateFilter = 'all' | 'today' | 'thisWeek' | 'thisMonth' | 'last3Months' | 'last6Months' | 'thisYear';
type ViewMode = 'grid' | 'list';

interface FilterState {
  search: string;
  categories: string[];
  brands: number[];
  appliedMinPrice: string;
  appliedMaxPrice: string;
  discount?: boolean;
  stock: StockFilter;
  dateAdded: DateFilter;
  tags: number[];
  attributes: number[];
  sort: SortOption;
  viewMode: ViewMode;
  page: number;
  perPage: number;
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  categories: [],
  brands: [],
  appliedMinPrice: '',
  appliedMaxPrice: '',
  discount: undefined,
  stock: 'all',
  dateAdded: 'all',
  tags: [],
  attributes: [],
  sort: 'newest',
  viewMode: 'grid',
  page: 1,
  perPage: 12,
};

const PER_PAGE_OPTIONS = [12, 24, 36, 48];

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

const DATE_FILTER_MAP: Record<DateFilter, DateFilterEnum> = {
  'all': DateFilterEnum.AllTime,
  'today': DateFilterEnum.Today,
  'thisWeek': DateFilterEnum.ThisWeek,
  'thisMonth': DateFilterEnum.ThisMonth,
  'last3Months': DateFilterEnum.Last3Months,
  'last6Months': DateFilterEnum.Last6Months,
  'thisYear': DateFilterEnum.ThisYear,
};

// ── URL Sync Helpers ──────────────────────────────────
function filtersToParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.categories.length > 0) params.set('categories', filters.categories.join(','));
  if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
  if (filters.appliedMinPrice) params.set('minPrice', filters.appliedMinPrice);
  if (filters.appliedMaxPrice) params.set('maxPrice', filters.appliedMaxPrice);
  if (filters.discount) params.set('discount', '1');
  if (filters.stock !== 'all') params.set('stock', filters.stock);
  if (filters.dateAdded !== 'all') params.set('date', filters.dateAdded);
  if (filters.tags.length > 0) params.set('tags', filters.tags.join(','));
  if (filters.attributes.length > 0) params.set('attributes', filters.attributes.join(','));
  if (filters.sort !== 'newest') params.set('sort', filters.sort);
  if (filters.viewMode !== 'grid') params.set('view', filters.viewMode);
  if (filters.page > 1) params.set('page', String(filters.page));
  if (filters.perPage !== 12) params.set('perPage', String(filters.perPage));
  return params;
}

function paramsToFilters(params: URLSearchParams): Partial<FilterState> {
  const partial: Partial<FilterState> = {};
  const search = params.get('search');
  if (search) partial.search = search;
  const categories = params.get('categories');
  if (categories) partial.categories = categories.split(',').filter(Boolean);
  const brands = params.get('brands');
  if (brands) partial.brands = brands.split(',').map(Number).filter(Boolean);
  const minPrice = params.get('minPrice');
  if (minPrice) partial.appliedMinPrice = minPrice;
  const maxPrice = params.get('maxPrice');
  if (maxPrice) partial.appliedMaxPrice = maxPrice;
  if (params.get('discount') === '1') partial.discount = true;
  const stock = params.get('stock');
  if (stock && stock !== 'all') partial.stock = stock as StockFilter;
  const date = params.get('date');
  if (date && date !== 'all') partial.dateAdded = date as DateFilter;
  const tags = params.get('tags');
  if (tags) partial.tags = tags.split(',').map(Number).filter(Boolean);
  const attributes = params.get('attributes');
  if (attributes) partial.attributes = attributes.split(',').map(Number).filter(Boolean);
  const sort = params.get('sort');
  if (sort) partial.sort = sort as SortOption;
  const view = params.get('view');
  if (view) partial.viewMode = view as ViewMode;
  const page = params.get('page');
  if (page) partial.page = Math.max(1, Number(page));
  const perPage = params.get('perPage');
  if (perPage) partial.perPage = Number(perPage);
  return partial;
}

// ── Initial Data Props ────────────────────────────────
export interface ProductsPageInitialData {
  products: PaginatedDisplayList<ProductDisplayModel>;
  categories: CategoryDisplayModel[];
  brands: ManufacturerDisplayModel[];
  tags: ProductTagDisplayModel[];
  attributes: ProductAttributeDisplayModel[];
  searchParams: Record<string, string>;
}

// ── Main Component ────────────────────────────────────
export default function ProductsPageContent({
  initialData,
}: {
  initialData?: ProductsPageInitialData;
}) {
  const t = useTranslations();
  const isCompareOpen = useCompareStore((s) => s.isCompareOpen);
  const setCompareOpen = useCompareStore((s) => s.setCompareOpen);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initializedRef = useRef(false);

  const [filters, setFilters] = useState<FilterState>(() => {
    const urlFilters = paramsToFilters(searchParams);
    return { ...DEFAULT_FILTERS, ...urlFilters };
  });
  const [searchInput, setSearchInput] = useState(filters.search);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [priceMinInput, setPriceMinInput] = useState(filters.appliedMinPrice);
  const [priceMaxInput, setPriceMaxInput] = useState(filters.appliedMaxPrice);
  const priceDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [sliderValue, setSliderValue] = useState<[number, number]>([
    Number(filters.appliedMinPrice) || 0,
    Number(filters.appliedMaxPrice) || 2000,
  ]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    brand: false,
    price: true,
    stock: false,
    date: false,
    tags: false,
    attributes: false,
  });

  // Sync filters to URL
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    const params = filtersToParams(filters);
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [filters, pathname, router]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters.page]);

  // Debounce search input
  useEffect(() => {
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setFilters((prev) => {
        if (prev.search === searchInput) return prev;
        return { ...prev, search: searchInput, page: 1 };
      });
    }, 1000);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchInput]);

  // Debounce price inputs
  useEffect(() => {
    clearTimeout(priceDebounceRef.current);
    priceDebounceRef.current = setTimeout(() => {
      setFilters((prev) => {
        const minChanged = prev.appliedMinPrice !== priceMinInput;
        const maxChanged = prev.appliedMaxPrice !== priceMaxInput;
        if (!minChanged && !maxChanged) return prev;
        return {
          ...prev,
          appliedMinPrice: priceMinInput,
          appliedMaxPrice: priceMaxInput,
          page: 1,
        };
      });
    }, 1000);
    return () => clearTimeout(priceDebounceRef.current);
  }, [priceMinInput, priceMaxInput]);

  // ── Use initial data, refetch on filter changes ─────
  const { data: categoriesData = initialData?.categories ?? [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getAllCategories();
      return result.succeeded ? result.data ?? [] : [];
    },
    staleTime: 60_000,
    initialData: initialData?.categories,
  });

  const { data: brandsData = initialData?.brands ?? [] } = useQuery({
    queryKey: ['all-brands'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getAllManufacturers();
      return result.succeeded ? result?.data ?? [] : [];
    },
    staleTime: 60_000,
    initialData: initialData?.brands,
  });

  const { data: tagsData = initialData?.tags ?? [] } = useQuery({
    queryKey: ['all-products-tags'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getProductTags();
      return result.succeeded ? result?.data ?? [] : [];
    },
    staleTime: 60_000,
    initialData: initialData?.tags,
  });

  const { data: attributesData = initialData?.attributes ?? [] } = useQuery({
    queryKey: ['all-products-style-attributes'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getProductAttributesByType([AttributeType.Style]);
      return result.succeeded ? result?.data ?? [] : [];
    },
    staleTime: 60_000,
    initialData: initialData?.attributes,
  });

  // ── Resolve selected category IDs ───────────────────
  const selectedCategoryIds = useMemo(() => {
    if (filters.categories.length === 0) return undefined;
    return filters.categories
      .map((slug) => categoriesData.find((c) => c.key === slug)?.id)
      .filter((id): id is number => id !== undefined);
  }, [filters.categories, categoriesData]);

  // ── Build ProductFilterModel ────────────────────────
  const filter = useMemo((): ProductFilterModel => {
    return {
      pageIndex: filters.page,
      pageSize: filters.perPage,
      searchInput: filters.search,
      categoryIds: selectedCategoryIds,
      manufacturerIds: filters.brands.length > 0 ? filters.brands : undefined,
      sorting: SORT_MAP[filters.sort],
      fromSellUnitPrice: filters.appliedMinPrice ? Number(filters.appliedMinPrice) : undefined,
      toSellUnitPrice: filters.appliedMaxPrice ? Number(filters.appliedMaxPrice) : undefined,
      hasDiscounts: filters.discount ? true : undefined,
      hasStockQuantity: filters.stock === 'inStock' ? true : filters.stock === 'outOfStock' ? false : undefined,
      dateFilter: DATE_FILTER_MAP[filters.dateAdded],
      productTagIds: filters.tags.length > 0 ? filters.tags as ProductTags[] : undefined,
      attributeIds: filters.attributes.length > 0 ? filters.attributes : undefined,
    };
  }, [filters, selectedCategoryIds]);

  // Check if this is the initial load (no filter changes yet)
  const isInitialLoad = useMemo(() => {
    if (!initialData) return false;
    return (
      filters.search === (initialData.searchParams.search || '') &&
      filters.page === Number(initialData.searchParams.page || 1) &&
      filters.perPage === Number(initialData.searchParams.perPage || 12) &&
      filters.sort === (initialData.searchParams.sort || 'newest')
    );
  }, [filters, initialData]);

  const { data, isLoading } = useQuery({
    queryKey: ['products', filter],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getProducts(filter);
      if (!result.succeeded) throw new Error(result.message ?? 'Failed to load products');
      return result.data;
    },
    staleTime: 30_000,
    initialData: isInitialLoad && initialData ? initialData.products : undefined,
  });

  const allProducts = data?.items ?? [];
  const total = data?.totalItems ?? 0;
  const maxPriceRange = data?.maxRange ?? 0;
  const totalPages = data?.totalPages ?? Math.max(1, Math.ceil(total / filters.perPage));

  const products = allProducts;

  // Sync slider and inputs when filters change externally
  useEffect(() => {
    setSliderValue([
      Number(filters.appliedMinPrice) || 0,
      Number(filters.appliedMaxPrice) || maxPriceRange,
    ]);
    setSearchInput(filters.search);
    setPriceMinInput(filters.appliedMinPrice);
    setPriceMaxInput(filters.appliedMaxPrice);
  }, [filters.appliedMinPrice, filters.appliedMaxPrice, filters.search, maxPriceRange]);

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

  const toggleTag = useCallback((tagId: number) => {
    setFilters((prev) => {
      const tags = prev.tags.includes(tagId)
        ? prev.tags.filter((t) => t !== tagId)
        : [...prev.tags, tagId];
      return { ...prev, tags, page: 1 };
    });
  }, []);

  const toggleAttribute = useCallback((attrId: number) => {
    setFilters((prev) => {
      const attributes = prev.attributes.includes(attrId)
        ? prev.attributes.filter((a) => a !== attrId)
        : [...prev.attributes, attrId];
      return { ...prev, attributes, page: 1 };
    });
  }, []);

  const toggleBrand = useCallback((brandId: number) => {
    setFilters((prev) => {
      const brands = prev.brands.includes(brandId)
        ? prev.brands.filter((b) => b !== brandId)
        : [...prev.brands, brandId];
      return { ...prev, brands, page: 1 };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
    setPriceMinInput('');
    setPriceMaxInput('');
  }, []);

  // ── Active filter count ─────────────────────────────
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.appliedMinPrice || filters.appliedMaxPrice) count++;
    if (filters.discount) count++;
    if (filters.stock !== 'all') count++;
    if (filters.dateAdded !== 'all') count++;
    if (filters.tags.length > 0) count++;
    if (filters.attributes.length > 0) count++;
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
      const cat = categoriesData.find((c) => c.key === slug);
      chips.push({
        key: `cat-${cat?.key}`,
        label: cat ? cat.name : slug,
        onRemove: () => toggleCategory(slug),
      });
    });
    filters.brands.forEach((brandId) => {
      const brand = brandsData?.find((b) => b.id === brandId);
      chips.push({
        key: `brand-${brandId}`,
        label: brand?.name ?? String(brandId),
        onRemove: () => toggleBrand(brandId),
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
    if (filters.discount && filters.discount === true) {
      const label =
        filters.discount === true
          ? t('homepage.shopPage.withDiscount')
          : '';
      chips.push({
        key: 'discount',
        label,
        onRemove: () => updateFilter('discount', true),
      });
    }
    if (filters.stock !== 'all') {
      const label =
        filters.stock === 'inStock'
          ? t('homepage.shopPage.inStockOnly')
          : t('homepage.shopPage.outOfStockOnly');
      chips.push({
        key: 'stock',
        label,
        onRemove: () => updateFilter('stock', 'all'),
      });
    }
    if (filters.dateAdded !== 'all') {
      const dateLabels: Record<string, string> = {
        today: t('homepage.shopPage.today'),
        thisWeek: t('homepage.shopPage.thisWeek'),
        thisMonth: t('homepage.shopPage.thisMonth'),
        last3Months: t('homepage.shopPage.last3Months'),
        last6Months: t('homepage.shopPage.last6Months'),
        thisYear: t('homepage.shopPage.thisYear'),
      };
      chips.push({
        key: 'date',
        label: dateLabels[filters.dateAdded] || filters.dateAdded,
        onRemove: () => updateFilter('dateAdded', 'all'),
      });
    }
    filters.tags.forEach((tagId) => {
      const tag = tagsData?.find((t) => t.id === tagId);
      chips.push({
        key: `tag-${tagId}`,
        label: tag?.name ?? String(tagId),
        onRemove: () => toggleTag(tagId),
      });
    });
    filters.attributes.forEach((attrId) => {
      const attr = attributesData?.find((a) => a.id === attrId);
      chips.push({
        key: `attr-${attrId}`,
        label: attr?.name ?? String(attrId),
        onRemove: () => toggleAttribute(attrId),
      });
    });
    return chips;
  }, [filters, categoriesData, brandsData, tagsData, attributesData, t, toggleCategory, toggleBrand, toggleTag, toggleAttribute, updateFilter]);

  const toggleSection = (key: string) =>
    setExpandedSections((p) => ({ ...p, [key]: !p[key] }));

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

  // ── Filter Sidebar Content ──────────────────────────
  const filterSidebarContent = (
    <div className="space-y-1">
      {/* Category Filter */}
      <div className="border border-ecommerce-border rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
        >
          {t('homepage.shopPage.categoriesFilter')}
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
                    {t('homepage.shopPage.allCategories')}
                  </span>
                  <span className="ms-auto text-xs text-ecommerce-text-muted">{total}</span>
                </label>
                {categoriesData.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group py-1">
                    <Checkbox
                      checked={filters.categories.includes(cat.key)}
                      onCheckedChange={() => toggleCategory(cat.key)}
                      className="rounded-md data-[state=checked]:bg-ecommerce-red data-[state=checked]:border-ecommerce-red"
                    />
                    <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary transition-colors">
                      {cat.name}
                    </span>
                    <span className="ms-auto text-xs text-ecommerce-text-muted">
                      {cat.productsCount || 0}
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
          {t('homepage.shopPage.priceRange')}
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
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ecommerce-text-primary font-medium">
                    ${sliderValue[0]}
                  </span>
                  <span className="text-ecommerce-text-primary font-medium">
                    ${sliderValue[1]}
                  </span>
                </div>
                <Slider
                  value={sliderValue}
                  onValueChange={(value) => setSliderValue(value as [number, number])}
                  onValueCommit={([min, max]) => {
                    const minStr = min > 0 ? String(min) : '';
                    const maxStr = max < maxPriceRange ? String(max) : '';
                    setPriceMinInput(minStr);
                    setPriceMaxInput(maxStr);
                    setFilters((p) => ({
                      ...p,
                      appliedMinPrice: minStr,
                      appliedMaxPrice: maxStr,
                      page: 1,
                    }));
                  }}
                  min={0}
                  max={maxPriceRange}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-ecommerce-text-muted uppercase tracking-wider mb-1 block">{t('homepage.catalog.priceMin')}</label>
                    <div className="relative">
                      <span className="absolute start-2.5 top-1/2 -translate-y-1/2 text-xs text-ecommerce-text-muted">$</span>
                      <input
                        type="number"
                        value={priceMinInput}
                        onChange={e => {
                          const val = e.target.value;
                          const num = val === '' ? '' : String(Math.max(0, Number(val) || 0));
                          setPriceMinInput(num);
                          setSliderValue([Number(num) || 0, sliderValue[1]]);
                        }}
                        className="w-full h-9 ps-6 pe-2 rounded-lg bg-ecommerce-surface border border-ecommerce-border text-sm text-ecommerce-text-primary focus:outline-none focus:ring-2 focus:ring-ecommerce-red/30"
                        min={0}
                        max={maxPriceRange}
                      />
                    </div>
                  </div>
                  <span className="text-ecommerce-text-muted mt-4">–</span>
                  <div className="flex-1">
                    <label className="text-[10px] text-ecommerce-text-muted uppercase tracking-wider mb-1 block">{t('homepage.catalog.priceMax')}</label>
                    <div className="relative">
                      <span className="absolute start-2.5 top-1/2 -translate-y-1/2 text-xs text-ecommerce-text-muted">$</span>
                      <input
                        type="number"
                        value={priceMaxInput}
                        onChange={e => {
                          const val = e.target.value;
                          const num = val === '' ? '' : String(Math.min(maxPriceRange, Number(val) || maxPriceRange));
                          setPriceMaxInput(num);
                          setSliderValue([sliderValue[0], Number(num) || maxPriceRange]);
                        }}
                        className="w-full h-9 ps-6 pe-2 rounded-lg bg-ecommerce-surface border border-ecommerce-border text-sm text-ecommerce-text-primary focus:outline-none focus:ring-2 focus:ring-ecommerce-red/30"
                        min={0}
                        max={maxPriceRange}
                      />
                    </div>
                  </div>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer group pt-2">
                  <Checkbox
                    checked={(filters.discount && filters.discount === true) ? true : false}
                    onCheckedChange={(checked) => updateFilter('discount', checked ? true : undefined)}
                    className="rounded-md data-[state=checked]:bg-ecommerce-red data-[state=checked]:border-ecommerce-red"
                  />
                  <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary transition-colors">
                    {t('homepage.shopPage.withDiscount')}
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Brand Filter */}
      {brandsData && brandsData.length > 0 && (
        <div className="border border-ecommerce-border rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('brand')}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
          >
            {t('homepage.shopPage.brandFilter')}
            {expandedSections.brand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <AnimatePresence>
            {expandedSections.brand && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-3 space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                  {brandsData.map((brand) => (
                    <label key={brand.id} className="flex items-center gap-2.5 cursor-pointer group py-1">
                      <Checkbox
                        checked={filters.brands.includes(brand.id)}
                        onCheckedChange={() => toggleBrand(brand.id)}
                        className="rounded-md data-[state=checked]:bg-ecommerce-red data-[state=checked]:border-ecommerce-red"
                      />
                      <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary transition-colors">
                        {brand.name}
                      </span>
                      <span className="ms-auto text-xs text-ecommerce-text-muted">
                        {brand.productsCount || 0}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Tags Filter */}
      {tagsData?.length > 0 && (
        <div className="border border-ecommerce-border rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('tags')}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
          >
            {t('homepage.shopPage.tagsFilter')}
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
                  {tagsData?.map((tag) => (
                    <label key={"tag-" + tag.id} className="flex items-center gap-2.5 cursor-pointer group py-1">
                      <Checkbox
                        checked={filters.tags.includes(tag.id)}
                        onCheckedChange={() => toggleTag(tag.id)}
                        className="rounded-md data-[state=checked]:bg-ecommerce-red data-[state=checked]:border-ecommerce-red"
                      />
                      <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary transition-colors capitalize">
                        {tag.name}
                      </span>
                      <span className="ms-auto text-xs text-ecommerce-text-muted">
                        {tag.productsCount || 0}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Attributes Filter */}
      {attributesData?.length > 0 && (
        <div className="border border-ecommerce-border rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('attributes')}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
          >
            {t('homepage.shopPage.attributesFilter')}
            {expandedSections.attributes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <AnimatePresence>
            {expandedSections.attributes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-3 space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                  {attributesData.map((attr) => (
                    <label key={"attr-" + attr.id} className="flex items-center gap-2.5 cursor-pointer group py-1">
                      <Checkbox
                        checked={filters.attributes.includes(attr.id)}
                        onCheckedChange={() => toggleAttribute(attr.id)}
                        className="rounded-md data-[state=checked]:bg-ecommerce-red data-[state=checked]:border-ecommerce-red"
                      />
                      <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary transition-colors capitalize">
                        {attr.name}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Stock Filter */}
      <div className="border border-ecommerce-border rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('stock')}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
        >
          {t('homepage.shopPage.availabilityFilter')}
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
                    { val: 'all', label: t('homepage.shopPage.all') },
                    { val: 'inStock', label: t('homepage.shopPage.inStockOnly') },
                    { val: 'outOfStock', label: t('homepage.shopPage.outOfStockOnly') },
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
          {t('homepage.shopPage.dateFilter')}
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
                        {t(`homepage.shopPage.${labelKey}`)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
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
          className="w-full rounded-xl border-ecommerce-border text-ecommerce-text-secondary hover:text-ecommerce-red hover:border-ecommerce-red/50 hover:bg-ecommerce-red/5 gap-2 mt-2"
        >
          <RotateCcw size={14} />
          {t('homepage.shopPage.resetFilters')}
        </Button>
      )}
    </div>
  );

  // ── Pagination info ─────────────────────────────────
  const showingStart = total === 0 ? 0 : (filters.page - 1) * filters.perPage + 1;
  const showingEnd = Math.min(filters.page * filters.perPage, total);

  // ── Product grid content ────────────────────────────
  const gridClass =
    filters.viewMode === 'grid'
      ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
      : 'grid grid-cols-1 xl:grid-cols-2 gap-4';

  let productGridContent: React.ReactNode;
  if (isLoading) {
    productGridContent = (
      <div className={gridClass}>
        {Array.from({ length: filters.perPage }).map((_, i) => (
          <div key={"skeleton-" + i} className={`rounded-2xl border border-ecommerce-border overflow-hidden ${filters.viewMode === 'list' ? 'flex' : ''}`}>
            <Skeleton className={filters.viewMode === 'list' ? 'w-40 h-40 sm:w-48 sm:h-48 shrink-0' : 'aspect-square'} />
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
    );
  } else if (products.length === 0) {
    productGridContent = (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-ecommerce-surface flex items-center justify-center mb-5">
          <PackageSearch size={36} className="text-ecommerce-text-muted" />
        </div>
        <h3 className="text-lg font-bold text-ecommerce-text-primary mb-2">
          {t('homepage.shopPage.noResults')}
        </h3>
        <p className="text-sm text-ecommerce-text-muted max-w-sm mb-3">
          {t('homepage.shopPage.noResultsDesc')}
        </p>
        <div className="text-sm text-ecommerce-text-muted space-y-1 mb-5">
          <p>{t('homepage.shopPage.noResultsSuggestion')}</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs">
            <li>{t('homepage.shopPage.tryBroadening')}</li>
            <li>{t('homepage.shopPage.clearFilters')}</li>
            <li>{t('homepage.shopPage.checkSpelling')}</li>
          </ul>
        </div>
        <Button
          onClick={resetFilters}
          className="rounded-xl bg-ecommerce-red hover:bg-ecommerce-red/90 text-white gap-2"
        >
          <RotateCcw size={14} />
          {t('homepage.shopPage.resetFilters')}
        </Button>
      </div>
    );
  } else {
    productGridContent = (
      <>
        <motion.div
          layout
          className={gridClass}
        >
          {products.map(
            (product: ProductDisplayModel, index: number) => (
              <div key={"pdiv-" + product.id} >
                {filters.viewMode === 'list' ? (
                  <ProductListCard
                    product={product}
                    index={index}
                  />
                ) : (
                  <ProductCard
                    product={product}
                    index={index}
                  />
                )}
              </div>
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
              {t('homepage.shopPage.previousPage')}
            </Button>

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
              {t('homepage.shopPage.nextPage')}
              <ChevronRight size={15} />
            </Button>
          </div>
        )}
      </>
    );
  }

  // ── Render ──────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col pb-16 lg:pb-0 bg-background">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="border-b border-ecommerce-border bg-ecommerce-surface/50">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-5">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-ecommerce-text-muted hover:text-ecommerce-text-primary text-sm flex items-center gap-1.5">
                    <Home size={14} />
                    {t('homepage.shopPage.breadcrumbHome')}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-ecommerce-text-primary font-medium text-sm">
                    {t('homepage.shopPage.breadcrumbShop')}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-bold text-ecommerce-text-primary">
                {t('homepage.shopPage.title')}
              </h1>
              <p className="text-sm text-ecommerce-text-muted mt-1">
                {t('homepage.shopPage.subtitle')}
              </p>
            </div>

            <div className="relative max-w-xl">
              <Search
                size={18}
                className="absolute start-4 top-1/2 -translate-y-1/2 text-ecommerce-text-muted"
              />
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('homepage.shopPage.searchProducts')}
                className="h-11 ps-11 pe-10 rounded-xl bg-white dark:bg-ecommerce-surface border-ecommerce-border text-sm text-ecommerce-text-primary placeholder:text-ecommerce-text-muted focus-visible:ring-ecommerce-red/30 focus-visible:border-ecommerce-red/50 transition-all"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
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
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSheetOpen(true)}
                className="lg:hidden shrink-0 rounded-xl border-ecommerce-border gap-2 relative h-9"
              >
                <SlidersHorizontal size={15} />
                {t('homepage.shopPage.openFilters')}
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-ecommerce-red text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <div className="text-sm text-ecommerce-text-muted">
                {isLoading ? (
                  <Skeleton className="h-4 w-40 inline-block" />
                ) : (
                  <span>
                    {t('homepage.shopPage.showingResults', {
                      shown: total === 0 ? 0 : `${showingStart}-${showingEnd}`,
                      total,
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
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

              <div className="flex items-center bg-ecommerce-surface rounded-xl p-1 border border-ecommerce-border">
                <button
                  onClick={() => updateFilter('viewMode', 'grid')}
                  className={`p-2 rounded-lg transition-all ${filters.viewMode === 'grid'
                    ? 'bg-ecommerce-red text-white shadow-sm'
                    : 'text-ecommerce-text-muted hover:text-ecommerce-text-primary'
                    }`}
                  aria-label={t('homepage.shopPage.gridView')}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => updateFilter('viewMode', 'list')}
                  className={`p-2 rounded-lg transition-all ${filters.viewMode === 'list'
                    ? 'bg-ecommerce-red text-white shadow-sm'
                    : 'text-ecommerce-text-muted hover:text-ecommerce-text-primary'
                    }`}
                  aria-label={t('homepage.shopPage.listView')}
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
                    {t('homepage.shopPage.activeFilters')}:
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
                    {t('homepage.shopPage.clearAll')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Grid */}
          <div className="flex gap-6">
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-ecommerce-text-primary">
                    {t('homepage.shopPage.filterBy')}
                  </h2>
                  {activeFilterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-ecommerce-red text-white rounded-full px-2 text-[10px]"
                    >
                      {t('homepage.shopPage.filtersCount', { count: activeFilterCount })}
                    </Badge>
                  )}
                </div>
                <ScrollArea className="max-h-[calc(100vh-220px)]">
                  {filterSidebarContent}
                </ScrollArea>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {productGridContent}
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
                  {t('homepage.shopPage.filterBy')}
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
                  {t('homepage.shopPage.clearAll')}
                </button>
              )}
            </div>
            <SheetDescription className="sr-only">
              {t('homepage.shopPage.filterBy')}
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
      <CompareDrawer />
    </div>
  );
}
