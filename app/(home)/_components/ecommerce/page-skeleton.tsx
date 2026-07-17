function SkeletonLine({ className }: { className?: string }) {
  return <div className={`h-4 rounded-full shimmer-loading ${className || ''}`} />;
}

function SkeletonCircle({ className }: { className?: string }) {
  return <div className={`rounded-full shimmer-loading ${className || 'w-10 h-10'}`} />;
}

function SkeletonRect({ className }: { className?: string }) {
  return <div className={`rounded-2xl shimmer-loading ${className || ''}`} />;
}

function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-ecommerce-surface border-b border-ecommerce-border">
      {/* Promo bar skeleton */}
      <div className="shimmer-loading h-10" />
      {/* Nav bar */}
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <SkeletonCircle className="w-9 h-9 shrink-0" />
        {/* Nav links - hidden on mobile */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonLine
              key={i}
              className={`h-3.5 ${i === 0 ? 'w-14' : i === 1 ? 'w-16' : i === 2 ? 'w-12' : i === 3 ? 'w-18' : 'w-20'}`}
            />
          ))}
        </div>
        {/* Search bar */}
        <div className="hidden sm:block flex-1 max-w-md">
          <SkeletonRect className="h-10 w-full !rounded-xl" />
        </div>
        {/* Icon circles */}
        <div className="flex items-center gap-2">
          <SkeletonCircle className="w-9 h-9" />
          <SkeletonCircle className="w-9 h-9" />
          <SkeletonCircle className="w-9 h-9" />
        </div>
      </div>
    </header>
  );
}

function HeroSkeleton() {
  return (
    <section>
      {/* Gradient background placeholder */}
      <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side */}
            <div className="text-center lg:text-left space-y-5">
              {/* Badge pill */}
              <SkeletonRect className="h-8 w-40 mx-auto lg:mx-0 !rounded-full" />
              {/* Title lines */}
              <div className="space-y-2">
                <SkeletonLine className="h-10 sm:h-12 w-3/4 mx-auto lg:mx-0" />
                <SkeletonLine className="h-10 sm:h-12 w-1/2 mx-auto lg:mx-0" />
                <SkeletonLine className="h-8 w-2/5 mx-auto lg:mx-0" />
              </div>
              {/* Body lines */}
              <div className="space-y-2.5 pt-2">
                <SkeletonLine className="h-4 w-full max-w-lg mx-auto lg:mx-0" />
                <SkeletonLine className="h-4 w-4/5 max-w-md mx-auto lg:mx-0" />
              </div>
              {/* Button rectangles */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-3 justify-center lg:justify-start">
                <SkeletonRect className="h-12 w-36 !rounded-xl" />
                <SkeletonRect className="h-12 w-40 !rounded-xl" />
              </div>
            </div>
            {/* Right side - image placeholder */}
            <div className="hidden lg:block">
              <SkeletonRect className="w-full h-[420px] !rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
      {/* Trust badges bar */}
      <div className="bg-white dark:bg-ecommerce-surface border-b border-ecommerce-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonCircle className="w-10 h-10 shrink-0" />
                <div className="space-y-1.5">
                  <SkeletonLine className="h-3.5 w-20" />
                  <SkeletonLine className="h-2.5 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoriesSkeleton() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 space-y-3">
          <SkeletonRect className="h-6 w-20 mx-auto !rounded-full" />
          <SkeletonLine className="h-8 w-56 mx-auto" />
          <SkeletonLine className="h-4 w-72 mx-auto" />
        </div>
        {/* Categories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRect key={i} className="aspect-[4/3] w-full" />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-ecommerce-border bg-white dark:bg-ecommerce-surface overflow-hidden">
      {/* Image placeholder */}
      <SkeletonRect className="w-full aspect-square !rounded-none" />
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category dot + name */}
        <div className="flex items-center gap-2">
          <SkeletonCircle className="w-2.5 h-2.5" />
          <SkeletonLine className="h-3 w-16" />
        </div>
        {/* Product name */}
        <SkeletonLine className="h-4 w-3/4" />
        {/* Rating */}
        <SkeletonLine className="h-3 w-24" />
        {/* Price */}
        <SkeletonLine className="h-5 w-20" />
        {/* Button */}
        <SkeletonRect className="h-10 w-full !rounded-xl" />
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 space-y-3">
          <SkeletonRect className="h-6 w-16 mx-auto !rounded-full" />
          <SkeletonLine className="h-8 w-48 mx-auto" />
          <SkeletonLine className="h-4 w-64 mx-auto" />
        </div>
        {/* Products grid - 4 columns on lg */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSkeleton() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SkeletonRect className="!rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden" />
          <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
            {/* Left - text */}
            <div className="space-y-4">
              <SkeletonRect className="h-7 w-32 !rounded-full" />
              <SkeletonLine className="h-7 w-64" />
              <SkeletonLine className="h-7 w-48" />
              <div className="space-y-2 pt-1">
                <SkeletonLine className="h-4 w-full max-w-sm" />
                <SkeletonLine className="h-4 w-4/5 max-w-xs" />
              </div>
            </div>
            {/* Right - input + button */}
            <div className="space-y-4">
              <SkeletonRect className="h-12 w-full !rounded-xl" />
              <SkeletonRect className="h-12 w-full !rounded-xl" />
              <SkeletonLine className="h-3 w-48" />
            </div>
          </div>
      </div>
    </section>
  );
}

function FooterSkeleton() {
  return (
    <footer className="bg-gray-100 dark:bg-ecommerce-surface border-t border-ecommerce-border mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <SkeletonLine className="h-4 w-20" />
              {Array.from({ length: 4 }).map((_, j) => (
                <SkeletonLine key={j} className="h-3 w-28" />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-ecommerce-border">
          <SkeletonLine className="h-3 w-64 mx-auto" />
        </div>
      </div>
    </footer>
  );
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse min-h-screen flex flex-col">
      <HeaderSkeleton />
      <main className="flex-1">
        <HeroSkeleton />
        <CategoriesSkeleton />
        <ProductsSkeleton />
        <NewsletterSkeleton />
      </main>
      <FooterSkeleton />
    </div>
  );
}