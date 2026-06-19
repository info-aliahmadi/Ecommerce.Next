'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CONFIG from '@root/config';

interface ProductCardProps {
  product: any;
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const rating = product.approvedTotalReviews > 0 
    ? product.approvedRatingSum / product.approvedTotalReviews 
    : 0;
  
  const discountPercentage = product.oldSellUnitPrice > 0 && product.oldSellUnitPrice > product.sellUnitprice
    ? Math.round(((product.oldSellUnitPrice - product.sellUnitprice) / product.oldSellUnitPrice) * 100)
    : 0;

  const getImageUrl = () => {
    if (product.previewImage?.filePath) {
      return `${CONFIG.PRODUCT_BASEPATH}${product.previewImage.filePath}`;
    }
    return CONFIG.UNKNOWN_IMAGE_BASEPATH;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.markAsNew && (
            <span className="inline-block bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
              New
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
          {product.isFreeShipping && (
            <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Free Shipping
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={handleAddToWishlist}
            disabled={product.disableWishlistButton}
            className="bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed p-2 rounded-full shadow-md transition-colors"
            aria-label="Add to Wishlist"
            title="Add to Wishlist"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Product Image */}
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          <Image
            src={imageError ? CONFIG.UNKNOWN_IMAGE_BASEPATH : getImageUrl()}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                className="bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-colors"
                aria-label="Quick View"
                title="Quick View"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {product.categoryNames && product.categoryNames.length > 0 && (
            <p className="text-xs text-gray-500 mb-1 truncate">
              {product.categoryNames[0]}
            </p>
          )}

          <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-4 h-4 ${index < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                fill={index < Math.round(rating) ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({product.approvedTotalReviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">
                ${product.sellUnitprice.toFixed(2)}
              </span>
              {product.oldSellUnitPrice > 0 && product.oldSellUnitPrice > product.sellUnitprice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.oldSellUnitPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          {product.stockType === 0 && (
            <div className="mb-3">
              {product.stockQuantity > 0 ? (
                <span className="text-xs text-green-600 font-medium">
                  In Stock ({product.stockQuantity} available)
                </span>
              ) : (
                <span className="text-xs text-red-600 font-medium">Out of Stock</span>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.disableBuyButton || (product.stockType === 0 && product.stockQuantity <= 0)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {product.callForPrice ? 'Call for Price' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
