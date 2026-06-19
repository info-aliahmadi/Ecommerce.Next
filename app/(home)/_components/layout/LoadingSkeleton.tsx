'use client';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-200" />
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/5 mb-2" />
        <div className="h-12 bg-gray-200 rounded w-full mb-2" />
        <div className="h-5 bg-gray-200 rounded w-2/5 mb-3" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-4/5 mb-2" />
        <div className="h-10 bg-gray-200 rounded w-full mb-3" />
        <div className="h-6 bg-gray-200 rounded w-2/5" />
      </div>
    </div>
  );
}

export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  );
}
