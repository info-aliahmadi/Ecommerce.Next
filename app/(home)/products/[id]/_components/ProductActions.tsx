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
import { useAddToCart } from '../../../_hooks/use-cart-queries';
import { getAvailableStock } from '../../../_types/Product/InventoryDisplayModel';
import { useAddToWishlist, useRemoveFromWishlist } from '../../../_hooks/use-wishlist-queries';
import { GetImage } from '../../../_lib/utils';
import ProductDisplayModel, { getProductPricing } from '../../../_types/Product/ProductDisplayModel';
import ProductVariantDisplayModel from '@root/app/(home)/_types/Product/ProductVariantDisplayModel';

export default function ProductActions({
  product,
  selectedVariant,
  quantity = 1,
  isOutOfStock = false,
  isVariantUnavailable = false,
}: Readonly<{
  product: ProductDisplayModel;
  selectedVariant?: ProductVariantDisplayModel | null;
  quantity?: number;
  isOutOfStock?: boolean;
  isVariantUnavailable?: boolean;
}>) {
  const t = useTranslations('');
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addItem: addCompareItem, isInCompare } = useCompareStore();
  const { handleAddToCartWithAnimation } = useFlyToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const inCompare = isInCompare(selectedVariant?.id ?? 0);
  const { cheapestVariant, totalStock } = getProductPricing(product.variants ?? []);
  const activeVariant = selectedVariant ?? cheapestVariant;

  const addToCart = useAddToCart();

  const wishlisted = isInWishlist(activeVariant.id);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      if (!activeVariant) return;
      for (let i = 0; i < quantity; i++) {
        handleAddToCartWithAnimation(e, GetImage(product.imagePreview), {
          id: product.id,
          name: product.name,
          variant: activeVariant,
          image: product.imagePreview,
          categories: product.categories,
          quantity: 1
        });
      }
    },
    [product, handleAddToCartWithAnimation, activeVariant, quantity],
  );

  const handleBuyNow = useCallback(async () => {
    if (!activeVariant) return;
    let addedCount = 0;
    for (let i = 0; i < quantity; i++) {
      try {
        await addToCart.mutateAsync({
          id: product.id,
          name: product.name,
          variant: activeVariant,
          image: product.imagePreview,
          categories: product.categories,
        });
        addedCount++;
      } catch (error) {
        if (error instanceof Error && error.message.includes('Insufficient stock')) {
          toast.error('Insufficient stock', {
            description: `Only ${getAvailableStock(activeVariant.productInventory)} items available in stock`,
          });
        }
        break;
      }
    }
    if (addedCount > 0) {
      setCartOpen(true);
    }
  }, [product, addToCart, setCartOpen, activeVariant, quantity, toast]);

  const handleWishlist = useCallback(() => {
    if (wishlisted) {
      removeFromWishlist.mutate({ variantId: activeVariant.id });
    } else {
      addToWishlist.mutate({
        id: product.id,
        name: product.name,
        variant: activeVariant,
        image: product.imagePreview,
        categories: product.categories
      });
    }
    toast.success(
      wishlisted ? t('homepage.productDetail.removeFromWishlistSuccess') : t('homepage.productDetail.addToWishlistSuccess'),
    );
  }, [product, wishlisted, t, activeVariant, addToWishlist, removeFromWishlist]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success(t('homepage.productDetail.linkCopied'));
    });
  }, [t]);

  const handleAddToCompare = useCallback(() => {
    addCompareItem({
      id: product.id,
      name: product.name,
      variant: activeVariant,
      image: product.imagePreview,
      rating: product.approvedRatingSum,
      reviewCount: product.approvedTotalReviews,
      categories: product.categories || [],
      stock: totalStock,
      description: product.fullDescription || ''
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
            disabled={isOutOfStock || isVariantUnavailable}
            className="w-full h-12 text-base font-semibold rounded-xl bg-ecommerce-red hover:bg-ecommerce-red/90 text-white gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
          >
            <ShoppingCart size={20} />
            {isVariantUnavailable ? t('homepage.productDetail.variantNotAvailable') : isOutOfStock ? t('homepage.productDetail.outOfStock') : t('homepage.productDetail.addToCart')}
          </Button>
          <Button
            onClick={handleBuyNow}
            disabled={isOutOfStock || isVariantUnavailable}
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
          className={`flex-1 h-10 rounded-lg gap-2 text-sm border-ecommerce-border text-ecommerce-text-secondary hover:border-ecommerce-teal hover:text-ecommerce-teal transition-all ${inCompare ? 'bg-ecommerce-teal/10 dark:bg-ecommerce-teal/10' : 'hover:bg-ecommerce-teal hover:text-white'}`}
          aria-label={t('homepage.common.compare')}
        >
          <GitCompare size={15} className={inCompare ? 'text-ecommerce-teal' : 'text-ecommerce-text-secondary'} />
        </Button>
      </div>
    </>
  );
}
