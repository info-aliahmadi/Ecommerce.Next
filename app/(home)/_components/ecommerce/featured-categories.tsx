'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCategoryTranslations } from '../../_lib/category-translations';
import HomePageService from '../../_services/HomePageService';
import CONFIG from '@root/config';

export function FeaturedCategories() {
  const catTrans = useCategoryTranslations();
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getAllCategories();
      const items = result.succeeded ? result.data : [];
      return items;
    },
  });

  const featured = categories;//.filter((c: { featured: boolean }) => c.featured);

  return (
    <section id="categories" className="py-12 sm:py-16 relative overflow-hidden">
      {/* Subtle background orbs */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-ecommerce-red/[0.02] rounded-full -translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-ecommerce-purple/[0.02] rounded-full translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ecommerce-red/10 text-ecommerce-red text-xs font-semibold uppercase tracking-widest mb-3"
          >
            <Layers size={12} />
            Browse
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ecommerce-text-primary tracking-tight">
            Shop by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-sm text-ecommerce-text-muted mt-3 max-w-md mx-auto">
            Find exactly what you&apos;re looking for in our curated collections
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-ecommerce-border" />
            <div className="h-1.5 w-1.5 rounded-full bg-ecommerce-red" />
            <div className="h-px w-8 bg-ecommerce-border" />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {featured.map((cat, index: number) => (
            <motion.div
              key={"cat-" + cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                href={`/products?category=${cat.key}`}
                className="group block relative rounded-2xl overflow-hidden aspect-[4/3] bg-ecommerce-surface-hover dark:bg-[#252836]"
              >
                <img
                  src={cat.imagePreview ? CONFIG.API_BASEPATH + cat.imagePreview?.thumbnailPath : CONFIG.UNKNOWN_IMAGE_BASEPATH}
                  alt={catTrans[cat.name] || cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Color accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
                  style={{ backgroundColor: cat.color }}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm sm:text-base">{catTrans[cat.name] || cat.name}</h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-white/60 text-xs">{cat.productsCount || 0} items</span>
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:translate-x-0.5">
                      <ArrowRight size={13} className="text-white/70 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Hover border glow */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}