'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CONFIG from '@root/config';

interface CategoryCardProps {
  category: any;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (category.pictureId && category.pictureId > 0) {
      return `${CONFIG.CATEGORY_BASEPATH}${category.pictureId}`;
    }
    return CONFIG.UNKNOWN_IMAGE_BASEPATH;
  };

  return (
    <Link href={`/category/${category.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
          <Image
            src={imageError ? CONFIG.UNKNOWN_IMAGE_BASEPATH : getImageUrl()}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-xl font-bold mb-1">{category.name}</h3>
          </div>
        </div>
        
        <div className="p-4">
          {category.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {category.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
            <span>Shop Now</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
