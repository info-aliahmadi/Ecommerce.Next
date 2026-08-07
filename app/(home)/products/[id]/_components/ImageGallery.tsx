'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { getThumbnailName } from '../../../_lib/utils';

export default function ImageGallery({
  images,
  productName,
}: Readonly<{
  images: string[];
  productName: string;
}>) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

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

  return (
    <>
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
            alt={`${productName} - ${selectedImage + 1}`}
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

        {images.length > 1 && (
          <>
            <button

              type='button'
              onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute start-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-ecommerce-surface/80 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-ecommerce-surface transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} className="text-ecommerce-text-primary rtl:rotate-180" />
            </button>
            <button
              type='button'
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
              type='button'
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${idx === selectedImage
                ? 'border-ecommerce-red ring-2 ring-ecommerce-red/20'
                : 'border-ecommerce-border hover:border-ecommerce-text-muted'
                }`}
            >
              <img
                src={getThumbnailName(img)}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
