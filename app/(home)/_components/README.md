# Home Page Components

This directory contains all the reusable components for the customer-facing homepage.

## Directory Structure

```
_components/
├── category/
│   └── CategoryCard.tsx          # Individual category card with image and link
├── hero/
│   └── HeroBanner.tsx            # Hero slider with multiple promotional slides
├── layout/
│   ├── LoadingSkeleton.tsx       # Skeleton loaders for products and categories
│   └── PromoBanner.tsx           # Promotional banner component
├── newsletter/
│   └── NewsletterSection.tsx     # Newsletter subscription form
└── product/
    ├── ProductCard.tsx           # Individual product card with all features
    └── ProductGrid.tsx           # Grid layout for products
```

## Component Features

### ProductCard
- Product image with fallback
- Badges for new, discount, and free shipping
- Star rating display
- Price with old price strikethrough
- Stock status indicator
- Add to cart and wishlist buttons
- Hover effects and animations
- Responsive design

### CategoryCard
- Category image with gradient overlay
- Category name and description
- Hover effects
- Click to navigate to category page

### HeroBanner
- Auto-rotating slider (5 seconds)
- Multiple slides with different themes
- Navigation arrows
- Dot indicators
- Fully customizable slides
- Smooth transitions

### ProductGrid
- Configurable column count (2, 3, 4, or 5 columns)
- Responsive grid layout
- Empty state handling
- Maps ProductCard components

### PromoBanner
- Three types: sale, trending, new
- Icon based on type
- Gradient backgrounds
- Call-to-action button
- Responsive layout

### NewsletterSection
- Email input with validation
- Loading state
- Success/error messages
- Gradient background
- Privacy policy notice

### LoadingSkeleton
- ProductCardSkeleton
- ProductGridSkeleton
- CategoryCardSkeleton
- CategoryGridSkeleton
- Configurable skeleton counts

## Usage Examples

### ProductCard
```tsx
<ProductCard
  product={productData}
  onAddToCart={handleAddToCart}
  onAddToWishlist={handleAddToWishlist}
/>
```

### ProductGrid
```tsx
<ProductGrid
  products={productsArray}
  onAddToCart={handleAddToCart}
  onAddToWishlist={handleAddToWishlist}
  columns={4}
/>
```

### CategoryCard
```tsx
<CategoryCard category={categoryData} />
```

### HeroBanner
```tsx
<HeroBanner />
```

### PromoBanner
```tsx
<PromoBanner
  type="sale"
  title="Special Offers!"
  description="Don't miss out on amazing deals"
  buttonText="Shop Deals"
  buttonLink="/products?filter=sale"
/>
```

### NewsletterSection
```tsx
<NewsletterSection />
```

### Loading Skeletons
```tsx
<ProductGridSkeleton count={8} />
<CategoryGridSkeleton count={6} />
```

## Styling

All components use:
- Tailwind CSS for styling
- Material-UI components for specific elements
- Responsive design principles
- Smooth animations and transitions
- Consistent color scheme (blue primary, gray backgrounds)

## Customization

To customize the components:

1. **Colors**: Modify Tailwind classes in each component
2. **Sizing**: Adjust height/width classes and grid columns
3. **Animations**: Modify transition and transform classes
4. **Hero Slides**: Edit the slides array in HeroBanner.tsx
5. **Grid Columns**: Pass different `columns` prop to ProductGrid

## Performance

- Components use Next.js Image for optimized images
- Loading states prevent layout shift
- Lazy loading ready
- Efficient re-rendering with proper keys
- Server-side rendering compatible
