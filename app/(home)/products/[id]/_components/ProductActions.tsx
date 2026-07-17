'use client';

import { useCallback } from 'react';
import { Button } from '../../../_components/ui/button';
import { ShoppingCart, Zap, Heart, Share2, GitCompare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  useCartStore,
  useWishlistStore,
  useCompareStore,
} from '../../../_lib/store';
import { useFlyToCart } from '../../../_hooks/use-fly-to-cart';
import { GetImage } from '../../../_lib/utils';
import ProductDisplayModel, { getProductPricing } from '../../../_types/ProductDisplayModel';
import ProductVariantDisplayModel from '../../../_types/ProductVariantDisplayModel';

export default function ProductActions({
  product,
  selectedVariant,
}: {
  product: ProductDisplayModel;
  selectedVariant?: ProductVariantDisplayModel | null;
}) {
  const t = useTranslations('');
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addItem: addCompareItem } = useCompareStore();
  const { handleAddToCartWithAnimation } = useFlyToCart();

  const wishlisted = isInWishlist(product.id);
  const { cheapestVariant, totalStock } = getProductPricing(product.variants ?? []);
  const activeVariant = selectedVariant ?? cheapestVariant;

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      if (!activeVariant) return;
      handleAddToCartWithAnimation(e, GetImage(product.imagePreview), {
        id: product.id,
        name: product.name,
        variant: activeVariant,
        image: product.imagePreview,
        categories: product.categories,
        quantity: 1
      });
    },
    [product, handleAddToCartWithAnimation, activeVariant],
  );

  const handleBuyNow = useCallback(() => {
    if (!activeVariant) return;
    addItem({
      id: product.id,
      name: product.name,
      variant: activeVariant,
      image: product.imagePreview,
      categories: product.categories
    });
    setCartOpen(true);
  }, [product, addItem, setCartOpen, activeVariant]);

  const handleWishlist = useCallback(() => {
    toggleItem({
      id: product.id,
      name: product.name,
      price: activeVariant?.sellPrice ?? 0,
      comparePrice: activeVariant?.oldSellPrice || undefined,
      image: product.imagePreview,
      categories: product.categories
    });
    toast.success(
      wishlisted ? t('homepage.productDetail.removeFromWishlistSuccess') : t('homepage.productDetail.addToWishlistSuccess'),
    );
  }, [product, toggleItem, wishlisted, t, activeVariant]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success(t('homepage.productDetail.linkCopied'));
    });
  }, [t]);

  const handleAddToCompare = useCallback(() => {
    addCompareItem({
      id: product.id,
      name: product.name,
      price: activeVariant?.sellPrice ?? 0,
      comparePrice: activeVariant?.oldSellPrice || undefined,
      image: product.imagePreview,
      rating: product.approvedRatingSum,
      reviewCount: product.approvedTotalReviews,
      categories: product.categories || [],
      stock: totalStock,
      description: product.fullDescription || '',
      sku: product.sku || ''
    });
    toast.success(t('homepage.common.compare'));
  }, [product, addCompareItem, t, activeVariant, totalStock]);

  return (
    <>
      {/* Action Buttons */}
      {!product.disableBuyButton && (
        <div className="space-y-2.5 pt-1">
          <Button
            onClick={handleAddToCart}
            disabled={totalStock === 0}
            className="w-full h-12 text-base font-semibold rounded-xl bg-ecommerce-red hover:bg-ecommerce-red/90 text-white gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
          >
            <ShoppingCart size={20} />
            {t('homepage.productDetail.addToCart')}
          </Button>
          <Button
            onClick={handleBuyNow}
            disabled={totalStock === 0}
            variant="outline"
            className="w-full h-11 text-sm font-medium rounded-xl border-2 border-ecommerce-text-primary text-ecommerce-text-primary hover:bg-ecommerce-text-primary hover:text-white gap-2 transition-all disabled:opacity-50"
          >
            <Zap size={16} />
            {t('homepage.productDetail.buyNow')}
          </Button>
        </div>
      )}

      {/* Wishlist & Share */}
      <div className="flex items-center gap-2">
        {!product.disableWishlistButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleWishlist}
            className={`flex-1 h-10 rounded-lg gap-2 text-sm transition-all ${wishlisted
              ? 'border-ecommerce-red text-ecommerce-red bg-ecommerce-red/5'
              : 'border-ecommerce-border text-ecommerce-text-secondary hover:border-ecommerce-red hover:text-ecommerce-red'
              }`}
          >
            <Heart size={15} className={wishlisted ? 'fill-ecommerce-red' : ''} />
            {wishlisted ? t('homepage.common.removeFromWishlist') : t('homepage.common.addToWishlist')}
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex-1 h-10 rounded-lg gap-2 text-sm border-ecommerce-border text-ecommerce-text-secondary hover:border-ecommerce-teal hover:text-ecommerce-teal transition-all"
        >
          <Share2 size={15} />
          {t('homepage.productDetail.share')}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddToCompare}
          className="h-10 w-10 rounded-lg border-ecommerce-border text-ecommerce-text-secondary hover:border-ecommerce-purple hover:text-ecommerce-purple transition-all"
          aria-label={t('homepage.common.compare')}
        >
          <GitCompare size={15} />
        </Button>
      </div>
    </>
  );
}
