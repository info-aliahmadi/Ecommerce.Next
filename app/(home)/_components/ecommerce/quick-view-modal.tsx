'use client';

import { Heart, ShoppingCart, Check, Minus, Plus, Shield, Truck, RotateCcw, X } from 'lucide-react';
import { StarRating } from '../ui/star-rating';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent } from '../ui/dialog';
import { useUIStore, useCartStore, useWishlistStore, useRecentStore } from '../../_lib/store';
import { useAddToCart } from '../../_hooks/use-cart-queries';
import { toast } from 'sonner';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { SizeGuideModal } from './size-guide-modal';
import { useTranslations } from 'next-intl';
import { useAddToWishlist, useRemoveFromWishlist } from '../../_hooks/use-wishlist-queries';
import { GetImage } from '../../_lib/utils';
import CONFIG from '@root/config';
import HomePageService from '../../_services/HomePageService';
import { redirect } from 'next/navigation';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import VariantSelector from '@root/app/(home)/products/[id]/_components/VariantSelector';
import ProductVariantDisplayModel from '../../_types/Product/ProductVariantDisplayModel';
import { QuickViewGallery } from './quick-view-modal-gallery';
import { QuickViewTabs } from './quick-view-modal-tabs';
import ProductDisplayModel, { getProductPricing } from '../../_types/Product/ProductDisplayModel';
import { getAvailableStock } from '../../_types/Product/InventoryDisplayModel';
import ReviewSummary from '../../products/[id]/_components/ReviewSummary';

function QuickViewContent({ product, onClose }: Readonly<{ product: ProductDisplayModel; onClose: () => void }>) {
  const t = useTranslations();
  const addToCart = useAddToCart();
  const { isInWishlist } = useWishlistStore();
  const { addItem: addRecent } = useRecentStore();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showNavArrows, setShowNavArrows] = useState(false);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { cheapestVariant: defaultCheapest, totalStock } = getProductPricing(product.variants ?? []);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDisplayModel | null>(defaultCheapest ?? null);
  const activeVariant = selectedVariant ?? defaultCheapest;
  const hasMultipleVariants = (product.variants?.length ?? 0) > 1;
  const discount = activeVariant?.oldSellPrice ? Math.round(((activeVariant?.oldSellPrice - activeVariant.sellPrice) / activeVariant.oldSellPrice) * 100) : 0;
  const parsedTags: string[] = product.productTags || [];
  const stock = getAvailableStock(activeVariant?.productInventory);

  const wishlisted = isInWishlist(activeVariant.id);
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', product.id],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getProductReviews(product.id);
      if (!result.succeeded) throw new Error(result.message || 'Failed to fetch reviews');
      return result.data;
    },
    enabled: activeTab === 'reviews',
    staleTime: 30 * 1000,
  });

  const reviews = reviewsData || [];
  const reviewCount = reviews.length;

  const imageList = useMemo(() => {
    let images: string[] = product.imagePaths || [];
    if (images.length === 0) {
      const base = GetImage(product.imagePreview);
      images = [base];
    }
    return images.map(x => CONFIG.API_BASEPATH + x);
  }, [product.imagePaths]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product.id]);

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    addRecent(product);
  }, [product, addRecent]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || isTouchDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, [isZoomed, isTouchDevice]);

  const handlePrevImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  }, [imageList.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev + 1) % imageList.length);
  }, [imageList.length]);

  const handleAddToCart = () => {
    if (!activeVariant) return;
    addToCart.mutate({
      id: product.id,
      name: product.name,
      variant: activeVariant,
      image: product.imagePreview,
      categories: product.categories,
    });
    toast.success(t('homepage.cart.itemAdded', { name: product.name }), {
      description: `${t('homepage.quickView.quantity')}: ${quantity} × ${CurrencyViewer(activeVariant.sellPrice, CONFIG.DEFAULT_CURRENCY)}`,
      action: { label: t('homepage.common.addToCart'), onClick: () => useCartStore.getState().setCartOpen(true) },
    });
    setAddedToCart(true);
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => setAddedToCart(false), 1500);
    onClose();
  };

  const handleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist.mutate({ variantId: activeVariant.id });
    } else {
      addToWishlist.mutate({
        id: product.id,
        name: product.name,
        variant: activeVariant,
        image: product.imagePreview,
        categories: product.categories,
      });
    }
    toast.success(wishlisted ? t('homepage.common.removeFromWishlist') : t('homepage.common.addToWishlist'));
  };

  const handleNavigateToMoreDetail = (productId: number) => {
    onClose();
    redirect('products/' + productId);
  };

  const tabs = [
    { key: 'description' as const, label: t('homepage.quickView.description') },
    { key: 'reviews' as const, label: t('homepage.quickView.reviews', { count: reviewCount || product.approvedTotalReviews }) },
    { key: 'shipping' as const, label: t('homepage.quickView.shipping') },
  ];

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-[55%_45%] max-h-[85vh]">
        <QuickViewGallery
          product={product}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          isZoomed={isZoomed}
          setIsZoomed={setIsZoomed}
          zoomPosition={zoomPosition}
          setZoomPosition={setZoomPosition}
          showNavArrows={showNavArrows}
          setShowNavArrows={setShowNavArrows}
          isTouchDevice={isTouchDevice}
          imageList={imageList}
          discount={discount}
          totalStock={totalStock}
          wishlisted={wishlisted}
          handleWishlist={handleWishlist}
          handlePrevImage={handlePrevImage}
          handleNextImage={handleNextImage}
          t={t}
          mainImageRef={mainImageRef}
          onClose={onClose}
        />

        <div className="p-6 flex flex-col overflow-y-auto">

          {product.categories?.map(category => category && (
            <span key={"category-" + category.key} className="text-xs font-medium text-ecommerce-text-muted uppercase tracking-wider pb-2">
              <span className="inline-block w-2 h-2 mx-2 rounded-full " style={{ backgroundColor: category.color }} > </span>
              <span className="text-xs font-medium text-ecommerce-text-muted uppercase tracking-wider">{category.name}</span>
            </span>))}

          <h2
            onClick={() => handleNavigateToMoreDetail(product.id)}
            className="text-xl font-bold text-ecommerce-text-primary leading-tight cursor-pointer pb-2"
          >{product.name}</h2>

          {product.sku && (
            <span className="text-xs text-ecommerce-text-muted ">{t('homepage.common.sku')}: {product.sku}</span>
          )}
          {parsedTags.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {parsedTags.map(tag => (
                <span key={"tag-" + tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-ecommerce-surface-hover text-ecommerce-text-muted capitalize border border-ecommerce-border/50">{tag}</span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mt-3">
            <ReviewSummary
              rating={product.approvedRatingSum ? product.approvedRatingSum / product.approvedTotalReviews : 0}
              reviewCount={product.approvedTotalReviews} />
          </div>


          {product.callForPrice ? (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xl font-bold text-ecommerce-amber">
                {t('homepage.productDetail.callForPrice')}
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-ecommerce-text-primary">
                {CurrencyViewer(activeVariant?.sellPrice ?? 0, CONFIG.DEFAULT_CURRENCY)}
              </span>
              {activeVariant?.oldSellPrice > 0 && activeVariant.oldSellPrice > activeVariant.sellPrice && (
                <>
                  <span className="text-lg text-ecommerce-text-muted line-through">{CurrencyViewer(activeVariant.oldSellPrice, CONFIG.DEFAULT_CURRENCY)}</span>
                  <Badge className="bg-ecommerce-emerald/10 text-ecommerce-emerald border-0 text-xs font-semibold">
                    {t('homepage.cart.savings')} {CurrencyViewer(activeVariant.oldSellPrice - activeVariant.sellPrice, CONFIG.DEFAULT_CURRENCY)}
                  </Badge>
                </>
              )}
            </div>
          )}

          {product.shortDescription && (
            <div
              className="text-sm text-ecommerce-text-secondary mt-3 px-3 py-2.5 rounded-xl bg-ecommerce-surface-hover border border-ecommerce-border/50 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          )}

          <div className="flex items-center gap-2 mt-4">
            {stock > 0 ? (
              <>
                <Check size={14} className="text-ecommerce-emerald" />
                <span className="text-sm text-ecommerce-emerald font-medium">{t('homepage.common.inStock')}</span>
                {stock < 20 && (
                  <span className="text-xs text-ecommerce-amber font-medium">— {t('homepage.common.onlyLeft', { count: stock })}</span>
                )}
              </>
            ) : (
              <span className="text-sm text-ecommerce-red font-medium">{t('homepage.common.outOfStock')}</span>
            )}
          </div>

          <VariantSelector
            variants={product.variants ?? []}
            onVariantChange={(options) => {
              const selectedKeys = Array.from(options.values()).filter(Boolean).map(o => o!.key);
              if (selectedKeys.length === 0) {
                setSelectedVariant(defaultCheapest);
                return;
              }
              const matched = product.variants?.find(v =>
                selectedKeys.every(key =>
                  v.productAttributes?.some(attr => attr.key === key)
                )
              ) ?? null;
              setSelectedVariant(matched);
            }}
          />

          <div className="flex items-center gap-4 mt-5">
            <span className="text-sm font-medium text-ecommerce-text-primary">{t('homepage.quickView.quantity')}</span>
            <div className="flex items-center border border-ecommerce-border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-ecommerce-surface-hover transition-colors"
                aria-label={t('homepage.common.previous')}
              >
                <Minus size={14} />
              </button>
              <span className="w-12 text-center text-sm font-semibold countdown-digit">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(stock || 99, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-ecommerce-surface-hover transition-colors"
                aria-label={t('homepage.common.next')}
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="text-sm text-ecommerce-text-muted">
              {t('homepage.cart.total')}: <span className="font-bold text-ecommerce-text-primary">{CurrencyViewer((activeVariant?.sellPrice ?? 0) * quantity, CONFIG.DEFAULT_CURRENCY)}</span>
            </span>
          </div>

          <div className="mt-3 px-3 py-2 rounded-lg bg-ecommerce-surface-hover/60 border border-ecommerce-border/40">
            <span className="text-xs text-ecommerce-text-muted">{t('homepage.quickView.selected', { value: '' }).replace(/:\s*$/, '')} </span>
            {activeVariant?.productAttributes?.map((attr, i) => (
              <span key={attr.id}>
                {i > 0 && <span className="text-xs text-ecommerce-text-muted mx-1">/</span>}
                <span className="text-xs text-ecommerce-text-secondary font-medium">{attr.displayName}</span>
              </span>
            ))}
            <span className="text-xs text-ecommerce-text-muted"> × {quantity}</span>
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              onClick={handleAddToCart}
              disabled={stock === 0 || addedToCart}
              className="flex-1 h-12 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-ecommerce-red/10"
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={18} />
                    {t('homepage.quickView.added')}
                  </motion.span>
                ) : (
                  <motion.span
                    key="cart"
                    initial={{ opacity: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    {t('homepage.quickView.addToCart')}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
            <Button
              onClick={handleWishlist}
              variant="outline"
              size="icon"
              className={`h-12 w-12 rounded-xl border-ecommerce-border shrink-0 transition-all hover:scale-105 ${wishlisted ? 'bg-ecommerce-red/5 border-ecommerce-red/30' : ''}`}
            >
              <Heart size={18} className={wishlisted ? 'fill-ecommerce-red text-ecommerce-red' : ''} />
            </Button>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-ecommerce-border">
            <span className="text-xs font-medium text-ecommerce-text-muted flex items-center gap-1.5">
              {t('homepage.common.share')}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(CONFIG.DOMAIN + '/products/' + product.id);
                  setCopied(true);
                  toast.success(t('homepage.common.linkCopied'));
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 bg-ecommerce-surface-hover hover:bg-ecommerce-purple/10 text-ecommerce-text-secondary hover:text-ecommerce-purple"
                title={t('homepage.common.copyLink')}
              >
                {copied ? <Check size={15} className="text-green-500" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>}
              </button>
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(product.name)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2]"
                title={t('homepage.common.shareOn', { platform: 'Twitter' })}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </button>
              <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2]"
                title={t('homepage.common.shareOn', { platform: 'Facebook' })}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </button>
              <button
                onClick={() => window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${encodeURIComponent(product.name)}`, '_blank')}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 bg-[#E60023]/10 hover:bg-[#E60023]/20 text-[#E60023]"
                title={t('homepage.common.shareOn', { platform: 'Pinterest' })}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z" /></svg>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-5 pt-5 border-t border-ecommerce-border">
            <div className="flex flex-col items-center gap-1 text-center">
              <Shield size={16} className="text-ecommerce-text-muted" />
              <span className="text-[10px] text-ecommerce-text-muted leading-tight">{t('homepage.hero.securePayment')}</span>
            </div>
            {product.isFreeShipping && (
              <div className="flex flex-col items-center gap-1 text-center">
                <Truck size={16} className="text-ecommerce-text-muted" />
                <span className="text-[10px] text-ecommerce-text-muted leading-tight">{t('homepage.hero.freeShipping')}</span>
              </div>
            )}
            {!product.notReturnable && (
              <div className="flex flex-col items-center gap-1 text-center">
                <RotateCcw size={16} className="text-ecommerce-text-muted" />
                <span className="text-[10px] text-ecommerce-text-muted leading-tight">{t('homepage.hero.easyReturns')}</span>
              </div>
            )}
          </div>

          <QuickViewTabs
            product={product}
            reviews={reviews}
            reviewsLoading={reviewsLoading}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
            t={t}
            reviewCount={reviewCount}
          />
        </div>
      </div>
      <SizeGuideModal open={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </>
  );
}

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct } = useUIStore();

  return (
    <Dialog open={!!quickViewProduct} onOpenChange={(open) => { if (!open) setQuickViewProduct(null); }}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden rounded-2xl border-ecommerce-border sm:rounded-2xl">
        {quickViewProduct && (
          <QuickViewContent
            key={quickViewProduct.id}
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
