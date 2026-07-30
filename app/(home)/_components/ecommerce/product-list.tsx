'use client';

import { StarRating } from '../../_components/ui/star-rating';
import { ShoppingCart, Heart, Eye, GitCompareArrows, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useWishlistStore, useUIStore, useCompareStore } from '../../_lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useFlyToCart } from '../../_hooks/use-fly-to-cart';
import { useAddToWishlist, useRemoveFromWishlist } from '../../_hooks/use-wishlist-queries';
import { useTranslations } from 'next-intl';
import ProductDisplayModel, { getProductPricing } from '../../_types/Product/ProductDisplayModel';
import { GetImage } from '../../_lib/utils';
import Link from 'next/link';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';
import { useState, useRef, useEffect, useCallback } from 'react';

/* List View Product Card */

interface ProductListCardProps {
  product: ProductDisplayModel;
  index?: number;
}

export default function ProductListCard({ product, index = 0 }: Readonly<ProductListCardProps>) {
  const t = useTranslations();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { setQuickViewProduct } = useUIStore();
  const { addItem: addCompareItem, isInCompare } = useCompareStore();
  const { handleAddToCartWithAnimation } = useFlyToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const rating = product.approvedTotalReviews > 0 ? product.approvedRatingSum / product.approvedTotalReviews : 0;
  const { cheapestVariant, hasMultipleVariants, minSellPrice, maxSellPrice, totalStock } = getProductPricing(product.variants ?? []);
  const wishlisted = isInWishlist(cheapestVariant.id);
  const inCompare = isInCompare(cheapestVariant.id);
  const discount = cheapestVariant?.oldSellPrice ? Math.round(((cheapestVariant.oldSellPrice - cheapestVariant.sellPrice) / cheapestVariant.oldSellPrice) * 100) : 0;
  const savings = cheapestVariant?.oldSellPrice && cheapestVariant.oldSellPrice > cheapestVariant.sellPrice ? cheapestVariant.oldSellPrice - cheapestVariant.sellPrice : 0;

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [isTilting, setIsTilting] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);
  const isDesktopRef = useRef(false);

  useEffect(() => {
    isDesktopRef.current = window.matchMedia('(hover: hover)').matches;
  }, []);

  const handleTiltMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktopRef.current || !tiltRef.current) return;
    const card = tiltRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = ((centerY - y) / centerY) * 5;
    const mouseXPct = (x / rect.width) * 100;
    const mouseYPct = (y / rect.height) * 100;

    setTiltStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      '--mouse-x': `${mouseXPct}%`,
      '--mouse-y': `${mouseYPct}%`,
    } as React.CSSProperties);
    setIsTilting(true);
  }, []);

  const handleTiltLeave = useCallback(() => {
    setIsTilting(false);
    setTiltStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
    });
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    if (!cheapestVariant) return;
    handleAddToCartWithAnimation(e, GetImage(product.imagePreview), {
      id: product.id,
      name: product.name,
      variant: cheapestVariant,
      image: product.imagePreview,
      categories: product.categories || [],
      quantity: 1
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist.mutate({ variantId: cheapestVariant.id });
    } else {
      addToWishlist.mutate({
        id: product.id,
        name: product.name,
        variant: cheapestVariant,
        image: product.imagePreview,
        categories: product.categories || [],
      });
    }
    toast.success(wishlisted ? t('homepage.common.removeFromWishlist') : t('homepage.common.addToWishlist'));
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 600);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      addCompareItem({
        id: product.id,
        name: product.name,
        variant: cheapestVariant,
        image: product.imagePreview,
        rating: rating,
        reviewCount: product.approvedTotalReviews,
        categories: product.categories || [],
        stock: product.stockQuantity || 0,
        description: product.fullDescription || ''
      });
      toast.success(t('homepage.compare.remove'));
    } else {
      if (useCompareStore.getState().items.length >= 4) {
        toast.warning(t('homepage.compare.maxWarning'));
        return;
      }
      addCompareItem({
        id: product.id,
        name: product.name,
        variant: cheapestVariant,
        image: product.imagePreview,
        rating: rating,
        reviewCount: product.approvedTotalReviews,
        categories: product.categories || [],
        stock: product.stockQuantity || 0,
        description: product.fullDescription || ''
      });
      toast.success(t('homepage.common.compare'));
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <Link key={"pdiv-" + product.id} href={`/products/${product.id}`} className="block">
      <div
        ref={tiltRef}
        onMouseMove={handleTiltMove}
        onMouseLeave={handleTiltLeave}
        className={`tilt-card spotlight-glow rounded-2xl ${isTilting ? '' : 'tilt-reset'}`}
        style={{
          '--glow-color': product.categories?.[0]?.color || '#ccc',
          ...tiltStyle,
        } as React.CSSProperties}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
          className="group relative bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border overflow-hidden card-lift category-glow"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative w-full sm:w-48 lg:w-56 aspect-square sm:aspect-auto shrink-0 overflow-hidden bg-ecommerce-surface-hover dark:bg-[#252836]">
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-muted shimmer" />
              )}
              <img
                src={GetImage(product.imagePreview, true)}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsImageLoaded(true)}
                loading="lazy"
              />
              {discount > 0 && (
                <Badge className="absolute top-2.5 start-2.5 bg-ecommerce-red text-white border-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  {t('homepage.common.off', { percent: discount })}
                </Badge>
              )}
              {product.markAsNew && (
                <Badge className="absolute top-2.5 start-2.5 bg-ecommerce-teal text-white border-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  {t('homepage.common.newBadge')}
                </Badge>
              )}
              {/* Stock indicator */}
              {totalStock === 0 ? (
                <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                  <span className="text-sm font-bold text-white bg-black/60 px-4 py-2 rounded-xl">{t('homepage.common.outOfStock')}</span>
                </div>
              ) : totalStock < 10 ? (
                <div className="absolute bottom-2.5 start-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-ecommerce-amber/90 text-white">{t('homepage.common.onlyLeft', { count: totalStock })}</span>
                </div>
              ) : null}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    {product.categories?.map(category => category &&
                      (<span key={"cat-" + category.key}>
                        {category && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />}
                        {category && <span className="text-[11px] font-medium text-ecommerce-text-muted uppercase tracking-wider">{category.name}</span>}
                      </span>))}
                    {product.sku && <span className="text-[10px] text-ecommerce-text-muted ms-auto sm:ms-2">{t('homepage.common.sku')}: {product.sku}</span>}
                  </div>
                  <h3 className="font-semibold text-base text-ecommerce-text-primary line-clamp-1 group-hover:text-ecommerce-red transition-colors">{product.name}</h3>
                  {product.shortDescription && <p className="text-xs text-ecommerce-text-muted mt-1 line-clamp-2">{product.shortDescription}</p>}
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-3">
                <div className="flex items-center gap-px">
                  <StarRating rating={rating} size={12} />
                </div>
                <span className="text-xs text-ecommerce-text-muted">{rating.toFixed(1)} ({product.approvedTotalReviews})</span>
              </div>

              {/* Tags */}
              {product.productTags && product.productTags.length > 0 && (
                <div className="flex gap-1.5 mt-3">
                  {product.productTags.slice(0, 3).map(tag => (
                    <span key={"tag-" + tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-ecommerce-surface-hover text-ecommerce-text-muted capitalize">{tag}</span>
                  ))}
                </div>
              )}

              {/* Bottom: Price + Actions */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-ecommerce-border mt-4">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-baseline gap-1.5">
                    {hasMultipleVariants ? (
                      <span className="text-base sm:text-lg font-bold text-ecommerce-text-primary">
                        {CurrencyViewer(minSellPrice, CONFIG.DEFAULT_CURRENCY)} - {CurrencyViewer(maxSellPrice, CONFIG.DEFAULT_CURRENCY)}
                      </span>
                    ) : (
                      <>
                        <span className="text-base sm:text-lg font-bold text-ecommerce-text-primary">{CurrencyViewer(minSellPrice, CONFIG.DEFAULT_CURRENCY)}</span>
                        {cheapestVariant && cheapestVariant.oldSellPrice > 0 && cheapestVariant.oldSellPrice > cheapestVariant.sellPrice && (
                          <span className="text-xs text-ecommerce-text-muted line-through">{CurrencyViewer(cheapestVariant.oldSellPrice, CONFIG.DEFAULT_CURRENCY)}</span>
                        )}
                      </>
                    )}
                  </div>
                  {!hasMultipleVariants && savings > 0 && (
                    <span className="text-ecommerce-emerald text-[10px] font-medium">{t('homepage.common.saveAmount', { amount: CurrencyViewer(savings, CONFIG.DEFAULT_CURRENCY) })}</span>
                  )}
                  {hasMultipleVariants && (() => {
                    const maxSavings = (product.variants ?? []).filter(v => (v.productInventory?.stockQuantity ?? 0) > 0).reduce((max, v) => {
                      const s = v.oldSellPrice > v.sellPrice ? v.oldSellPrice - v.sellPrice : 0;
                      return s > max ? s : max;
                    }, 0);
                    return maxSavings > 0 ? (
                      <span className="text-ecommerce-emerald text-[10px] font-medium">{t('homepage.common.saveFrom', { amount: CurrencyViewer(maxSavings, CONFIG.DEFAULT_CURRENCY) })}</span>
                    ) : null;
                  })()}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCompare}
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${inCompare ? 'bg-ecommerce-teal/5 border-ecommerce-teal/30 text-ecommerce-teal' : 'border-ecommerce-border hover:bg-ecommerce-teal hover:text-white hover:border-ecommerce-teal'}`}
                    aria-label={inCompare ? t('homepage.compare.remove') : t('homepage.common.compare')}
                  >
                    <GitCompareArrows size={14} />
                  </button>
                  <button
                    onClick={handleQuickView}
                    className="w-9 h-9 rounded-lg border border-ecommerce-border flex items-center justify-center hover:bg-ecommerce-purple hover:text-white hover:border-ecommerce-purple transition-all"
                    aria-label={t('homepage.common.quickView')}
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${wishlisted ? 'bg-ecommerce-red/5 border-ecommerce-red/30 text-ecommerce-red' : 'border-ecommerce-border hover:bg-ecommerce-rose hover:text-white hover:border-ecommerce-rose'}`}
                    aria-label={wishlisted ? t('homepage.common.removeFromWishlist') : t('homepage.common.addToWishlist')}
                  >
                    <div className="relative">
                      <AnimatePresence>
                        {heartBurst && wishlisted && (
                          <motion.div
                            key="heart-burst"
                            initial={{ scale: 0.5, opacity: 1 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="absolute inset-0 rounded-lg bg-ecommerce-rose/30 pointer-events-none"
                          />
                        )}
                      </AnimatePresence>
                      <Heart size={14} className={`transition-colors duration-200 ${wishlisted ? 'fill-ecommerce-red text-ecommerce-red' : ''} ${heartBurst && wishlisted ? 'scale-125' : ''}`} />
                    </div>
                  </button>
                  <Button
                    onClick={handleAddToCart}
                    size="sm"
                    disabled={totalStock === 0}
                    className={`h-9 px-4 rounded-lg text-xs font-medium gap-1.5 transition-all duration-300 active:scale-95 ripple disabled:opacity-50 ${justAdded ? 'bg-ecommerce-emerald hover:bg-ecommerce-emerald text-white scale-105' : 'bg-ecommerce-red hover:bg-ecommerce-red/90 text-white hover:scale-105'}`}
                  >
                    {justAdded ? <Check size={13} /> : <ShoppingCart size={13} />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Link>
  );
}
