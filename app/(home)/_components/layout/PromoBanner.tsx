'use client';

import Link from 'next/link';

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
        return (
          <svg className="w-16 h-16 text-white/80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
          </svg>
        );
      case 'trending':
        return (
          <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'new':
        return (
          <svg className="w-16 h-16 text-white/80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16 text-white/80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
          </svg>
        );
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
