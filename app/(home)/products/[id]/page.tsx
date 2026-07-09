'use client';

import { useEffect, useState, useRef, useCallback, useSyncExternalStore } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  Headphones,
  Award,
  ChevronLeft,
  ArrowLeft,
  Check,
  Loader2,
  Zap,
  GitCompare,
} from 'lucide-react';

import { I18nProvider } from '../../i18n/provider';
import { Header } from '../../_components/ecommerce/header';
import { Footer } from '../../_components/ecommerce/footer';
import { CartDrawer } from '../../_components/ecommerce/cart-drawer';
import { QuickViewModal } from '../../_components/ecommerce/quick-view-modal';
import { BackToTop } from '../../_components/ecommerce/back-to-top';
import { CompareBar } from '../../_components/ecommerce/compare-bar';
import { CompareDrawer } from '../../_components/ecommerce/compare-drawer';
import { FlyToCart } from '../../_components/ecommerce/fly-to-cart';
import { MobileBottomNav } from '../../_components/ecommerce/mobile-bottom-nav';
import { ProductCard } from '../../_components/ecommerce/product-card';
import { Button } from '../../_components/ui/button';
import { Badge } from '../../_components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../_components/ui/tabs';
import { Separator } from '../../_components/ui/separator';
import { Input } from '../../_components/ui/input';
import { Textarea } from '../../_components/ui/textarea';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../_components/ui/breadcrumb';
import {
  useCartStore,
  useWishlistStore,
  useCompareStore,
  useRecentStore,
} from '../../_lib/store';
import { useFlyToCart } from '../../_hooks/use-fly-to-cart';
import { useCategoryTranslations } from '../../_lib/category-translations';

// ── Types ──────────────────────────────────────────────
interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  price: number;
  comparePrice: number | null;
  image: string;
  images: string;
  categoryId: string;
  category: { id: string; name: string; slug: string; color: string };
  stock: number;
  sku: string | null;
  featured: boolean;
  rating: number;
  reviewCount: number;
  tags: string;
  createdAt: string;
  reviews: Review[];
}

// ── Mounted hook ──────────────────────────────────────
function useMounted() {
  return useSyncExternalStore(
    () => () => { },
    () => true,
    () => false,
  );
}

// ── Star rating interactive ───────────────────────────
function StarRatingInput({
  value,
  onChange,
  size = 24,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starVal = i + 1;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(starVal)}
            onMouseEnter={() => setHover(starVal)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              size={size}
              className={`transition-colors ${starVal <= (hover || value)
                  ? 'fill-ecommerce-amber text-ecommerce-amber'
                  : 'text-ecommerce-border'
                }`}
            />
          </button>
        );
      })}
    </div>
  );
}

// ── Rating breakdown bars ─────────────────────────────
function RatingBreakdown({ reviews }: { reviews: Review[] }) {
  const t = useTranslations('productDetail');

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === star).length;
    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, pct };
  });

  return (
    <div className="space-y-2">
      {distribution.map(({ star, count, pct }) => (
        <div key={star} className="flex items-center gap-2 text-sm">
          <span className="w-14 text-ecommerce-text-muted text-right">
            {star} <Star size={11} className="inline fill-ecommerce-amber text-ecommerce-amber" />
          </span>
          <div className="flex-1 h-2.5 rounded-full bg-ecommerce-border/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: (5 - star) * 0.08 }}
              className="h-full rounded-full bg-ecommerce-amber"
            />
          </div>
          <span className="w-8 text-ecommerce-text-muted text-xs">{count}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Page Component ───────────────────────────────
function ProductDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const mounted = useMounted();
  const t = useTranslations();
  const tPd = useTranslations('productDetail');
  const catTrans = useCategoryTranslations();

  const id = params.id as unknown as number;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 0, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const reviewsRef = useRef<HTMLDivElement>(null);

  // Stores
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addItem: addCompareItem } = useCompareStore();

  const isCompareOpen = useCompareStore((s) => s.isCompareOpen);
  const setCompareOpen = useCompareStore((s) => s.setCompareOpen);

  const { addItem: addRecentItem } = useRecentStore();
  const { handleAddToCartWithAnimation } = useFlyToCart();

  const wishlisted = mounted ? isInWishlist(id) : false;

  // ── Fetch product ───────────────────────────────────
  const {
    data: productData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      return data as { success: boolean; product: Product; relatedProducts: Product[] };
    },
    enabled: !!id,
  });

  const product = productData?.product;
  const relatedProducts = productData?.relatedProducts || [];

  // Parse images
  const images: string[] = product
    ? (() => {
      try {
        const parsed = JSON.parse(product.images);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : [product.image];
      } catch {
        return [product.image];
      }
    })()
    : [];

  // Parse tags
  const tags: string[] = product
    ? (() => {
      try {
        const parsed = JSON.parse(product.tags);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })()
    : [];

  const discount = product?.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;
  const savings = product?.comparePrice && product.comparePrice > product.price
    ? product.comparePrice - product.price
    : 0;

  // Add to recently viewed on mount
  useEffect(() => {
    if (product && mounted) {
      addRecentItem(product);
    }
  }, [product, mounted, addRecentItem]);

  // Reset state on id change
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setReviewForm({ author: '', rating: 0, title: '', comment: '' });
  }, [id]);

  // ── Handlers ────────────────────────────────────────
  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      if (!product) return;
      handleAddToCartWithAnimation(e, product.image, {
        id: product.id,
        name: product.name,
        price: product.price,
        comparePrice: product.comparePrice ?? undefined,
        image: product.image,
        category: product.category.name,
      });
    },
    [product, handleAddToCartWithAnimation],
  );

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice ?? undefined,
      image: product.image,
      category: product.category.name,
    });
    setCartOpen(true);
  }, [product, addItem, setCartOpen]);

  const handleWishlist = useCallback(() => {
    if (!product) return;
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice ?? undefined,
      image: product.image,
      category: product.category.name,
    });
    toast.success(
      wishlisted ? tPd('removeFromWishlistSuccess') : tPd('addToWishlistSuccess'),
    );
  }, [product, toggleItem, wishlisted, tPd]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success(tPd('linkCopied'));
    });
  }, [tPd]);

  const handleAddToCompare = useCallback(() => {
    if (!product) return;
    addCompareItem({
      id: product.id,
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice ?? undefined,
      image: product.image,
      rating: product.rating,
      reviewCount: product.reviewCount,
      category: product.category,
      stock: product.stock,
      description: product.description,
      sku: product.sku ?? undefined,
    });
    toast.success(t('homepage.common.compare'));
  }, [product, addCompareItem, t]);

  const handleZoomMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x, y });
    },
    [isZoomed],
  );

  const scrollToReviews = useCallback(() => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSubmitReview = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!product || reviewForm.rating === 0 || !reviewForm.comment.trim()) return;
      setSubmittingReview(true);
      try {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            author: reviewForm.author.trim() || 'Anonymous',
            rating: reviewForm.rating,
            title: reviewForm.title.trim(),
            comment: reviewForm.comment.trim(),
          }),
        });
        if (!res.ok) throw new Error('Failed');
        toast.success(tPd('reviewSubmitted'));
        setReviewForm({ author: '', rating: 0, title: '', comment: '' });
        queryClient.invalidateQueries({ queryKey: ['product', id] });
      } catch {
        toast.error('Failed to submit review');
      } finally {
        setSubmittingReview(false);
      }
    },
    [product, reviewForm, id, queryClient, tPd],
  );

  // ── Loading state ───────────────────────────────────
  if (!mounted || isLoading) {
    return (
      <I18nProvider>
        <div className="min-h-screen bg-white dark:bg-ecommerce-surface">
          <Header />
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <div className="aspect-square rounded-2xl bg-ecommerce-border/30 shimmer" />
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 w-48 rounded bg-ecommerce-border/30 shimmer" />
                <div className="h-10 w-3/4 rounded bg-ecommerce-border/30 shimmer" />
                <div className="h-5 w-32 rounded bg-ecommerce-border/30 shimmer" />
                <div className="h-8 w-24 rounded bg-ecommerce-border/30 shimmer" />
                <div className="h-12 w-full rounded bg-ecommerce-border/30 shimmer" />
                <div className="h-12 w-full rounded bg-ecommerce-border/30 shimmer" />
                <div className="h-12 w-full rounded bg-ecommerce-border/30 shimmer" />
              </div>
            </div>
          </div>
        </div>
      </I18nProvider>
    );
  }

  // ── Error state ─────────────────────────────────────
  if (isError || !product) {
    return (
      <I18nProvider>
        <div className="min-h-screen bg-white dark:bg-ecommerce-surface">
          <Header />
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-3xl font-bold text-ecommerce-text-primary">
                Product Not Found
              </h1>
              <p className="text-ecommerce-text-muted">
                The product you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Button onClick={() => router.push('/')} className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white">
                <ArrowLeft size={16} className="me-2" />
                {tPd('backToShop')}
              </Button>
            </motion.div>
          </div>
        </div>
      </I18nProvider>
    );
  }

  // ── Shipping info cards ─────────────────────────────
  const shippingCards = [
    { icon: Truck, title: tPd('freeShipping'), desc: tPd('freeShippingDesc'), color: 'text-ecommerce-emerald' },
    { icon: Zap, title: tPd('expressShipping'), desc: tPd('expressShippingDesc'), color: 'text-ecommerce-amber' },
    { icon: RotateCcw, title: tPd('returnPolicy'), desc: tPd('returnPolicyDesc'), color: 'text-ecommerce-purple' },
    { icon: Shield, title: tPd('secureCheckout'), desc: tPd('secureCheckoutDesc'), color: 'text-ecommerce-teal' },
    { icon: Award, title: tPd('warranty'), desc: tPd('warrantyDesc'), color: 'text-ecommerce-rose' },
    { icon: Headphones, title: tPd('customerSupport'), desc: tPd('customerSupportDesc'), color: 'text-ecommerce-blue' },
  ];

  return (
    <I18nProvider>
      <div className="min-h-screen bg-white dark:bg-ecommerce-surface flex flex-col">
        <Header />

        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Breadcrumb className="mb-4 sm:mb-6">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-ecommerce-text-muted hover:text-ecommerce-text-primary text-sm">
                      {tPd('breadcrumbHome')}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-ecommerce-text-muted hover:text-ecommerce-text-primary text-sm">
                      {tPd('breadcrumbShop')}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <span className="text-sm text-ecommerce-text-muted">
                      {catTrans[product.category.name] || product.category.name}
                    </span>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-sm text-ecommerce-text-primary font-medium truncate max-w-[200px]">
                      {product.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </motion.div>

            {/* Main 2-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
              {/* Left Column - Image Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="lg:col-span-3"
              >
                {/* Main Image */}
                <div
                  className="relative aspect-square rounded-2xl overflow-hidden bg-ecommerce-surface-hover dark:bg-[#252836] border border-ecommerce-border cursor-crosshair mb-3"
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleZoomMove}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImage}
                      src={images[selectedImage]}
                      alt={`${product.name} - ${selectedImage + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300"
                      style={
                        isZoomed
                          ? {
                            transform: 'scale(2)',
                            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                          }
                          : {}
                      }
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </AnimatePresence>

                  {/* Discount badge */}
                  {discount > 0 && (
                    <Badge className="absolute top-4 start-4 bg-gradient-to-r from-ecommerce-red to-rose-500 text-white border-0 text-sm font-bold px-3 py-1 rounded-lg shadow-lg z-10">
                      {t('homepage.common.off', { percent: discount })}
                    </Badge>
                  )}

                  {/* Image navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                        className="absolute start-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-ecommerce-surface/80 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-ecommerce-surface transition-colors z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={18} className="text-ecommerce-text-primary rtl:rotate-180" />
                      </button>
                      <button
                        onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                        className="absolute end-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-ecommerce-surface/80 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-ecommerce-surface transition-colors z-10"
                        aria-label="Next image"
                      >
                        <ChevronLeft size={18} className="text-ecommerce-text-primary rtl:rotate-180 rotate-180" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${idx === selectedImage
                            ? 'border-ecommerce-red ring-2 ring-ecommerce-red/20'
                            : 'border-ecommerce-border hover:border-ecommerce-text-muted'
                          }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Right Column - Product Info (sticky on desktop) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="lg:sticky lg:top-24 space-y-4">
                  {/* Product Name */}
                  <h1 className="text-2xl sm:text-3xl font-bold text-ecommerce-text-primary leading-tight">
                    {product.name}
                  </h1>

                  {/* Rating */}
                  <button
                    onClick={scrollToReviews}
                    className="flex items-center gap-2 group"
                    aria-label={tPd('scrollToReviews')}
                  >
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(product.rating)
                              ? 'fill-ecommerce-amber text-ecommerce-amber'
                              : i < product.rating
                                ? 'fill-ecommerce-amber/50 text-ecommerce-amber'
                                : 'text-ecommerce-border'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-ecommerce-text-primary">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-ecommerce-text-muted group-hover:text-ecommerce-red transition-colors">
                      ({product.reviewCount} {tPd('reviewsTab').toLowerCase()})
                    </span>
                  </button>

                  {/* Price */}
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-ecommerce-text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-lg text-ecommerce-text-muted line-through">
                          ${product.comparePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {savings > 0 && (
                      <p className="text-sm font-medium text-ecommerce-emerald">
                        {tPd('youSave', { amount: savings.toFixed(2) })}
                      </p>
                    )}
                  </div>

                  <Separator className="bg-ecommerce-border/50" />

                  {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    {product.stock > 0 ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-ecommerce-emerald animate-pulse" />
                        {product.stock <= 10 ? (
                          <span className="text-sm font-medium text-ecommerce-amber">
                            {tPd('onlyLeft', { count: product.stock })}
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-ecommerce-emerald">
                            {tPd('inStock')}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-ecommerce-red" />
                        <span className="text-sm font-medium text-ecommerce-red">
                          {tPd('outOfStock')}
                        </span>
                      </>
                    )}
                  </div>

                  {/* SKU */}
                  {product.sku && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-ecommerce-text-muted">{tPd('sku')}:</span>
                      <span className="font-mono text-ecommerce-text-primary">{product.sku}</span>
                    </div>
                  )}

                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: product.category.color }} />
                    <span className="text-sm text-ecommerce-text-muted">{tPd('category')}:</span>
                    <span className="text-sm font-medium text-ecommerce-text-primary">
                      {catTrans[product.category.name] || product.category.name}
                    </span>
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-ecommerce-text-muted">{tPd('tags')}:</span>
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs border-ecommerce-border text-ecommerce-text-secondary capitalize"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Short Description */}
                  {product.shortDesc && (
                    <p className="text-sm text-ecommerce-text-muted leading-relaxed">
                      {product.shortDesc}
                    </p>
                  )}

                  <Separator className="bg-ecommerce-border/50" />

                  {/* Quantity Selector */}
                  <div>
                    <label className="text-sm font-medium text-ecommerce-text-primary mb-2 block">
                      {tPd('quantity')}
                    </label>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-lg border-ecommerce-border"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus size={16} />
                      </Button>
                      <div className="h-10 w-14 flex items-center justify-center border border-ecommerce-border rounded-lg text-sm font-medium text-ecommerce-text-primary">
                        {quantity}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-lg border-ecommerce-border"
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        disabled={quantity >= product.stock}
                      >
                        <Plus size={16} />
                      </Button>
                      {product.stock > 0 && (
                        <span className="ms-2 text-xs text-ecommerce-text-muted">
                          {product.stock} {t('homepage.common.remaining')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2.5 pt-1">
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="w-full h-12 text-base font-semibold rounded-xl bg-ecommerce-red hover:bg-ecommerce-red/90 text-white gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <ShoppingCart size={20} />
                      {tPd('addToCart')}
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                      variant="outline"
                      className="w-full h-11 text-sm font-medium rounded-xl border-2 border-ecommerce-text-primary text-ecommerce-text-primary hover:bg-ecommerce-text-primary hover:text-white gap-2 transition-all disabled:opacity-50"
                    >
                      <Zap size={16} />
                      {tPd('buyNow')}
                    </Button>
                  </div>

                  {/* Wishlist & Share */}
                  <div className="flex items-center gap-2">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="flex-1 h-10 rounded-lg gap-2 text-sm border-ecommerce-border text-ecommerce-text-secondary hover:border-ecommerce-teal hover:text-ecommerce-teal transition-all"
                    >
                      <Share2 size={15} />
                      {tPd('share')}
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
                </div>
              </motion.div>
            </div>

            {/* Tabs Section */}
            <motion.div
              ref={reviewsRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-10 sm:mt-14"
            >
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full sm:w-auto bg-ecommerce-border/30 p-1 rounded-xl h-auto">
                  <TabsTrigger
                    value="description"
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-ecommerce-surface data-[state=active]:shadow-sm"
                  >
                    {tPd('description')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-ecommerce-surface data-[state=active]:shadow-sm"
                  >
                    {tPd('reviewsTab')} ({product.reviewCount})
                  </TabsTrigger>
                  <TabsTrigger
                    value="shipping"
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-ecommerce-surface data-[state=active]:shadow-sm"
                  >
                    {tPd('shippingInfo')}
                  </TabsTrigger>
                </TabsList>

                {/* Description Tab */}
                <TabsContent value="description" className="mt-6">
                  <div className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-6">
                    <h3 className="text-lg font-semibold text-ecommerce-text-primary mb-4">
                      {tPd('productDescription')}
                    </h3>
                    <div className="prose prose-sm max-w-none text-ecommerce-text-secondary leading-relaxed whitespace-pre-line">
                      {product.description}
                    </div>
                    {product.shortDesc && (
                      <div className="mt-6 pt-6 border-t border-ecommerce-border">
                        <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-3">
                          {tPd('highlights')}
                        </h4>
                        <p className="text-sm text-ecommerce-text-muted">{product.shortDesc}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Rating Summary */}
                    <div className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-6 flex flex-col items-center justify-center text-center">
                      <div className="text-5xl font-bold text-ecommerce-text-primary">
                        {product.rating.toFixed(1)}
                      </div>
                      <div className="flex items-center gap-0.5 mt-2 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={
                              i < Math.floor(product.rating)
                                ? 'fill-ecommerce-amber text-ecommerce-amber'
                                : 'text-ecommerce-border'
                            }
                          />
                        ))}
                      </div>
                      <p className="text-sm text-ecommerce-text-muted">
                        {tPd('viewAllReviews', { count: product.reviewCount })}
                      </p>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-6">
                      <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-4">
                        {tPd('rating')} {tPd('reviewsTab').toLowerCase()}
                      </h4>
                      <RatingBreakdown reviews={product.reviews} />
                    </div>

                    {/* Write Review */}
                    <div className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-6">
                      <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-4">
                        {tPd('writeReview')}
                      </h4>
                      <form onSubmit={handleSubmitReview} className="space-y-3">
                        <Input
                          placeholder="Your name"
                          value={reviewForm.author}
                          onChange={(e) => setReviewForm((prev) => ({ ...prev, author: e.target.value }))}
                          className="h-9 text-sm border-ecommerce-border"
                        />
                        <div>
                          <label className="text-xs text-ecommerce-text-muted mb-1.5 block">
                            {tPd('rating')}
                          </label>
                          <StarRatingInput
                            value={reviewForm.rating}
                            onChange={(v) => setReviewForm((prev) => ({ ...prev, rating: v }))}
                            size={22}
                          />
                        </div>
                        <Input
                          placeholder="Review title"
                          value={reviewForm.title}
                          onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                          className="h-9 text-sm border-ecommerce-border"
                        />
                        <Textarea
                          placeholder="Your review..."
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                          rows={3}
                          className="text-sm border-ecommerce-border resize-none"
                          required
                        />
                        <Button
                          type="submit"
                          disabled={submittingReview || reviewForm.rating === 0 || !reviewForm.comment.trim()}
                          className="w-full h-9 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white text-sm font-medium rounded-lg gap-2 disabled:opacity-50"
                        >
                          {submittingReview ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Check size={14} />
                          )}
                          {tPd('submitReview')}
                        </Button>
                      </form>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="mt-6 space-y-4">
                    {product.reviews.length > 0 ? (
                      product.reviews.map((review, idx) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-xl border border-ecommerce-border p-5"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-ecommerce-text-primary">
                                  {review.author}
                                </span>
                                {review.verified && (
                                  <Badge className="bg-ecommerce-emerald/10 text-ecommerce-emerald border-ecommerce-emerald/20 text-[10px] px-1.5 py-0 h-4 rounded">
                                    {tPd('verifiedPurchase')}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-px">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      className={
                                        i < review.rating
                                          ? 'fill-ecommerce-amber text-ecommerce-amber'
                                          : 'text-ecommerce-border'
                                      }
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-ecommerce-text-muted">
                                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          {review.title && (
                            <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-1">
                              {review.title}
                            </h4>
                          )}
                          <p className="text-sm text-ecommerce-text-secondary leading-relaxed">
                            {review.comment}
                          </p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border">
                        <Star size={40} className="mx-auto mb-3 text-ecommerce-border" />
                        <p className="text-ecommerce-text-muted text-sm">{tPd('noReviewsYet')}</p>
                        <p className="text-ecommerce-text-muted text-xs mt-1">{tPd('beFirstToReview')}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Shipping Tab */}
                <TabsContent value="shipping" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shippingCards.map((card, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.06 }}
                        className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5 hover:shadow-md transition-shadow"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-ecommerce-border/30 flex items-center justify-center mb-3 ${card.color}`}>
                          <card.icon size={20} />
                        </div>
                        <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-1">
                          {card.title}
                        </h4>
                        <p className="text-xs text-ecommerce-text-muted leading-relaxed">
                          {card.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-14 mb-10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-ecommerce-text-primary">
                    {tPd('relatedProducts')}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/')}
                    className="text-sm text-ecommerce-text-muted hover:text-ecommerce-red"
                  >
                    <ArrowLeft size={14} className="me-1 rtl:rotate-180" />
                    {tPd('backToShop')}
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {relatedProducts.map((rp, idx) => (
                    <ProductCard
                      key={rp.id}
                      id={rp.id}
                      name={rp.name}
                      price={rp.price}
                      comparePrice={rp.comparePrice ?? undefined}
                      image={rp.image}
                      rating={rp.rating}
                      reviewCount={rp.reviewCount}
                      category={rp.category}
                      shortDesc={rp.shortDesc ?? undefined}
                      description={rp.description}
                      tags={rp.tags}
                      stock={rp.stock}
                      sku={rp.sku ?? undefined}
                      index={idx}
                    />
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </main>

        <Footer />
        <CartDrawer />
        <QuickViewModal />
        <BackToTop />
        <CompareBar />
        <CompareDrawer open={isCompareOpen} onClose={() => setCompareOpen(false)} />
        <FlyToCart />
        <MobileBottomNav />
      </div>
    </I18nProvider>
  );
}

function ProductDetailPage() {
  return (
    <I18nProvider>
      <ProductDetailPageContent />
    </I18nProvider>
  );
}

export default function Page() {
  return <ProductDetailPage />;
}