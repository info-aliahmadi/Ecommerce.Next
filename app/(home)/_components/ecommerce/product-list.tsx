'use client';

import { Star, ShoppingCart, Heart, Eye, GitCompareArrows, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useWishlistStore, useUIStore, useCompareStore } from '../../_lib/store';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useFlyToCart } from '../../_hooks/use-fly-to-cart';
import { useTranslations } from 'next-intl';
import ProductDisplayModel from '../../_types/ProductDisplayModel';
import { GetImage } from '../../_lib/utils';
import Link from 'next/link';

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

  const rating = product.approvedTotalReviews > 0 ? product.approvedRatingSum / product.approvedTotalReviews : 0;
  const wishlisted = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const discount = product.oldSellUnitPrice ? Math.round(((product.oldSellUnitPrice - product.sellUnitPrice) / product.oldSellUnitPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    handleAddToCartWithAnimation(e, GetImage(product.imagePreview), {
      id: product.id,
      name: product.name,
      price: product.sellUnitPrice,
      comparePrice: product.oldSellUnitPrice,
      image: product.imagePreview,
      categories: product.categories || [],
      quantity: 1
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.sellUnitPrice,
      comparePrice: product.oldSellUnitPrice,
      image: product.imagePreview,
      categories: product.categories || [],
    });
    toast.success(wishlisted ? t('homepage.common.removeFromWishlist') : t('homepage.common.addToWishlist'));
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
        image: product.imagePreview,
        rating: rating,
        reviewCount: product.approvedTotalReviews,
        categories: product.categories || [],
        stock: product.stockQuantity || 0,
        description: product.fullDescription || '',
        sku: product.sku || '',
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
        price: product.sellUnitPrice,
        comparePrice: product.oldSellUnitPrice,
        image: product.imagePreview,
        rating: rating,
        reviewCount: product.approvedTotalReviews,
        categories: product.categories || [],
        stock: product.stockQuantity || 0,
        description: product.fullDescription || '',
        sku: product.sku || '',
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
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.03 }}
        className="group relative bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border overflow-hidden card-lift"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-48 lg:w-56 aspect-square sm:aspect-auto shrink-0 overflow-hidden bg-ecommerce-surface-hover dark:bg-[#252836]">
            <img
              src={GetImage(product.imagePreview, true)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
            {product.stockQuantity === 0 ? (
              <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                <span className="text-sm font-bold text-white bg-black/60 px-4 py-2 rounded-xl">{t('homepage.common.outOfStock')}</span>
              </div>
            ) : product.stockQuantity < 10 ? (
              <div className="absolute bottom-2.5 start-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-ecommerce-amber/90 text-white">{t('homepage.common.onlyLeft', { count: product.stockQuantity })}</span>
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

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-3">
              <div className="flex items-center gap-px">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={"star-" + i} size={12} className={i < Math.floor(rating) ? 'fill-ecommerce-amber text-ecommerce-amber' : 'text-ecommerce-border'} />
                ))}
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
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-ecommerce-text-primary">{CurrencyViewer(product.sellUnitPrice,CONFIG.DEFAULT_CURRENCY)}</span>
                {product.oldSellUnitPrice && product.oldSellUnitPrice > product.sellUnitPrice && (
                  <span className="text-sm text-ecommerce-text-muted line-through">{CurrencyViewer(product.oldSellUnitPrice,CONFIG.DEFAULT_CURRENCY)}</span>
                )}
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
                  <Heart size={14} className={wishlisted ? 'fill-ecommerce-red' : ''} />
                </button>
                <Button
                  onClick={handleAddToCart}
                  size="sm"
                  disabled={product.stockQuantity === 0}
                  className="h-9 px-4 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-lg text-xs font-medium gap-1.5 transition-all hover:scale-105 active:scale-95 ripple disabled:opacity-50"
                >
                  <ShoppingCart size={13} />
                  {/* {t('homepage.common.addToCart')} */}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
