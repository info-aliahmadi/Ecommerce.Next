'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
  backgroundColor: string;
}

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: 'Summer Sale',
      subtitle: 'Up to 50% Off',
      description: 'Discover amazing deals on your favorite products. Limited time offer!',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      backgroundColor: 'from-blue-600 to-purple-600',
    },
    {
      id: 2,
      title: 'New Arrivals',
      subtitle: 'Fresh & Trending',
      description: 'Check out the latest products added to our collection.',
      buttonText: 'Explore Now',
      buttonLink: '/products?filter=new',
      backgroundColor: 'from-green-600 to-teal-600',
    },
    {
      id: 3,
      title: 'Premium Quality',
      subtitle: 'Best Value',
      description: 'Experience excellence with our carefully curated products.',
      buttonText: 'Discover More',
      buttonLink: '/products?filter=featured',
      backgroundColor: 'from-orange-600 to-red-600',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-lg shadow-2xl">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`relative w-full h-full bg-gradient-to-r ${slide.backgroundColor}`}>
            <div className="absolute inset-0 bg-black opacity-20" />
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl text-white relative z-10">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <span className="text-sm font-semibold">{slide.subtitle}</span>
                </div>
                <h1 className="text-6xl font-bold mb-4 leading-tight animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl mb-8 leading-relaxed">
                  {slide.description}
                </p>
                <Link
                  href={slide.buttonLink}
                  className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 z-20 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 z-20 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
