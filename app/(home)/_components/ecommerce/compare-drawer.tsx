'use client';

import { X, Star, ShoppingCart, GitCompareArrows, Package } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { useCompareStore, useCartStore } from '../../_lib/store';
import { useAddToCart } from '../../_hooks/use-cart-queries';
import { GetImage } from '../../_lib/utils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';

function ComparisonRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="border-b border-ecommerce-border last:border-b-0"
    >
      <td className="py-3 px-3 text-xs font-semibold text-ecommerce-text-muted uppercase tracking-wider whitespace-nowrap w-24 align-top bg-ecommerce-surface-hover/40 dark:bg-[#252836]/40 rounded-s-lg">
        {label}
      </td>
      {children}
    </motion.tr>
  );
}

function ComparisonCell({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <td className="py-3 px-3 text-center align-middle">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="flex items-center justify-center"
      >
        {children}
      </motion.div>
    </td>
  );
}

export function CompareDrawer() {
  const { items, removeItem, clearAll, isCompareOpen, setCompareOpen } = useCompareStore();
  const addToCart = useAddToCart();
  const t = useTranslations();

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart.mutate({
      id: item.id,
      name: item.name,
      variant: item.variant,
      image: item.image,
      categories: item.categories,
    } as any);
    toast.success(t('homepage.cart.itemAdded', { name: item.name }), {
      description: `${CurrencyViewer(item.variant.sellPrice, CONFIG.DEFAULT_CURRENCY)}`,
      action: { label: t('homepage.common.addToCart'), onClick: () => useCartStore.getState().setCartOpen(true) },
    });
  };

  return (
    <Sheet open={isCompareOpen} onOpenChange={(v) => !v && setCompareOpen(false)}>
      <SheetContent
        side="bottom"
        className="h-[85vh] sm:max-w-full rounded-t-3xl border-t border-ecommerce-border bg-white dark:bg-ecommerce-surface p-0"
      >
        {/* Header */}
        <SheetHeader className="p-4 sm:p-6 pb-0 border-b border-ecommerce-border">
          <div className="flex items-center justify-between pe-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-ecommerce-purple/10 flex items-center justify-center">
                <GitCompareArrows size={16} className="text-ecommerce-purple" />
              </div>
              <SheetTitle className="text-base font-bold text-ecommerce-text-primary">
                {t('homepage.compare.title')}
              </SheetTitle>
              {items.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ecommerce-purple/10 text-ecommerce-purple">
                  {items.length}/4
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-8 px-3 text-xs text-ecommerce-text-muted hover:text-ecommerce-red hover:bg-ecommerce-red/5 rounded-lg"
                >
                  {t('homepage.compare.clearAll')}
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        {/* Content */}
        <ScrollArea className="flex-1 h-[calc(85vh-80px)]">
          <div className="p-4 sm:p-6">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-ecommerce-surface-hover dark:bg-[#252836] flex items-center justify-center mb-4">
                  <GitCompareArrows size={28} className="text-ecommerce-text-muted" />
                </div>
                <h3 className="text-sm font-semibold text-ecommerce-text-primary mb-1">{t('homepage.compare.empty')}</h3>
                <p className="text-xs text-ecommerce-text-muted max-w-[200px]">
                  {t('homepage.compare.emptyDesc')}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-x-auto"
              >
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="w-24" />
                      {items.map((item, i) => (
                        <th key={item.variant.id} className="relative p-3">
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex flex-col items-center gap-2"
                          >
                            <button
                              onClick={() => removeItem(item.id)}
                              className="absolute top-0 end-0 w-6 h-6 rounded-full bg-ecommerce-surface-hover dark:bg-[#252836] flex items-center justify-center hover:bg-ecommerce-red hover:text-white transition-colors text-ecommerce-text-muted"
                              aria-label={t('homepage.compare.remove')}
                            >
                              <X size={12} />
                            </button>
                            <img
                              src={GetImage(item.image, true)}
                              alt={item.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-ecommerce-border"
                            />
                          </motion.div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Name */}
                    <ComparisonRow label={t('homepage.compare.name')}>
                      {items.map((item, i) => (
                        <ComparisonCell key={item.variant.id} delay={i * 0.05}>
                          <span className="text-xs font-semibold text-ecommerce-text-primary text-center leading-tight max-w-[140px]">
                            {item.name}
                          </span>
                        </ComparisonCell>
                      ))}
                    </ComparisonRow>

                    {/* Price */}
                    <ComparisonRow label={t('homepage.compare.price')}>
                      {items.map((item, i) => (
                        <ComparisonCell key={item.variant.id} delay={i * 0.05}>
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-sm font-bold text-ecommerce-text-primary">
                              {CurrencyViewer(item.variant.sellPrice, CONFIG.DEFAULT_CURRENCY)}
                            </span>
                            {item.variant.oldSellPrice && item.variant.oldSellPrice > item.variant.sellPrice && (
                              <span className="text-[10px] text-ecommerce-text-muted line-through">
                                {CurrencyViewer(item.variant.oldSellPrice, CONFIG.DEFAULT_CURRENCY)}
                              </span>
                            )}
                          </div>
                        </ComparisonCell>
                      ))}
                    </ComparisonRow>

                    {/* Rating */}
                    <ComparisonRow label={t('homepage.compare.rating')}>
                      {items.map((item, i) => (
                        <ComparisonCell key={item.variant.id} delay={i * 0.05}>
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="flex items-center gap-px">
                              {Array.from({ length: 5 }).map((_, si) => (
                                <Star
                                  key={si}
                                  size={11}
                                  className={si < Math.floor(item.rating) ? 'fill-ecommerce-amber text-ecommerce-amber' : 'text-ecommerce-border'}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-ecommerce-text-muted">
                              {item.rating} ({item.reviewCount})
                            </span>
                          </div>
                        </ComparisonCell>
                      ))}
                    </ComparisonRow>

                    {/* Category */}
                    <ComparisonRow label={t('homepage.compare.category')}>
                      {items.map((item, i) => (
                        <ComparisonCell key={item.variant.id} delay={i * 0.05}>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ecommerce-text-secondary">
                            {item.categories?.[0]?.name || '—'}
                          </span>
                        </ComparisonCell>
                      ))}
                    </ComparisonRow>

                    {/* Stock */}
                    <ComparisonRow label={t('homepage.compare.stock')}>
                      {items.map((item, i) => (
                        <ComparisonCell key={item.variant.id} delay={i * 0.05}>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${item.stock === 0
                            ? 'bg-ecommerce-red/10 text-ecommerce-red'
                            : item.stock < 10
                              ? 'bg-ecommerce-amber/10 text-ecommerce-amber'
                              : 'bg-ecommerce-emerald/10 text-ecommerce-emerald'
                            }`}>
                            {item.stock === 0 ? t('homepage.common.outOfStock') : item.stock < 10 ? t('homepage.common.onlyLeft', { count: item.stock }) : t('homepage.common.inStock')}
                          </span>
                        </ComparisonCell>
                      ))}
                    </ComparisonRow>

                    {/* SKU */}
                    <ComparisonRow label={t('homepage.compare.sku')}>
                      {items.map((item, i) => (
                        <ComparisonCell key={item.variant.id} delay={i * 0.05}>
                          <span className="text-[11px] text-ecommerce-text-muted font-mono">
                            {item.variant.sku || (
                              <span className="flex items-center gap-1">
                                <Package size={10} />
                                N/A
                              </span>
                            )}
                          </span>
                        </ComparisonCell>
                      ))}
                    </ComparisonRow>

                    {/* Description */}
                    <ComparisonRow label={t('homepage.compare.description')}>
                      {items.map((item, i) => (
                        <ComparisonCell key={item.variant.id} delay={i * 0.05}>
                          <div
                            className="text-[11px] text-ecommerce-text-muted text-start max-w-[160px] line-clamp-4 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: item.description }}
                          />
                          <div />
                        </ComparisonCell>
                      ))}
                    </ComparisonRow>

                    {/* Add to Cart */}
                    <ComparisonRow label={t('homepage.quickView.quantity')}>
                      {items.map((item, i) => (
                        <ComparisonCell key={item.variant.id} delay={i * 0.05}>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                            disabled={item.stock === 0}
                            className="h-8 px-3 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-lg text-[11px] font-medium gap-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                          >
                            <ShoppingCart size={12} />
                            {t('homepage.compare.addToCart')}
                          </Button>
                        </ComparisonCell>
                      ))}
                    </ComparisonRow>
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}