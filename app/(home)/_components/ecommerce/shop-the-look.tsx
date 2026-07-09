'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingCart, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ProductDisplayModel from '../../_types/ProductDisplayModel';
import { GetImage } from '../../_lib/utils';
import CuratedStyleProductModel from '../../_types/CuratedStyleProductModel';
import { useQuery } from '@tanstack/react-query';
import HomePageService from '../../_services/HomePageService';
import Link from 'next/link';
import { useUIStore } from '../../_lib/store';

function ProductThumbnails({ products }: { products: ProductDisplayModel[] }) {
  const t = useTranslations();
  const setQuickViewProduct = useUIStore((s) => s.setQuickViewProduct);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const visibleProducts = products.slice(0, 3);
  const extraCount = products.length - 3;


  return (
    <div className="flex items-center">
      <div className="flex items-center" style={{ marginInlineStart: '-12px' }}>
        {visibleProducts.map((product, i) => (
          <button
            key={product.id}
            onClick={() =>
              setQuickViewProduct(product)
            }
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative shrink-0 w-14 h-14 rounded-full border-2 border-white shadow-md transition-transform duration-200 hover:scale-110 hover:z-10"
            style={{ marginInlineStart: i === 0 ? '12px' : '-12px' }}
            aria-label={`View ${product.name}`}
          >
            <img
              src={GetImage(product.imagePreview, true)}
              alt={product.name}
              className="w-full h-full rounded-full object-cover"
              loading="lazy"
            />
            {hoveredIndex === i && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full transition-opacity">
                <Plus size={16} className="text-white" />
              </span>
            )}
          </button>
        ))}
      </div>
      {extraCount > 0 && (
        <span className="ms-3 text-xs font-medium text-ecommerce-text-muted">
          +{extraCount} {t('homepage.common.seeMore').toLowerCase()}
        </span>
      )}
    </div>
  );
}

function LookCard({
  look,
  index,
  isFirst,
}: Readonly<{
  look: CuratedStyleProductModel;
  index: number;
  isFirst: boolean;
}>) {
  const t = useTranslations();
  const totalPrice = look.products.reduce((sum, p) => sum + p.sellUnitPrice, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="scroll-reveal group relative bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={GetImage(look.imagePreview)}
          alt={look.attributeName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-3 end-3 px-3 py-1 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm text-xs font-bold text-ecommerce-text-primary">
          {t('homepage.shopTheLook.from')} ${Math.round(totalPrice)}
        </span>
        <h3 className="absolute bottom-3 start-3 text-lg font-bold text-white drop-shadow-lg">
          {look.attributeName}
        </h3>
      </div>

      {/* Card content */}
      <div className="p-4 sm:p-5">
        <p className="text-sm text-ecommerce-text-muted mb-4">
          {t('homepage.shopTheLook.piecesDesc', { count: look.products.length })}
        </p>
        <div className="flex items-center justify-between gap-3">
          <ProductThumbnails products={look.products} />
          <Link
            href={`/products?attributeid=${look.attributeId}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shrink-0"
          >
            <ShoppingCart size={15} />
            {t('homepage.shopTheLook.getTheLook')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function ShopTheLook() {
  const t = useTranslations();


  const { data: looks, isLoading } = useQuery({
    queryKey: ['products', 'curatedstyle'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getCuratedStyleProducts();
      const data = result.succeeded ? result.data : undefined;
      return data;
    }
  });

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-ecommerce-surface relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-ecommerce-rose/10 rounded-full -translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-ecommerce-purple/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ecommerce-rose/10 text-ecommerce-rose text-xs font-semibold uppercase tracking-widest mb-3"
          >
            <Sparkles size={12} />
            {t('homepage.shopTheLook.curated')}
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ecommerce-text-primary tracking-tight">
            {t('homepage.shopTheLook.title')}
          </h2>
          <p className="text-sm text-ecommerce-text-muted mt-2 max-w-md mx-auto">
            {t('homepage.shopTheLook.subtitle')}
          </p>
          {/* Decorative dot-line divider */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-ecommerce-border" />
            <div className="h-1.5 w-1.5 rounded-full bg-ecommerce-rose" />
            <div className="h-px w-8 bg-ecommerce-border" />
          </div>
        </div>

        {/* Look Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="w-64 sm:w-72 shrink-0 snap-start bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border overflow-hidden"
              >
                <div className="aspect-[4/5] bg-muted shimmer" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-16 bg-muted rounded shimmer" />
                  <div className="h-4 w-full bg-muted rounded shimmer" />
                  <div className="h-3 w-20 bg-muted rounded shimmer" />
                </div>
              </div>
            ))
            : looks?.map((look, index) => (
              <LookCard
                key={look.attributeId}
                look={look}
                index={index}
                isFirst={index === 0}
              />
            ))}
        </div>
      </div>
    </section>
  );
}