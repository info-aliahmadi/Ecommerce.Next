'use client';

import { Star, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, Headphones, Sparkles, TrendingUp, Award, Clock } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text: "Absolutely love the quality! The wireless headphones I ordered exceeded my expectations. Fast shipping and the packaging was beautiful. Will definitely order again.",
    product: 'Wireless Headphones',
    date: '2 weeks ago',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text: "Best online shopping experience I've had in years. The product descriptions are accurate, prices are competitive, and customer support is incredibly responsive.",
    product: 'Smart Watch Pro',
    date: '1 month ago',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    rating: 4,
    text: "The leather jacket is stunning! Perfect fit and the material quality is premium. Took one star off only because delivery took an extra day, but the product itself is flawless.",
    product: 'Leather Jacket',
    date: '3 weeks ago',
  },
  {
    id: 4,
    name: 'David Park',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text: "I've been a loyal customer for 6 months now. The consistent quality and amazing deals keep me coming back. The 60% off sales are real game changers!",
    product: 'Multiple Items',
    date: '1 week ago',
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text: "The skincare kit transformed my routine! All products are gentle yet effective. The website is so easy to navigate and checkout was seamless. Highly recommend!",
    product: 'Skincare Kit',
    date: '5 days ago',
  },
];

export function TestimonialsSection() {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const itemsPerView = typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 1;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const next = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section className="py-14 sm:py-20 bg-ecommerce-surface-hover/60 dark:bg-[#0F1117]/30 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-rose-500/20 dark:bg-rose-500/10 rounded-full -translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/10 dark:bg-teal-500/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

      {/* Animated floating background shapes */}
      <div className="absolute top-[15%] right-[10%] w-4 h-4 rounded-full bg-ecommerce-red/10 floating-shape pointer-events-none" />
      <div className="absolute bottom-[20%] left-[8%] w-3 h-3 rounded-full bg-ecommerce-purple/10 floating-shape pointer-events-none" />
      <div className="absolute top-[60%] right-[5%] w-2.5 h-2.5 rounded-full bg-ecommerce-teal/10 floating-shape pointer-events-none" />
      <div className="absolute top-[30%] left-[15%] w-3.5 h-3.5 rounded-full bg-ecommerce-amber/8 floating-shape pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header with decorative elements */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ecommerce-red/10 text-ecommerce-red text-xs font-semibold uppercase tracking-widest mb-3">
            <Star size={12} className="fill-ecommerce-red" />
            Testimonials
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ecommerce-text-primary tracking-tight">
            {t('homepage.testimonials.title')}
          </h2>
          <p className="text-sm text-ecommerce-text-muted mt-3 max-w-lg mx-auto">
            {t('homepage.testimonials.subtitle')}
          </p>
          {/* Decorative line */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-ecommerce-border" />
            <div className="h-1.5 w-1.5 rounded-full bg-ecommerce-red" />
            <div className="h-px w-8 bg-ecommerce-border" />
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="relative">
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className="absolute -start-2 lg:-start-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white dark:bg-ecommerce-surface shadow-xl border border-ecommerce-border flex items-center justify-center hover:bg-ecommerce-red hover:text-white hover:border-ecommerce-red hover:shadow-lg hover:shadow-ecommerce-red/20 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-ecommerce-text-primary disabled:hover:border-ecommerce-border disabled:hover:shadow-xl hidden md:flex"
            aria-label={t('homepage.testimonials.prev')}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            disabled={currentIndex >= maxIndex}
            className="absolute -end-2 lg:-end-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white dark:bg-ecommerce-surface shadow-xl border border-ecommerce-border flex items-center justify-center hover:bg-ecommerce-red hover:text-white hover:border-ecommerce-red hover:shadow-lg hover:shadow-ecommerce-red/20 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-ecommerce-text-primary disabled:hover:border-ecommerce-border disabled:hover:shadow-xl hidden md:flex"
            aria-label={t('homepage.testimonials.next')}
          >
            <ChevronRight size={18} />
          </button>

          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: direction * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -50 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {visibleTestimonials.map((t) => (
                  <div
                    key={t.id}
                    className="testimonial-card bg-white dark:bg-ecommerce-surface rounded-2xl p-6 border border-ecommerce-border relative group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    {/* Decorative large quote mark */}
                    <div className="absolute -top-4 -start-2 text-8xl font-serif leading-none text-ecommerce-purple/[0.05] dark:text-ecommerce-purple/[0.08] pointer-events-none select-none" aria-hidden="true">
                      &ldquo;
                    </div>

                    <div className="flex items-center gap-0.5 mb-4 relative">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`transition-colors duration-200 ${i < t.rating ? 'star-gradient' : 'text-ecommerce-border'}`}
                        />
                      ))}
                      <span className="ms-1.5 text-xs font-semibold text-ecommerce-amber">{t.rating}.0</span>
                    </div>

                    <p className="text-sm text-ecommerce-text-secondary leading-relaxed mb-5 min-h-[60px] relative">
                      &ldquo;{t.text}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-ecommerce-border">
                      <div className="relative">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-ecommerce-red/20"
                          loading="lazy"
                        />
                        {/* Gradient ring on avatar */}
                        <div className="absolute inset-0 w-11 h-11 rounded-full bg-gradient-to-br from-ecommerce-red to-ecommerce-purple p-[2px] -z-10" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-ecommerce-text-primary truncate">{t.name}</p>
                        <p className="text-[11px] text-ecommerce-text-muted">{t.role} · {t.date}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-ecommerce-text-muted bg-ecommerce-surface-hover dark:bg-[#252836] px-2.5 py-1 rounded-lg">
                        Purchased: {t.product}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
                className={`transition-all duration-300 rounded-full ${
                  i === currentIndex
                    ? 'w-8 h-2.5 bg-ecommerce-red shadow-sm shadow-ecommerce-red/30'
                    : 'w-2.5 h-2.5 bg-ecommerce-border hover:bg-ecommerce-text-muted/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats with icons and hover */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: Star, value: '4.9/5', label: 'Average Rating', color: 'text-ecommerce-amber', bg: 'bg-ecommerce-amber/10' },
            { icon: TrendingUp, value: '50K+', label: 'Happy Customers', color: 'text-ecommerce-emerald', bg: 'bg-ecommerce-emerald/10' },
            { icon: Award, value: '98%', label: 'Would Recommend', color: 'text-ecommerce-purple', bg: 'bg-ecommerce-purple/10' },
            { icon: Clock, value: '24/7', label: 'Support Available', color: 'text-ecommerce-red', bg: 'bg-ecommerce-red/10' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group text-center p-4 sm:p-5 rounded-2xl bg-white dark:bg-ecommerce-surface border border-ecommerce-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-ecommerce-text-primary">{stat.value}</p>
              <p className="text-[11px] sm:text-xs text-ecommerce-text-muted mt-0.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}