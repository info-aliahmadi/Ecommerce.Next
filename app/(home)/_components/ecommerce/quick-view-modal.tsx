'use client';

import { Star, ShoppingCart, Heart, X, Truck, Shield, RotateCcw, Check, Minus, Plus, ChevronLeft, ChevronRight, ZoomIn, BarChart3, Send, User, Link2, Share2, Ruler, Package, Clock, Undo2, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent } from '../ui/dialog';
import { useUIStore, useCartStore, useWishlistStore, useRecentStore } from '../../_lib/store';
import { toast } from 'sonner';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SizeGuideModal } from './size-guide-modal';
import { useTranslations } from 'next-intl';
import ProductDisplayModel from '../../_types/ProductDisplayModel';
import { GetImage } from '../../_lib/utils';
import CartItem from '../../_types/CartItem';
import CONFIG from '@root/config';
import { redirect } from 'next/navigation';
interface ReviewData {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  createdAt: string;
}

function RatingBreakdown({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const t = useTranslations();
  // Generate fake but realistic distribution based on the rating
  const base5 = rating >= 4.5 ? 65 : rating >= 4 ? 40 : 20;
  const base4 = rating >= 4.5 ? 20 : rating >= 4 ? 35 : 25;
  const base3 = rating >= 4.5 ? 10 : rating >= 4 ? 15 : 25;
  const base2 = rating >= 4.5 ? 3 : rating >= 4 ? 7 : 15;
  const base1 = rating >= 4.5 ? 2 : rating >= 4 ? 3 : 15;

  const distribution = [
    { stars: 5, percentage: base5 + Math.floor(Math.random() * 10) },
    { stars: 4, percentage: base4 + Math.floor(Math.random() * 10) },
    { stars: 3, percentage: base3 + Math.floor(Math.random() * 8) },
    { stars: 2, percentage: base2 + Math.floor(Math.random() * 5) },
    { stars: 1, percentage: base1 + Math.floor(Math.random() * 3) },
  ];

  return (
    <div className="flex gap-4 p-3 rounded-xl bg-ecommerce-surface-hover/60 border border-ecommerce-border/50">
      {/* Average Rating */}
      <div className="text-center shrink-0 w-20">
        <p className="text-3xl font-extrabold text-ecommerce-text-primary">{rating.toFixed(1)}</p>
        <div className="flex items-center justify-center gap-0.5 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={10} className={i < Math.floor(rating) ? 'fill-ecommerce-amber text-ecommerce-amber' : 'text-ecommerce-border'} />
          ))}
        </div>
        <p className="text-[10px] text-ecommerce-text-muted mt-1">{t('homepage.quickView.reviews', { count: reviewCount })}</p>
      </div>

      {/* Breakdown Bars */}
      <div className="flex-1 space-y-1.5">
        {distribution.map((item) => (
          <div key={item.stars} className="flex items-center gap-2">
            <span className="text-[10px] text-ecommerce-text-muted w-3 text-end">{item.stars}</span>
            <Star size={9} className="fill-ecommerce-amber text-ecommerce-amber shrink-0" />
            <div className="flex-1 h-2 bg-ecommerce-border/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-ecommerce-amber rounded-full transition-all duration-700"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="text-[10px] text-ecommerce-text-muted w-7 text-end">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewForm({ productId, productName }: { productId: number; productName: string }) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [reviewText, setReviewText] = useState('');

  const mutation = useMutation({
    mutationFn: async (data: { productId: number; author: string; rating: number; title: string; comment: string }) => {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || t('homepage.quickView.reviewForm.error'));
      return json;
    },
    onSuccess: () => {
      toast.success(t('homepage.quickView.reviewForm.success'));
      setRating(0);
      setHoveredRating(0);
      setTitle('');
      setAuthor('');
      setReviewText('');
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
    },
    onError: (error) => {
      toast.error(t('homepage.quickView.reviewForm.error'), { description: error.message });
    },
  });

  const handleSubmit = () => {
    if (rating === 0 || !reviewText.trim()) return;
    mutation.mutate({
      productId,
      author: author.trim() || 'Anonymous',
      rating,
      title: title.trim(),
      comment: reviewText.trim(),
    });
  };

  return (
    <div className="space-y-3">
      {/* Author */}
      <div>
        <label className="text-xs text-ecommerce-text-muted mb-1 block">{t('homepage.quickView.reviewForm.name')}</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder={t('homepage.quickView.reviewForm.namePlaceholder')}
          maxLength={50}
          className="w-full px-3 py-2 rounded-xl bg-ecommerce-surface-hover border border-ecommerce-border text-sm text-ecommerce-text-primary placeholder:text-ecommerce-text-muted focus:outline-none focus:border-ecommerce-purple/40 transition-colors"
        />
      </div>
      {/* Title */}
      <div>
        <label className="text-xs text-ecommerce-text-muted mb-1 block">{t('homepage.quickView.reviewForm.reviewTitle')}</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('homepage.quickView.reviewForm.titlePlaceholder')}
          maxLength={100}
          className="w-full px-3 py-2 rounded-xl bg-ecommerce-surface-hover border border-ecommerce-border text-sm text-ecommerce-text-primary placeholder:text-ecommerce-text-muted focus:outline-none focus:border-ecommerce-purple/40 transition-colors"
        />
      </div>
      {/* Rating */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-ecommerce-text-muted me-1">{t('homepage.quickView.ratingBreakdown').replace(' Breakdown', '')}:</span>
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            onMouseEnter={() => setHoveredRating(i + 1)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(i + 1)}
            className="transition-transform hover:scale-125"
            aria-label={`Rate ${i + 1} stars`}
          >
            <Star
              size={18}
              className={`transition-colors ${i < (hoveredRating || rating)
                ? 'fill-ecommerce-amber text-ecommerce-amber'
                : 'text-ecommerce-border'
                }`}
            />
          </button>
        ))}
        {rating > 0 && <span className="text-xs text-ecommerce-text-muted ms-1">{rating}/5</span>}
      </div>
      {/* Comment */}
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder={t('homepage.quickView.reviewForm.commentPlaceholder')}
        rows={3}
        className="w-full px-3 py-2.5 rounded-xl bg-ecommerce-surface-hover border border-ecommerce-border text-sm text-ecommerce-text-primary placeholder:text-ecommerce-text-muted resize-none focus:outline-none focus:border-ecommerce-purple/40 transition-colors"
      />
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || !reviewText.trim() || mutation.isPending}
          size="sm"
          className="h-8 px-4 bg-ecommerce-purple hover:bg-ecommerce-purple/90 text-white rounded-lg text-xs font-medium gap-1.5 transition-all"
        >
          {mutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
          {mutation.isPending ? '...' : t('homepage.quickView.reviewForm.submit')}
        </Button>
      </div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-3 rounded-xl bg-ecommerce-surface-hover/40 border border-ecommerce-border/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full skeleton-shimmer" />
            <div className="w-20 h-3 rounded skeleton-shimmer" />
            <div className="w-16 h-3 rounded skeleton-shimmer" />
          </div>
          <div className="w-full h-3 rounded skeleton-shimmer mb-1.5" />
          <div className="w-3/4 h-3 rounded skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
}

function ReviewItem({ review }: { review: ReviewData }) {
  const t = useTranslations();
  const initial = review.author.charAt(0).toUpperCase();
  const dateStr = new Date(review.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-xl bg-ecommerce-surface-hover/40 border border-ecommerce-border/30"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ecommerce-red to-ecommerce-purple flex items-center justify-center text-white text-[10px] font-bold">
            {initial}
          </div>
          <span className="text-xs font-semibold text-ecommerce-text-primary">{review.author}</span>
          {review.verified && (
            <Badge className="bg-ecommerce-emerald/10 text-ecommerce-emerald border-0 text-[9px] px-1.5 py-0 h-4 font-medium">
              ✓
            </Badge>
          )}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star key={j} size={9} className={j < review.rating ? 'fill-ecommerce-amber text-ecommerce-amber' : 'text-ecommerce-border'} />
            ))}
          </div>
        </div>
        <span className="text-[10px] text-ecommerce-text-muted">{dateStr}</span>
      </div>
      {review.title && (
        <p className="text-xs font-semibold text-ecommerce-text-primary mb-1">{review.title}</p>
      )}
      <p className="text-xs text-ecommerce-text-secondary leading-relaxed">{review.comment}</p>
    </motion.div>
  );
}

function ShippingTab() {
  const t = useTranslations();
  const items = [
    {
      icon: Truck,
      title: t('homepage.quickView.shippingInfo.freeShipping'),
      desc: t('homepage.quickView.shippingInfo.freeShippingDesc'),
    },
    {
      icon: Clock,
      title: t('homepage.quickView.shippingInfo.express'),
      desc: t('homepage.quickView.shippingInfo.expressDesc'),
    },
    {
      icon: Undo2,
      title: t('homepage.quickView.shippingInfo.returns'),
      desc: t('homepage.quickView.shippingInfo.returnsDesc'),
    },
    {
      icon: Package,
      title: t('homepage.quickView.shippingInfo.support'),
      desc: t('homepage.quickView.shippingInfo.supportDesc'),
    },
  ];

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="flex items-start gap-3 p-3 rounded-xl bg-ecommerce-surface-hover/40 border border-ecommerce-border/30"
        >
          <div className="w-8 h-8 rounded-lg bg-ecommerce-red/10 flex items-center justify-center shrink-0 mt-0.5">
            <item.icon size={16} className="text-ecommerce-red" />
          </div>
          <div>
            <p className="text-xs font-semibold text-ecommerce-text-primary">{item.title}</p>
            <p className="text-[11px] text-ecommerce-text-secondary mt-0.5 leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickViewContent({ product, onClose }: { product: ProductDisplayModel; onClose: () => void }) {
  const t = useTranslations();
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addItem: addRecent } = useRecentStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');
  const [selectedSize, setSelectedSize] = useState('M');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState({ name: 'Default', value: '#6C757D' });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showNavArrows, setShowNavArrows] = useState(false);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const colorVariants = [
    { name: 'Default', value: '#6C757D' },
    { name: 'Midnight', value: '#1A1D2E' },
    { name: 'Ruby', value: '#E63946' },
    { name: 'Ocean', value: '#20B2AA' },
    { name: 'Orchid', value: '#6A5ACD' },
    { name: 'Sunset', value: '#FF8C42' },
  ];

  const sizeVariants = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const wishlisted = isInWishlist(product.id);
  const discount = product.oldSellUnitPrice ? Math.round(((product.oldSellUnitPrice - product.sellUnitPrice) / product.oldSellUnitPrice) * 100) : 0;
  const parsedTags: string[] = product.productTags || [];

  // Fetch reviews from API
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', product.id],
    queryFn: async () => {
      const res = await fetch(`/api/reviews?productId=${product.id}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.reviews as ReviewData[];
    },
    enabled: activeTab === 'reviews',
    staleTime: 30 * 1000,
  });

  const reviews = reviewsData || [];
  const reviewCount = reviews.length;

  // Build image gallery with fallback placeholders
  const imageList = useMemo(() => {
    let images: string[] = product.imagePaths || [];
    if (images.length === 0) {
      // add preview image in
      const base = GetImage(product.imagePreview);
      images = [
        base];
    }
    return images.map(x => CONFIG.API_BASEPATH + x);
  }, [product.imagePaths]);

  // Detect touch device on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product.id]);

  // Cleanup added-to-cart timer
  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    };
  }, []);

  // Track recently viewed
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
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.sellUnitPrice,
        comparePrice: product.oldSellUnitPrice,
        image: product.imagePreview,
        categories: product.categories,
      } as CartItem);
    }
    toast.success(t('homepage.cart.itemAdded', { name: product.name }), {
      description: `${t('homepage.quickView.quantity')}: ${quantity} × $${product.sellUnitPrice.toFixed(2)}`,
      action: { label: t('homepage.common.addToCart'), onClick: () => useCartStore.getState().setCartOpen(true) },
    });
    // Show checkmark animation
    setAddedToCart(true);
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => setAddedToCart(false), 1500);
    onClose();
  };

  const handleWishlist = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.sellUnitPrice,
      comparePrice: product.oldSellUnitPrice,
      image: product.imagePreview,
      categories: product.categories,
    });
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
      <div className="flex flex-col md:grid md:grid-cols-[55%_45%]">
        {/* Image Gallery Section */}
        <div className="flex flex-col">
          {/* Main Image Container with zoom-lens */}
          <div
            ref={mainImageRef}
            className="zoom-container relative aspect-square overflow-hidden rounded-2xl bg-ecommerce-surface-hover cursor-zoom-in"
            onMouseEnter={() => {
              if (!isTouchDevice) {
                setIsZoomed(true);
                setShowNavArrows(true);
              }
            }}
            onMouseLeave={() => {
              setIsZoomed(false);
              setShowNavArrows(false);
            }}
            onMouseMove={handleMouseMove}
          >
            {/* Main image with fade transition */}
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImageIndex}
                src={imageList[selectedImageIndex]}
                alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full object-cover"
                style={
                  isZoomed
                    ? {
                      transform: 'scale(2)',
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      transition: 'transform-origin 0.05s ease-out',
                    }
                    : {
                      transform: 'scale(1)',
                      transition: 'transform 0.3s ease-out',
                    }
                }
              />
            </AnimatePresence>

            {/* Zoom lens element (CSS class from globals.css) */}
            {isZoomed && !isTouchDevice && (
              <div
                className="zoom-lens"
                style={{
                  left: `${zoomPosition.x}%`,
                  top: `${zoomPosition.y}%`,
                }}
              />
            )}

            {/* Zoom icon overlay on main image */}
            <div className="absolute top-4 start-4 flex items-center gap-1.5 glass rounded-lg px-2.5 py-1 z-10">
              <ZoomIn size={12} className="text-white/70" />
              <span className="text-[10px] text-white/70 font-medium">
                {isZoomed ? t('homepage.quickView.moveToPan') : t('homepage.quickView.hoverToZoom')}
              </span>
            </div>

            {/* Discount & stock badges */}
            <div className="absolute top-4 end-12 flex flex-col gap-1.5 z-10">
              {discount > 0 && (
                <Badge className="bg-ecommerce-red text-white border-0 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                  {t('homepage.common.off', { percent: discount })}
                </Badge>
              )}
              {product.stockQuantity > 0 && product.stockQuantity < product.minStockQuantity && (
                <Badge className="bg-ecommerce-amber text-ecommerce-text-primary border-0 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                  {t('homepage.common.onlyLeft', { count: product.stockQuantity })}
                </Badge>
              )}
            </div>

            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              className="absolute top-4 end-4 w-10 h-10 rounded-xl glass shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10"
              aria-label={t('homepage.common.addToWishlist')}
            >
              <Heart size={18} className={wishlisted ? 'fill-ecommerce-red text-ecommerce-red' : 'text-white'} />
            </button>

            {/* Navigation arrows - show on hover */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className={`absolute start-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-ecommerce-surface/90 shadow-lg flex items-center justify-center hover:bg-white transition-all z-10 ${showNavArrows ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}
                  aria-label={t('homepage.common.previous')}
                >
                  <ChevronLeft size={16} className="text-ecommerce-text-primary" />
                </button>
                <button
                  onClick={handleNextImage}
                  className={`absolute end-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-ecommerce-surface/90 shadow-lg flex items-center justify-center hover:bg-white transition-all z-10 ${showNavArrows ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                    }`}
                  aria-label={t('homepage.common.next')}
                >
                  <ChevronRight size={16} className="text-ecommerce-text-primary" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {imageList.length > 1 && (
            <div className="flex gap-2 mt-3 px-1 overflow-x-auto pb-1 scrollbar-hide">
              {imageList.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${i === selectedImageIndex
                    ? 'border-ecommerce-red ring-2 ring-ecommerce-red/20 opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  aria-label={`Image ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-6 flex flex-col overflow-y-auto max-h-[70vh]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 md:top-3 md:end-3 w-8 h-8 rounded-lg bg-ecommerce-surface-hover flex items-center justify-center hover:bg-ecommerce-border transition-colors z-10"
            aria-label={t('homepage.common.close')}
          >
            <X size={16} />
          </button>

          {/* Category */}
          <div className="flex items-center gap-1.5 mb-2">
            {product.categories?.map(category => category && (<>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="text-xs font-medium text-ecommerce-text-muted uppercase tracking-wider">{category.name}</span>
            </>))}
            {product.sku && (
              <span className="text-xs text-ecommerce-text-muted ms-auto">{t('homepage.common.sku')}: {product.sku}</span>
            )}
          </div>

          {/* Name */}
          <h2
            onClick={() => handleNavigateToMoreDetail(product.id)}
            className="text-xl font-bold text-ecommerce-text-primary leading-tight cursor-pointer"
          >{product.name}</h2>
          {/* Tags */}
          {parsedTags.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {parsedTags.map(tag => (
                <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-ecommerce-surface-hover text-ecommerce-text-muted capitalize border border-ecommerce-border/50">{tag}</span>
              ))}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.approvedRatingSum) ? 'fill-ecommerce-amber text-ecommerce-amber' : 'text-ecommerce-border'}
                />
              ))}
            </div>
            <span className="text-sm text-ecommerce-text-secondary font-medium">{product.approvedRatingSum}</span>
            <span className="text-sm text-ecommerce-text-muted">({product.approvedTotalReviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-bold text-ecommerce-text-primary">${product.sellUnitPrice.toFixed(2)}</span>
            {product.oldSellUnitPrice > 0 && (
              <>
                <span className="text-lg text-ecommerce-text-muted line-through">${product.oldSellUnitPrice.toFixed(2)}</span>
                <Badge className="bg-ecommerce-emerald/10 text-ecommerce-emerald border-0 text-xs font-semibold">
                  {t('homepage.cart.savings')} ${(product.oldSellUnitPrice - product.sellUnitPrice).toFixed(2)}
                </Badge>
              </>
            )}
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <div
              className="text-sm text-ecommerce-text-secondary mt-3 px-3 py-2.5 rounded-xl bg-ecommerce-surface-hover border border-ecommerce-border/50 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          )}

          {/* Stock status */}
          <div className="flex items-center gap-2 mt-4">
            {product.stockQuantity > 0 ? (
              <>
                <Check size={14} className="text-ecommerce-emerald" />
                <span className="text-sm text-ecommerce-emerald font-medium">{t('homepage.common.inStock')}</span>
                {product.stockQuantity < 20 && (
                  <span className="text-xs text-ecommerce-amber font-medium">— {t('homepage.common.onlyLeft', { count: product.stockQuantity })}</span>
                )}
              </>
            ) : (
              <span className="text-sm text-ecommerce-red font-medium">{t('homepage.common.outOfStock')}</span>
            )}
          </div>

          {/* Color Variants */}
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-sm font-medium text-ecommerce-text-primary">{t('homepage.quickView.color')}</span>
              <span className="text-xs text-ecommerce-text-muted">:</span>
              <span className="text-sm text-ecommerce-text-secondary">{selectedColor.name}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {colorVariants.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${selectedColor.name === color.name ? 'border-ecommerce-red ring-2 ring-ecommerce-red/20 scale-110' : 'border-ecommerce-border hover:border-ecommerce-text-muted'}`}
                  style={{ backgroundColor: color.value }}
                  aria-label={color.name}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Variants */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-ecommerce-text-primary">{t('homepage.quickView.size')}</span>
                <span className="text-xs text-ecommerce-text-muted">:</span>
                <span className="text-sm text-ecommerce-text-secondary">{selectedSize}</span>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-ecommerce-purple hover:text-ecommerce-purple/80 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Ruler size={12} />
                {t('homepage.quickView.sizeGuide')}
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {sizeVariants.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-9 min-w-[36px] px-3 rounded-lg border text-sm font-medium transition-all duration-200 ${selectedSize === size ? 'border-ecommerce-red bg-ecommerce-red/5 text-ecommerce-red' : 'border-ecommerce-border text-ecommerce-text-secondary hover:border-ecommerce-text-muted hover:bg-ecommerce-surface-hover'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
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
                onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-ecommerce-surface-hover transition-colors"
                aria-label={t('homepage.common.next')}
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="text-sm text-ecommerce-text-muted">
              {t('homepage.cart.total')}: <span className="font-bold text-ecommerce-text-primary">${(product.sellUnitPrice * quantity).toFixed(2)}</span>
            </span>
          </div>

          {/* Selected options summary */}
          <div className="mt-3 px-3 py-2 rounded-lg bg-ecommerce-surface-hover/60 border border-ecommerce-border/40">
            <span className="text-xs text-ecommerce-text-muted">{t('homepage.quickView.selected', { value: '' }).replace(/:\s*$/, '')} </span>
            <span className="text-xs text-ecommerce-text-secondary font-medium">{selectedColor.name}</span>
            <span className="text-xs text-ecommerce-text-muted"> / </span>
            <span className="text-xs text-ecommerce-text-secondary font-medium">{selectedSize}</span>
            <span className="text-xs text-ecommerce-text-muted"> × {quantity}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <Button
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0 || addedToCart}
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

          {/* Share Product */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-ecommerce-border">
            <span className="text-xs font-medium text-ecommerce-text-muted flex items-center gap-1.5">
              <Share2 size={13} />
              {t('homepage.common.share')}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href + '#product-' + product.id);
                  setCopied(true);
                  toast.success(t('homepage.common.linkCopied'));
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 bg-ecommerce-surface-hover hover:bg-ecommerce-purple/10 text-ecommerce-text-secondary hover:text-ecommerce-purple"
                title={t('homepage.common.copyLink')}
              >
                {copied ? <Check size={15} className="text-green-500" /> : <Link2 size={15} />}
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

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-ecommerce-border">
            {[
              { icon: Truck, label: t('homepage.hero.freeShipping') },
              { icon: Shield, label: t('homepage.hero.securePayment') },
              { icon: RotateCcw, label: t('homepage.hero.easyReturns') },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1 text-center">
                <item.icon size={16} className="text-ecommerce-text-muted" />
                <span className="text-[10px] text-ecommerce-text-muted leading-tight">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Description / Reviews / Shipping tabs */}
          <div className="mt-5 pt-5 border-t border-ecommerce-border">
            {/* Tab buttons with red underline indicator */}
            <div className="flex gap-4 mb-4 border-b border-ecommerce-border/50">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`text-sm font-medium pb-2.5 border-b-2 transition-all duration-200 flex items-center gap-1.5 -mb-px ${activeTab === tab.key
                    ? 'border-ecommerce-red text-ecommerce-red'
                    : 'border-transparent text-ecommerce-text-muted hover:text-ecommerce-text-secondary'
                    }`}
                >
                  {tab.key === 'reviews' && <BarChart3 size={13} />}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content with smooth transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="min-h-[120px]"
              >
                {activeTab === 'description' ? (
                  <div
                    className="text-sm text-ecommerce-text-secondary leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.fullDescription }}
                  />
                ) : activeTab === 'reviews' ? (
                  <div className="space-y-4">
                    <RatingBreakdown rating={product.approvedRatingSum} reviewCount={product.approvedTotalReviews} />

                    {/* Write a Review Form */}
                    <div className="pt-4 border-t border-ecommerce-border/50">
                      <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-3">{t('homepage.quickView.reviewForm.title')}</h4>
                      <ReviewForm productId={product.id} productName={product.name} />
                    </div>

                    {/* Reviews list from API */}
                    <div className="pt-4 border-t border-ecommerce-border/50">
                      <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-3">
                        {t('homepage.quickView.customerReviews')} {reviews.length > 0 && `(${reviews.length})`}
                      </h4>

                      {reviewsLoading ? (
                        <ReviewsSkeleton />
                      ) : reviews.length > 0 ? (
                        <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-thin">
                          {reviews.map((review) => (
                            <ReviewItem key={review.id} review={review} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 rounded-full bg-ecommerce-surface-hover flex items-center justify-center mx-auto mb-3">
                            <BarChart3 size={20} className="text-ecommerce-text-muted" />
                          </div>
                          <p className="text-sm text-ecommerce-text-secondary font-medium">{t('homepage.quickView.reviewForm.beFirst')}</p>
                          <p className="text-xs text-ecommerce-text-muted mt-1">{t('homepage.quickView.reviewForm.commentPlaceholder')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <ShippingTab />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
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