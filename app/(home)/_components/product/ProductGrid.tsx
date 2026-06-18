'use client';

import ProductCard from './ProductCard';

interface ProductGridProps {
  products: any[];
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
  columns?: 2 | 3 | 4 | 5;
}

export default function ProductGrid({ 
  products, 
  onAddToCart, 
  onAddToWishlist,
  columns = 4 
}: ProductGridProps) {
  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  }[columns];

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products available</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
        />
      ))}
    </div>
  );
}
