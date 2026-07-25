'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Sparkles, Percent } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useCartStore } from '../../_lib/store';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import ProductDisplayModel, { getProductPricing } from '../../_types/Product/ProductDisplayModel';
import HomePageService from '../../_services/HomePageService';
import { useQuery } from '@tanstack/react-query';
import BundleDisplayModel from '../../_types/BundleDisplayModel';
import { GetImage } from '../../_lib/utils';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';



function getBundleSavings(products: ProductDisplayModel[]) {
  const pricings = products.map(p => getProductPricing(p.variants ?? []));
  const totalPrice = pricings.reduce((s, p) => s + (p.cheapestVariant?.sellPrice ?? 0), 0);
  const compareTotal = pricings.reduce((s, p) => s + (p.cheapestVariant?.oldSellPrice ?? p.cheapestVariant?.sellPrice ?? 0), 0);
  const savings = compareTotal - totalPrice;
  const percentage = compareTotal > 0 ? Math.round((savings / compareTotal) * 100) : 0;
  return { totalPrice, compareTotal, savings, percentage };
}

export function ProductBundles() {
  const t = useTranslations();
  const addItem = useCartStore((s) => s.addItem);

  const { data: bundles } = useQuery({
    queryKey: ['products', 'bundles'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getBundles();
      const data = result.succeeded ? result.data : undefined;
      return data;
    }
  });


  const handleAddBundle = (bundle: BundleDisplayModel) => {
    bundle.products?.forEach((p) => {
      const { cheapestVariant } = getProductPricing(p.variants ?? []);
      if (!cheapestVariant || cheapestVariant.productInventory.stockQuantity === 0) return;
      addItem({
        id: p.id,
        name: p.name,
        variant: cheapestVariant,
        image: p.imagePreview,
        categories: p.categories,
      });
    });
    toast.success(t('homepage.cart.itemAdded', { name: bundle.name }), {
      description: t('homepage.bundles.itemsAtSpecialPrice', { count: bundle.products?.length ?? 0 }),
    });
  };

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ecommerce-amber/10 text-ecommerce-amber text-xs font-semibold mb-4">
            <Sparkles size={14} />
            {t('homepage.bundles.curated')}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-ecommerce-text-primary">
            {t('homepage.bundles.title').split('homepage. ').slice(0, -1).join(' ')} <span className="gradient-text">{t('homepage.bundles.title').split('homepage. ').slice(-1)}</span>
          </h2>
          <p className="text-ecommerce-text-secondary mt-2 text-sm md:text-base max-w-lg mx-auto">
            {t('homepage.bundles.subtitleFull')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles?.map((bundle, idx) => {
            const { totalPrice, compareTotal, savings, percentage } = getBundleSavings(bundle.products ?? []);
            return (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group"
              >
                <div className="animated-border h-full">
                  <div className="relative bg-ecommerce-surface dark:bg-ecommerce-surface rounded-[calc(1rem-2px)] h-full flex flex-col overflow-hidden">
                    {/* Savings badge */}
                    <div className="absolute top-3 end-3 z-10">
                      <Badge className="bg-ecommerce-red text-white text-[10px] font-bold px-2 py-0.5 hover:bg-ecommerce-red gap-1">
                        <Percent size={10} />
                        {t('homepage.bundles.save', { percent: percentage })}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-ecommerce-text-primary text-base mb-1 pe-16">
                        {bundle.name}
                      </h3>
                      <p className="text-xs text-ecommerce-text-muted mb-4">
                        {bundle.description}
                      </p>

                      {/* Product thumbnails */}
                      <div className="flex-1 space-y-3">
                        {bundle.products?.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center gap-3 p-2 rounded-xl bg-ecommerce-surface-hover/60 hover:bg-ecommerce-surface-hover transition-colors"
                          >
                            <img
                              src={GetImage(product.imagePreview)}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover shrink-0"
                            />
                            {(() => {
                              const { cheapestVariant } = getProductPricing(product.variants ?? []);
                              return (
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-ecommerce-text-primary truncate">
                                    {product.name}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-ecommerce-red">
                                      {CurrencyViewer(cheapestVariant?.sellPrice ?? 0, CONFIG.DEFAULT_CURRENCY)}
                                    </span>
                                    {cheapestVariant && cheapestVariant.oldSellPrice != 0 && (
                                      <span className="text-[11px] text-ecommerce-text-muted line-through">
                                        {CurrencyViewer(cheapestVariant.oldSellPrice, CONFIG.DEFAULT_CURRENCY)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        ))}
                      </div>

                      {/* Price & CTA */}
                      <div className="mt-5 pt-4 border-t border-ecommerce-border">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs text-ecommerce-text-muted">{t('homepage.bundles.bundlePrice')}</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-ecommerce-text-primary">
                                { CurrencyViewer(totalPrice, CONFIG.DEFAULT_CURRENCY)}
                              </span>
                              <span className="text-sm text-ecommerce-text-muted line-through">
                                {CurrencyViewer(compareTotal, CONFIG.DEFAULT_CURRENCY)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-ecommerce-emerald font-semibold">
                              {t('homepage.bundles.youSave', { amount: CurrencyViewer(savings, CONFIG.DEFAULT_CURRENCY) })}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleAddBundle(bundle)}
                          className="w-full btn-shine bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl h-11 gap-2 font-semibold"
                        >
                          <ShoppingCart size={16} />
                          {t('homepage.bundles.addToCart')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}