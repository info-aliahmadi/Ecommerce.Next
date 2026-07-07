'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductCard } from './product-card';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import HomePageService from '../../_services/HomePageService';
import ProductDisplayModel from '../../_types/ProductDisplayModel';

function ProductCardWrapper({ product,key }: Readonly<{ product: ProductDisplayModel, key: number }>) {
  return (
    <ProductCard
      product={product}
      index={key}
    />
  );
}

export function FeaturedProducts() {
  const t = useTranslations();
  const { data: featuredProduct } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getFeaturedProducts();
      const data = result.succeeded ? result.data : undefined;
      return data;
    }
  });

  const featured = featuredProduct?.items;
  if (featured?.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-ecommerce-surface relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-ecommerce-amber/[0.02] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-ecommerce-red/[0.02] rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ecommerce-amber/10 text-ecommerce-amber text-xs font-semibold uppercase tracking-widest mb-3"
            >
              <Sparkles size={12} />
              {t('homepage.featuredProducts.handpicked')}
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ecommerce-text-primary tracking-tight">{t('homepage.featuredProducts.title')}</h2>
            <p className="text-sm text-ecommerce-text-muted mt-1">{t('homepage.featuredProducts.subtitle')}</p>
            {/* Decorative dot divider */}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-px w-8 bg-ecommerce-border" />
              <div className="h-1.5 w-1.5 rounded-full bg-ecommerce-amber" />
              <div className="h-px w-8 bg-ecommerce-border" />
            </div>
          </div>
          <Button
            asChild
            variant="ghost"
            className="hidden sm:flex text-ecommerce-red hover:text-ecommerce-red/80 hover:bg-ecommerce-red/5 rounded-xl gap-1.5"
          >
            <a href="#products">{t('homepage.common.viewAll')} <ArrowRight size={16} /></a>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured?.map((product) => (
            <ProductCardWrapper key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}