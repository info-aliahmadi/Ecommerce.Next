'use client';

import { Skeleton } from '@mui/material';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton variant="rectangular" height={256} />
      <div className="p-4">
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="100%" height={48} className="mb-2" />
        <Skeleton variant="text" width="40%" height={20} className="mb-3" />
        <Skeleton variant="text" width="50%" height={32} className="mb-3" />
        <Skeleton variant="rectangular" height={40} className="rounded-lg" />
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton variant="rectangular" height={192} />
      <div className="p-4">
        <Skeleton variant="text" width="80%" height={24} className="mb-2" />
        <Skeleton variant="text" width="100%" height={40} className="mb-3" />
        <Skeleton variant="text" width="40%" height={24} />
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
