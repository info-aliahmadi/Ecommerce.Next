'use client';

import Link from 'next/link';
import { LocalOffer, TrendingUp, NewReleases } from '@mui/icons-material';

interface PromoBannerProps {
  type?: 'sale' | 'trending' | 'new';
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function PromoBanner({
  type = 'sale',
  title,
  description,
  buttonText = 'Shop Now',
  buttonLink = '/products',
}: PromoBannerProps) {
  const getGradient = () => {
    switch (type) {
      case 'sale':
        return 'from-red-500 to-orange-500';
      case 'trending':
        return 'from-purple-500 to-pink-500';
      case 'new':
        return 'from-green-500 to-teal-500';
      default:
        return 'from-blue-500 to-indigo-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'sale':
        return <LocalOffer className="text-6xl text-white/80" />;
      case 'trending':
        return <TrendingUp className="text-6xl text-white/80" />;
      case 'new':
        return <NewReleases className="text-6xl text-white/80" />;
      default:
        return <LocalOffer className="text-6xl text-white/80" />;
    }
  };

  return (
    <div className={`relative bg-gradient-to-r ${getGradient()} rounded-lg shadow-xl overflow-hidden`}>
      <div className="absolute inset-0 bg-black opacity-10" />
      <div className="relative container mx-auto px-6 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="hidden lg:block">
              {getIcon()}
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {title}
              </h2>
              <p className="text-white/90 text-lg max-w-2xl">
                {description}
              </p>
            </div>
          </div>
          <Link
            href={buttonLink}
            className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
