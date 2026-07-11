import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import CONFIG from '@root/config';
import ProductFilterModel from '../_types/ProductFilterModel';
import ProductTags from '@root/app/types/enums/ProductTags';
import SortingType from '@root/app/types/enums/SortingType';
import DateFilterEnum from '@root/app/types/enums/DateFilter';
import AttributeType from '@root/app/types/enums/AttributeType';
import ProductsPageContent, { ProductsPageInitialData } from './ProductsPageContent';

// ── Server-side data fetch ─────────────────────────────
async function fetchProducts(filter: ProductFilterModel) {
  try {
    const locale = await getLocale();
    const response = await fetch(`${CONFIG.API_BASEPATH}/Product/GetProducts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': locale,
      },
      body: JSON.stringify(filter),
      next: { revalidate: 30 },
    });

    if (!response.ok) return null;
    const result = await response.json();
    if (!result.succeeded) return null;
    return result.data;
  } catch {
    return null;
  }
}

async function fetchCategories() {
  try {
    const locale = await getLocale();
    const response = await fetch(`${CONFIG.API_BASEPATH}/Product/GetCategories`, {
      headers: {
        Accept: 'application/json',
        'Accept-Language': locale,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];
    const result = await response.json();
    return result.succeeded ? (result.data ?? []) : [];
  } catch {
    return [];
  }
}

async function fetchManufacturers() {
  try {
    const locale = await getLocale();
    const response = await fetch(`${CONFIG.API_BASEPATH}/Product/GetManufacturers`, {
      headers: {
        Accept: 'application/json',
        'Accept-Language': locale,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];
    const result = await response.json();
    return result.succeeded ? (result.data ?? []) : [];
  } catch {
    return [];
  }
}

async function fetchProductTags() {
  try {
    const locale = await getLocale();
    const response = await fetch(`${CONFIG.API_BASEPATH}/Product/GetProductTags`, {
      headers: {
        Accept: 'application/json',
        'Accept-Language': locale,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];
    const result = await response.json();
    return result.succeeded ? (result.data ?? []) : [];
  } catch {
    return [];
  }
}

async function fetchProductAttributes() {
  try {
    const locale = await getLocale();
    const response = await fetch(
      `${CONFIG.API_BASEPATH}/Product/GetProductAttributesByType?attributeTypes=${AttributeType.Style}`,
      {
        headers: {
          Accept: 'application/json',
          'Accept-Language': locale,
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) return [];
    const result = await response.json();
    return result.succeeded ? (result.data ?? []) : [];
  } catch {
    return [];
  }
}

// ── Sort & Date maps ──────────────────────────────────
const SORT_MAP: Record<string, SortingType> = {
  'newest': SortingType.SortNewest,
  'oldest': SortingType.SortOldest,
  'price-asc': SortingType.SortPriceAsc,
  'price-desc': SortingType.SortPriceDesc,
  'popular': SortingType.SortPopular,
  'rating': SortingType.SortRating,
  'name-asc': SortingType.SortNameAsc,
  'name-desc': SortingType.SortNameDesc,
};

const DATE_FILTER_MAP: Record<string, DateFilterEnum> = {
  'all': DateFilterEnum.AllTime,
  'today': DateFilterEnum.Today,
  'thisWeek': DateFilterEnum.ThisWeek,
  'thisMonth': DateFilterEnum.ThisMonth,
  'last3Months': DateFilterEnum.Last3Months,
  'last6Months': DateFilterEnum.Last6Months,
  'thisYear': DateFilterEnum.ThisYear,
};

// ── Parse search params into filter ───────────────────
function parseSearchParams(searchParams: Record<string, string | undefined>) {
  const categories = searchParams.categories?.split(',').filter(Boolean) ?? [];
  const brands = searchParams.brands?.split(',').map(Number).filter(Boolean) ?? [];
  const tags = searchParams.tags?.split(',').map(Number).filter(Boolean) ?? [];
  const attributes = searchParams.attributes?.split(',').map(Number).filter(Boolean) ?? [];

  return {
    categories,
    brands,
    tags,
    attributes,
    search: searchParams.search || '',
    minPrice: searchParams.minPrice || '',
    maxPrice: searchParams.maxPrice || '',
    discount: searchParams.discount === '1',
    stock: (searchParams.stock || 'all') as 'all' | 'inStock' | 'outOfStock',
    dateAdded: (searchParams.date || 'all') as string,
    sort: (searchParams.sort || 'newest') as string,
    page: Math.max(1, Number(searchParams.page) || 1),
    perPage: Number(searchParams.perPage) || 12,
  };
}

// ── Metadata ──────────────────────────────────────────
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const t = await getTranslations('');
  const params = await searchParams;
  const flatParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') flatParams[key] = value;
  }

  const parsed = parseSearchParams(flatParams);

  let title = t('homepage.shopPage.title');
  if (parsed.search) {
    title = `${parsed.search} - ${title}`;
  }

  return {
    title,
    description: t('homepage.shopPage.subtitle'),
  };
}

// ── Page component (Server Component) ─────────────────
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const flatParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') flatParams[key] = value;
  }

  const parsed = parseSearchParams(flatParams);

  // Resolve category slugs to IDs
  const allCategories = await fetchCategories();
  const selectedCategoryIds = parsed.categories.length > 0
    ? parsed.categories
        .map((slug) => allCategories.find((c: any) => c.key === slug)?.id)
        .filter((id): id is number => id !== undefined)
    : undefined;

  // Build filter
  const filter: ProductFilterModel = {
    pageIndex: parsed.page,
    pageSize: parsed.perPage,
    searchInput: parsed.search || undefined,
    categoryIds: selectedCategoryIds,
    manufacturerIds: parsed.brands.length > 0 ? parsed.brands : undefined,
    sorting: SORT_MAP[parsed.sort],
    fromSellUnitPrice: parsed.minPrice ? Number(parsed.minPrice) : undefined,
    toSellUnitPrice: parsed.maxPrice ? Number(parsed.maxPrice) : undefined,
    hasDiscounts: parsed.discount ? true : undefined,
    hasStockQuantity: parsed.stock === 'inStock' ? true : parsed.stock === 'outOfStock' ? false : undefined,
    dateFilter: DATE_FILTER_MAP[parsed.dateAdded],
    productTagIds: parsed.tags.length > 0 ? (parsed.tags as unknown as ProductTags[]) : undefined,
    attributeIds: parsed.attributes.length > 0 ? parsed.attributes : undefined,
  };

  // Fetch all data in parallel
  const [products, categories, brands, tags, attributes] = await Promise.all([
    fetchProducts(filter),
    Promise.resolve(allCategories),
    fetchManufacturers(),
    fetchProductTags(),
    fetchProductAttributes(),
  ]);

  const initialData: ProductsPageInitialData = {
    products: products ?? { items: [], totalItems: 0, totalPages: 0, maxRange: 0 },
    categories,
    brands,
    tags,
    attributes,
    searchParams: flatParams,
  };

  return <ProductsPageContent initialData={initialData} />;
}
