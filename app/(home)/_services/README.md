# HomePageService Skill

A comprehensive TypeScript service class for fetching and managing data for customer-facing homepage, CMS, and e-commerce sections. This service provides unified access to products, categories, tags, manufacturers, articles, pages, and site configuration.

## Purpose

Use `HomePageService` to retrieve any data needed for rendering the homepage, including:
- Product collections (featured, bestsellers, latest, search results)
- Category and product taxonomies
- CMS content (articles, pages, topics, tags)
- Site configuration (menus, settings, slideshows, links)

## Class Initialization

```typescript
const service = new HomePageService();
// Service automatically initializes with default headers and API base URL
```

## Product Methods

### `getAllCategories(): Promise<Result<CategoryModel[]>>`
Fetches all available product categories.

**Use when:** Building category navigation, filters, or breadcrumbs.

**Returns:** Array of `CategoryModel` objects with category data.

### `getAllProductTags(): Promise<Result<ProductTagModel[]>>`
Fetches all product tags available in the catalog.

**Use when:** Displaying tag clouds, tag filters, or product tag lists.

**Returns:** Array of `ProductTagModel` objects.

### `getAllManufacturers(): Promise<Result<ManufacturerModel[]>>`
Fetches all manufacturers in the product catalog.

**Use when:** Building manufacturer filters or brand navigation.

**Returns:** Array of `ManufacturerModel` objects.

### `getProducts(filter: ProductFilterModel): Promise<Result<ProductModel[]>>`
Generic product retrieval with advanced filtering and sorting.

**Parameters:**
- `filter` (`ProductFilterModel`) - Complex filter object with pagination, sorting, category/manufacturer/tag filters, and search

**Use when:** Custom product queries requiring specific filters, sorting, or pagination.

**Returns:** Array of `ProductModel` objects matching the filter criteria.

**Filter properties:**
- `pageIndex` (number) - Zero-based page number
- `pageSize` (number) - Items per page
- `searchInput` (string, optional) - Search query
- `categoryIds` (number[]) - Filter by category IDs
- `manufacturerIds` (number[]) - Filter by manufacturer IDs
- `hasDiscounts` (boolean, optional) - Filter for discounted products
- `sorting` (optional) - Sort specification with `id` and `desc` flag

### `getFeaturedProducts(): Promise<Result<ProductModel[]>>`
Fetches products marked as featured (with active discounts).

**Use when:** Populating featured/hero product sections on homepage.

**Returns:** Up to 8 featured `ProductModel` objects.

**Filters applied:** `hasDiscounts: true`, page size: 8

### `getBestSellingProducts(): Promise<Result<ProductModel[]>>`
Fetches top-rated/best-selling products.

**Use when:** Displaying bestseller sections or top products.

**Returns:** Up to 8 `ProductModel` objects (unfiltered, sorting handled server-side or by rating).

### `getLatestProducts(): Promise<Result<ProductModel[]>>`
Fetches newest products sorted by availability start date.

**Use when:** Displaying new arrivals or latest products section.

**Returns:** Up to 8 newest `ProductModel` objects.

**Filters applied:** Sorted by `availableStartDateTimeUtc` descending

### `searchProducts(query: string, pageIndex?: number = 0, pageSize?: number = 10): Promise<Result<ProductModel[]>>`
Searches products by query with pagination.

**Parameters:**
- `query` (string, required) - Search term
- `pageIndex` (number, optional) - Page number (default: 0)
- `pageSize` (number, optional) - Items per page (default: 10)

**Use when:** Implementing product search functionality, search result pages.

**Returns:** Array of matching `ProductModel` objects.

## CMS & Content Methods

### `getSettings(): Promise<Result<any>>`
Fetches site-wide settings and configuration.

**Use when:** Loading site settings, theme options, or global configuration.

**Returns:** Settings object with site configuration data.

### `getMenu(): Promise<Result<any>>`
Fetches the site navigation menu structure.

**Use when:** Rendering main navigation, header menus, or site structure.

**Returns:** Menu structure object.

### `getArticlesList(pageIndex?: number = 0, pageSize?: number = 10): Promise<Result<any[]>>`
Fetches paginated list of articles for visitors.

**Parameters:**
- `pageIndex` (number, optional) - Page number (default: 0)
- `pageSize` (number, optional) - Items per page (default: 10)

**Use when:** Building article listing pages, blog archives.

**Returns:** Array of article objects with pagination.

### `getRelatedArticlesList(articleId: number): Promise<Result<any[]>>`
Fetches articles related to a specific article.

**Parameters:**
- `articleId` (number, required) - Article ID to find related articles for

**Use when:** Displaying related articles on article detail pages.

**Returns:** Array of related article objects.

### `getTopArticle(): Promise<Result<ArticleModel>>`
Fetches the featured/top article for the homepage.

**Use when:** Displaying featured article in hero section.

**Returns:** Single `ArticleModel` object.

### `getArticle(articleId: number): Promise<Result<ArticleModel>>`
Fetches a specific article by ID.

**Parameters:**
- `articleId` (number, required) - Article ID to retrieve

**Use when:** Rendering article detail pages.

**Returns:** Single `ArticleModel` object with full article content.

### `getPage(pageId: number): Promise<Result<PageModel>>`
Fetches a specific CMS page by ID.

**Parameters:**
- `pageId` (number, required) - Page ID to retrieve

**Use when:** Rendering static CMS pages (About, Contact, Privacy, etc.).

**Returns:** Single `PageModel` object.

### `getTopicsList(): Promise<Result<TopicModel[]>>`
Fetches all CMS topics/categories.

**Use when:** Building topic navigation, topic filters.

**Returns:** Array of `TopicModel` objects.

### `getTagsList(): Promise<Result<TagModel[]>>`
Fetches all available CMS tags.

**Use when:** Displaying tag clouds, tag navigation.

**Returns:** Array of `TagModel` objects.

### `getLinksBySectionKey(keys: string[]): Promise<Result<LinkModel[]>>`
Fetches specific links by their keys.

**Parameters:**
- `keys` (string[], required) - Array of link keys to retrieve

**Use when:** Fetching specific footer links, social links, or branded links.

**Returns:** Array of `LinkModel` objects matching the provided keys.

### `getSlideshows(keys: string[]): Promise<Result<SlideshowModel[]>>`
Fetches slideshow/carousel content.

**Parameters:**
- `keys` (string[], required) - Array of slideshow keys (currently unused in implementation)

**Use when:** Populating homepage carousels, image sliders, featured content rotators.

**Returns:** Array of `SlideshowModel` objects.

## Response Format

All methods return a standardized `Result<T>` object:

```typescript
interface Result<T> {
  succeeded: boolean;        // Whether the request succeeded
  data: T | null;            // The response data (null if failed)
  message?: string;          // Optional error message or status
}
```

## Error Handling

- All methods include try-catch error handling
- Failed requests return `succeeded: false` with `data: null`
- Console logging for debugging
- Graceful fallbacks with empty collections where applicable

## Configuration

The service uses:
- **API Base URL:** From `CONFIG.API_BASEPATH`
- **Default Headers:** Automatically set via `Fetch.SetDefaultHeader()`
- **HTTP Client:** Custom `Fetch` utility class

## Common Usage Patterns

### Fetch and Display Featured Products
```typescript
const service = new HomePageService();
const result = await service.getFeaturedProducts();
if (result.succeeded && result.data) {
  // Display result.data (array of ProductModel)
}
```

### Search with Pagination
```typescript
const searchResult = await service.searchProducts('laptop', 0, 20);
if (searchResult.succeeded) {
  const products = searchResult.data;
  const hasMore = products.length === 20; // Check if more results available
}
```

### Load Multiple CMS Sections
```typescript
const [articlesResult, settingsResult, menuResult] = await Promise.all([
  service.getArticlesList(0, 5),
  service.getSettings(),
  service.getMenu()
]);
```

### Custom Product Filtering
```typescript
const filter: ProductFilterModel = {
  pageIndex: 0,
  pageSize: 20,
  categoryIds: [1, 2, 3],
  manufacturerIds: [5],
  sorting: { id: 'price', desc: false }
};
const customProducts = await service.getProducts(filter);
```

## Key Features

✅ **Type-safe** - Full TypeScript generics support  
✅ **Unified interface** - All methods follow same response pattern  
✅ **Error resilient** - Built-in error handling and graceful fallbacks  
✅ **Configurable** - Flexible filtering, sorting, and pagination  
✅ **Production-ready** - Handles all homepage and CMS content needs  
✅ **Zero authentication** - Public endpoints for visitor-facing content  

## Related Types

- `ProductModel` - Product entity
- `CategoryModel` - Product category
- `ProductTagModel` - Product tag
- `ManufacturerModel` - Product brand/manufacturer
- `ArticleModel` - CMS article
- `PageModel` - CMS static page
- `TopicModel` - Article topic/category
- `TagModel` - CMS tag
- `LinkModel` - Navigation or footer link
- `SlideshowModel` - Carousel/slideshow item
- `ProductFilterModel` - Product query filter
