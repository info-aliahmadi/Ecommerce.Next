'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Visibility, FavoriteBorder, Star, StarBorder } from '@mui/icons-material';
import { IconButton, Tooltip, Chip } from '@mui/material';
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
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.markAsNew && (
            <Chip label="New" size="small" color="success" className="font-semibold" />
          )}
          {discountPercentage > 0 && (
            <Chip label={`-${discountPercentage}%`} size="small" color="error" className="font-semibold" />
          )}
          {product.isFreeShipping && (
            <Chip label="Free Shipping" size="small" color="info" className="font-semibold" />
          )}
        </div>

        <div className="absolute top-2 right-2 z-10">
          <Tooltip title="Add to Wishlist">
            <IconButton
              size="small"
              onClick={handleAddToWishlist}
              className="bg-white hover:bg-gray-100 shadow-md"
              disabled={product.disableWishlistButton}
            >
              <FavoriteBorder fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>

        <div className="relative h-64 bg-gray-100 overflow-hidden">
          <Image
            src={imageError ? CONFIG.UNKNOWN_IMAGE_BASEPATH : getImageUrl()}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Tooltip title="Quick View">
                <IconButton className="bg-white hover:bg-gray-100 shadow-lg">
                  <Visibility />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="p-4">
          {product.categoryNames && product.categoryNames.length > 0 && (
            <p className="text-xs text-gray-500 mb-1 truncate">
              {product.categoryNames[0]}
            </p>
          )}

          <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, index) => (
              index < Math.round(rating) ? (
                <Star key={index} className="text-yellow-400 text-sm" />
              ) : (
                <StarBorder key={index} className="text-gray-300 text-sm" />
              )
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({product.approvedTotalReviews})
            </span>
          </div>

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

          <button
            onClick={handleAddToCart}
            disabled={product.disableBuyButton || (product.stockType === 0 && product.stockQuantity <= 0)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingCart fontSize="small" />
            {product.callForPrice ? 'Call for Price' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
