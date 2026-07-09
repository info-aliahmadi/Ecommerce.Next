'use client';

import { Star, ShoppingCart, Heart, Eye, GitCompareArrows, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useWishlistStore, useUIStore, useCompareStore } from '../../_lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useFlyToCart } from '../../_hooks/use-fly-to-cart';
import { useTranslations } from 'next-intl';
import { useCategoryTranslations } from '../../_lib/category-translations';
import ProductDisplayModel from '../../_types/ProductDisplayModel';
import { GetImage } from '../../_lib/utils';
import CartItem from '../../_types/CartItem';
import WishlistItem from '../../_types/WishlistItem';
import CompareItem from '../../_types/CompareItem';

interface ProductCardProps {
  product: ProductDisplayModel;
  index?: number;
}

export function ProductCard({ product, index = 0 }: Readonly<ProductCardProps>) {
  const category = product.categories?.[0];
  // make a method to get the image url from the product object, if the product has a thumbnailPath, use that, otherwise use the fullPath, if neither exists, use a placeholder image
  const image = GetImage(product.imagePreview , true);
  const rating = product.approvedTotalReviews > 0 ? product.approvedRatingSum / product.approvedTotalReviews : 0;

  const t = useTranslations();
  const catTrans = useCategoryTranslations();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { setQuickViewProduct } = useUIStore();
  const { addItem: addCompareItem, isInCompare } = useCompareStore();
  const { handleAddToCartWithAnimation } = useFlyToCart();
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

  const wishlisted = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const discount = product.oldSellUnitPrice ? Math.round(((product.oldSellUnitPrice - product.sellUnitPrice) / product.oldSellUnitPrice) * 100) : 0;
  const savings = product.oldSellUnitPrice && product.oldSellUnitPrice > product.sellUnitPrice ? product.oldSellUnitPrice - product.sellUnitPrice : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    handleAddToCartWithAnimation(e,GetImage(product.imagePreview), {
      id: product.id,
      name: product.name,
      price: product.sellUnitPrice,
      comparePrice: product.oldSellUnitPrice,
      image: product.imagePreview,
      categories: product.categories || [],
    } as CartItem);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.sellUnitPrice,
      comparePrice: product.oldSellUnitPrice,
      image: image,
      categories: product.categories || [],
    } as WishlistItem);
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
        price: product.sellUnitPrice,
        comparePrice: product.oldSellUnitPrice,
        image: image,
        rating: rating,
        reviewCount: product.approvedTotalReviews,
        categories: product.categories || [],
        stock: product.stockQuantity || 0,
        description: product.fullDescription || '',
        sku: product.sku || ''
      } as CompareItem);
      toast.success(t('homepage.compare.remove'));
    } else {
      if (useCompareStore.getState().items.length >= 4) {
        toast.warning(t('homepage.compare.maxWarning'));
        return;
      }
      addCompareItem({
        id: product.id,
        name: product.name,
        price: product.sellUnitPrice,
        comparePrice: product.oldSellUnitPrice,
        image: image,
        rating: rating,
        reviewCount: product.approvedTotalReviews,
        categories: product.categories || [],
        stock: product.stockQuantity || 0,
        description: product.fullDescription || '',
        sku: product.sku || ''
      } as CompareItem);
      toast.success(t('homepage.common.compare'));
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      ref={tiltRef}
      onMouseMove={handleTiltMove}
      onMouseLeave={handleTiltLeave}
      className={`tilt-card spotlight-glow rounded-2xl ${isTilting ? '' : 'tilt-reset'}`}
      style={{
        '--glow-color': category?.color || '#ccc',
        ...tiltStyle,
      } as React.CSSProperties}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group relative bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border ring-1 ring-ecommerce-border/50 card-lift category-glow overflow-hidden scroll-reveal group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-ecommerce-surface-hover dark:bg-[#252836]">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-muted shimmer" />
          )}
          <img
            src={image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 hover:brightness-110 image-zoom ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
          />

          {/* Glassmorphism gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Overlay Actions - Glass style */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
            <div className="flex gap-2 glass rounded-xl p-1.5 shadow-lg">
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
                <button
                  onClick={handleWishlist}
                  className={`w-9 h-9 rounded-lg bg-white/80 dark:bg-ecommerce-surface/80 flex items-center justify-center hover:scale-110 transition-transform duration-200 hover:bg-ecommerce-red hover:text-white ${heartBurst && wishlisted ? 'scale-125' : ''}`}
                  aria-label={wishlisted ? t('homepage.common.removeFromWishlist') : t('homepage.common.addToWishlist')}
                >
                  <Heart size={15} className={`transition-colors duration-200 ${wishlisted ? 'fill-ecommerce-red text-ecommerce-red' : 'text-ecommerce-text-secondary'}`} />
                </button>
              </div>
              <button
                onClick={handleCompare}
                className={`w-9 h-9 rounded-lg bg-white/80 dark:bg-ecommerce-surface/80 flex items-center justify-center hover:scale-110 transition-all ${inCompare ? 'bg-ecommerce-teal/10 dark:bg-ecommerce-teal/10' : 'hover:bg-ecommerce-teal hover:text-white'}`}
                aria-label={inCompare ? t('homepage.compare.remove') : t('homepage.common.compare')}
              >
                <GitCompareArrows size={15} className={inCompare ? 'text-ecommerce-teal' : 'text-ecommerce-text-secondary'} />
              </button>
              <button
                onClick={handleQuickView}
                className="w-9 h-9 rounded-lg bg-white/80 dark:bg-ecommerce-surface/80 flex items-center justify-center hover:scale-110 transition-all hover:bg-ecommerce-purple hover:text-white"
                aria-label={t('homepage.common.quickView')}
              >
                <Eye size={15} className="text-ecommerce-text-secondary" />
              </button>
              <button
                onClick={handleAddToCart}
                className="w-9 h-9 rounded-lg bg-white/80 dark:bg-ecommerce-surface/80 flex items-center justify-center hover:scale-110 transition-all hover:bg-ecommerce-red hover:text-white sm:hidden"
                aria-label={t('homepage.common.addToCart')}
              >
                <ShoppingCart size={15} />
              </button>
            </div>
          </div>

          {/* Stock indicator */}
          {product.stockQuantity != null && product.stockQuantity < 10 && product.stockQuantity > 0 && (
            <div className="absolute bottom-2.5 start-2.5 z-10">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-ecommerce-amber/90 text-white shadow-sm">
                {t('homepage.common.onlyLeft', { count: product.stockQuantity })}
              </span>
            </div>
          )}
          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
              <span className="text-sm font-bold text-white bg-black/60 px-4 py-2 rounded-xl">{t('homepage.common.outOfStock')}</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 start-2.5 flex flex-col gap-1">
            {discount > 0 && (
              <Badge className="bg-gradient-to-r from-ecommerce-red to-rose-500 text-white border-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                {t('homepage.common.off', { percent: discount })}
              </Badge>
            )}
            {product.markAsNew && (
              <Badge className="bg-ecommerce-teal text-white border-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                {t('homepage.common.newBadge')}
              </Badge>
            )}
            {product.productTags?.some(tag => tag.toLowerCase() === 'trending') && (
              <Badge className="bg-ecommerce-amber text-ecommerce-text-primary border-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                {t('homepage.common.trendingBadge')}
              </Badge>
            )}
            {product.productTags?.some(tag => tag.toLowerCase() === 'bestseller') && (
              <Badge className="bg-ecommerce-purple text-white border-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                {t('homepage.common.bestBadge')}
              </Badge>
            )}
          </div>

          {/* Quick add on image hover (desktop) */}
          <motion.div
            className="absolute bottom-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block"
            whileTap={{ scale: 0.9 }}
          >
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full bg-ecommerce-red text-white shadow-lg shadow-ecommerce-red/30 flex items-center justify-center hover:bg-ecommerce-red/90 transition-colors hover:scale-110"
              aria-label={t('homepage.common.addToCart')}
            >
              <ShoppingCart size={16} />
            </button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-3.5 sm:p-4">
          {/* Category */}
          {product.categories?.map(category => category && (
            <div key={category.id} className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color || '#ccc' }} />
              <span className="text-[11px] font-medium text-ecommerce-text-muted uppercase tracking-wider">{catTrans[category.name] || category.name}</span>
            </div>
          ))}

          {/* Name */}
          <h3 className="font-semibold text-sm text-ecommerce-text-primary line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-ecommerce-red transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-xs text-ecommerce-text-muted mt-1 truncate">{product.shortDescription}</p>
          )}

          {/* Rating with animated stars */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-px">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={`transition-transform duration-300 ${i < Math.floor(rating) ? 'fill-ecommerce-amber text-ecommerce-amber star-twinkle' : 'text-ecommerce-border'}`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-[11px] text-ecommerce-text-muted">{rating.toFixed(1)}</span>
            <span className="text-[11px] text-ecommerce-text-muted">({product.approvedTotalReviews})</span>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-ecommerce-border">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-bold text-ecommerce-text-primary">${product.sellUnitPrice.toFixed(2)}</span>
                {product.oldSellUnitPrice && product.oldSellUnitPrice > product.sellUnitPrice && (
                  <span className="text-xs text-ecommerce-text-muted line-through">${product.oldSellUnitPrice.toFixed(2)}</span>
                )}
              </div>
              {savings > 0 && (
                <span className="text-ecommerce-emerald text-[10px] font-medium">{t('homepage.common.saveAmount', { amount: savings.toFixed(2) })}</span>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className={`h-8 px-2.5 sm:px-3 rounded-lg text-xs font-medium gap-1.5 transition-all duration-300 active:scale-95 ripple btn-shine ${justAdded ? 'bg-ecommerce-emerald hover:bg-ecommerce-emerald text-white scale-105' : 'bg-ecommerce-red hover:bg-ecommerce-red/90 text-white hover:scale-105'}`}
            >
              {justAdded ? <Check size={13} /> : <ShoppingCart size={13} />}
              <span className="hidden sm:inline">{justAdded ? t('homepage.quickView.added') : t('homepage.common.addToCart')}</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}