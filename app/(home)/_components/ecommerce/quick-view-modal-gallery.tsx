'use client';

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ChevronLeft, ChevronRight, Heart, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import ProductDisplayModel from '../../_types/Product/ProductDisplayModel';

interface QuickViewGalleryProps {
  product: ProductDisplayModel;
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  isZoomed: boolean;
  setIsZoomed: (zoomed: boolean) => void;
  zoomPosition: { x: number; y: number };
  setZoomPosition: (pos: { x: number; y: number }) => void;
  showNavArrows: boolean;
  setShowNavArrows: (show: boolean) => void;
  isTouchDevice: boolean;
  imageList: string[];
  discount: number;
  totalStock: number;
  wishlisted: boolean;
  handleWishlist: () => void;
  handlePrevImage: () => void;
  handleNextImage: () => void;
  t: any;
  mainImageRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

export function QuickViewGallery({
  product,
  selectedImageIndex,
  setSelectedImageIndex,
  isZoomed,
  setIsZoomed,
  zoomPosition,
  setZoomPosition,
  showNavArrows,
  setShowNavArrows,
  isTouchDevice,
  imageList,
  discount,
  totalStock,
  wishlisted,
  handleWishlist,
  handlePrevImage,
  handleNextImage,
  t,
  mainImageRef,
  onClose,
}: Readonly<QuickViewGalleryProps>) {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || isTouchDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, [isZoomed, isTouchDevice, setZoomPosition]);

  return (
    <div className="flex flex-col">

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

        {isZoomed && !isTouchDevice && (
          <div
            className="zoom-lens"
            style={{
              left: `${zoomPosition.x}%`,
              top: `${zoomPosition.y}%`,
            }}
          />
        )}

        <div className="absolute top-6 start-14 flex items-center gap-1.5 glass rounded-lg px-2.5 py-1 z-10">
          <ZoomIn size={12} className="text-white/70" />
          <span className="text-[10px] text-white/70 font-medium">
            {isZoomed ? t('homepage.quickView.moveToPan') : t('homepage.quickView.hoverToZoom')}
          </span>
        </div>


        <div className="absolute top-4 end-26 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <Badge className="bg-ecommerce-red text-white border-0 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
              {t('homepage.common.off', { percent: discount })}
            </Badge>
          )}
          {totalStock > 0 && totalStock < 10 && (
            <Badge className="bg-ecommerce-amber text-ecommerce-text-primary border-0 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
              {t('homepage.common.onlyLeft', { count: totalStock })}
            </Badge>
          )}
        </div>
        {/* <button
          onClick={onClose}
          className="absolute top-8 end-4 w-10 h-10 rounded-xl glass shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10 md:hidden"
          aria-label={t('close')}
        >
          <X size={18} />
        </button> */}
        <button
          type='button'
          onClick={handleWishlist}
          className="absolute top-4 end-14 w-10 h-10 rounded-xl glass shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10"
          aria-label={t('homepage.common.addToWishlist')}
        >
          <Heart size={18} className={wishlisted ? 'fill-ecommerce-red text-ecommerce-red' : 'text-white'} />
        </button>

        {imageList.length > 1 && (
          <>
            <button
              type='button'
              onClick={handlePrevImage}
              className={`absolute start-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-ecommerce-surface/90 shadow-lg flex items-center justify-center hover:bg-white transition-all z-10 ${showNavArrows ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}
              aria-label={t('homepage.common.previous')}
            >
              <ChevronLeft size={16} className="text-ecommerce-text-primary" />
            </button>
            <button
              type='button'
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

      {imageList.length > 1 && (
        <div className="flex gap-2 mt-3 px-1 overflow-x-auto pb-1 scrollbar-hide">
          {imageList.map((img, i) => (
            <button
              type='button'
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
  );
}
