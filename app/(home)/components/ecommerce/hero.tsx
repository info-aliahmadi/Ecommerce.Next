'use client';

import { ArrowRight, Truck, Shield, RotateCcw, Headphones, Sparkles, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated help center' },
];

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const diff = endOfDay.getTime() - now.getTime();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2 mt-6">
      <Clock size={14} className="text-ecommerce-amber" />
      <span className="text-sm text-white/80">Flash Sale ends in</span>
      <div className="flex items-center gap-1.5 ml-1">
        {[
          { value: pad(timeLeft.hours), label: 'HRS' },
          { value: pad(timeLeft.minutes), label: 'MIN' },
          { value: pad(timeLeft.seconds), label: 'SEC' },
        ].map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-1.5">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1.5 min-w-[44px] text-center border border-white/10">
              <span className="text-lg font-bold text-white countdown-digit">{unit.value}</span>
              <p className="text-[8px] text-white/40 uppercase tracking-wider -mt-0.5">{unit.label}</p>
            </div>
            {i < 2 && (
              <span className="text-white/40 font-bold text-sm animate-pulse">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 5 + Math.random() * 10,
    delay: Math.random() * 5,
    opacity: 0.1 + Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity * 0.5, p.opacity * 1.2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function MeshBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Mesh grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mesh" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mesh)" />
      </svg>
      {/* Gradient orbs for depth */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-rose-500/10 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-[120px]" />
    </div>
  );
}

const liveActivities = [
  { name: 'Sarah', city: 'NY', product: 'Wireless Headphones', color: '#E63946' },
  { name: 'Michael', city: 'LA', product: 'Smart Watch Pro', color: '#6A5ACD' },
  { name: 'Emily', city: 'Chicago', product: 'Leather Jacket', color: '#20B2AA' },
  { name: 'David', city: 'Houston', product: 'Running Shoes', color: '#FFC107' },
  { name: 'Lisa', city: 'Miami', product: 'Skincare Kit', color: '#FF69B4' },
  { name: 'James', city: 'Seattle', product: 'Bluetooth Speaker', color: '#10B981' },
];

function LiveActivityStrip() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cycle = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % liveActivities.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(cycle, 4000);
    return () => clearInterval(interval);
  }, [cycle]);

  const activity = liveActivities[currentIndex];

  return (
    <div className="mt-8 pt-6 border-t border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />\n        <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Live</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="flex items-center gap-3"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: activity.color }}
          >
            {activity.name[0]}
          </div>
          <p className="text-xs sm:text-sm text-white/70">
            <span className="text-white/90 font-medium">{activity.name}</span> from {activity.city} just purchased{' '}
            <span className="text-white/90 font-medium">{activity.product}</span>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const socialProofAvatars = [
  { initials: 'AK', color: 'bg-ecommerce-red' },
  { initials: 'BR', color: 'bg-ecommerce-amber' },
  { initials: 'CL', color: 'bg-ecommerce-teal' },
  { initials: 'DP', color: 'bg-ecommerce-purple' },
  { initials: 'ES', color: 'bg-ecommerce-rose' },
  { initials: 'FM', color: 'bg-emerald-500' },
];

function SocialProofAvatars() {
  return (
    <div className="mt-6 flex items-center gap-3 justify-center lg:justify-start">
      <div className="flex -space-x-2">
        {socialProofAvatars.map((avatar, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full ${avatar.color} flex items-center justify-center text-white text-[10px] font-bold border-2 border-white/30`}
          >
            {avatar.initials}
          </div>
        ))}
      </div>
      <p className="text-xs sm:text-sm text-white/60">
        Join <span className="text-white/80 font-medium">50,000+</span> happy shoppers
      </p>
    </div>
  );
}

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=500&fit=crop',
    alt: 'Hot Deals collection',
    badgeEmoji: '🔥',
    badgeTitle: 'Hot Deals',
    badgeSub: 'Up to 60% OFF',
    badgeBg: 'bg-ecommerce-amber/20',
    badgePos: 'absolute -bottom-2 left-6',
    floatAnim: { y: [0, -8, 0] },
    floatDur: 3,
    badgeSize: 'w-12 h-12 rounded-xl',
    textSize: 'text-2xl',
    titleSize: 'text-sm',
    subSize: 'text-xs',
    padding: 'p-4 gap-3 rounded-2xl',
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=500&fit=crop',
    alt: 'New Arrivals collection',
    badgeEmoji: '✨',
    badgeTitle: 'New Arrivals',
    badgeSub: 'Spring 2025',
    badgeBg: 'bg-ecommerce-emerald/20',
    badgePos: 'absolute -top-3 -right-3',
    floatAnim: { y: [0, 6, 0] },
    floatDur: 4,
    badgeSize: 'w-10 h-10 rounded-xl',
    textSize: 'text-xl',
    titleSize: 'text-xs',
    subSize: 'text-[10px]',
    padding: 'p-3 gap-2.5 rounded-2xl',
  },
  {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=500&fit=crop',
    alt: 'Premium Watches collection',
    badgeEmoji: '⌚',
    badgeTitle: 'Premium Watches',
    badgeSub: 'Limited Edition',
    badgeBg: 'bg-ecommerce-purple/20',
    badgePos: 'absolute top-1/3 -left-5',
    floatAnim: { y: [0, -5, 0] },
    floatDur: 3.5,
    badgeSize: 'w-8 h-8 rounded-lg',
    textSize: 'text-sm',
    titleSize: 'text-[11px]',
    subSize: 'text-[9px]',
    padding: 'p-2.5 gap-2 rounded-xl',
  },
  {
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=500&fit=crop',
    alt: 'Athletic Gear collection',
    badgeEmoji: '👟',
    badgeTitle: 'Athletic Gear',
    badgeSub: 'Performance Series',
    badgeBg: 'bg-ecommerce-teal/20',
    badgePos: 'absolute -bottom-2 right-6',
    floatAnim: { y: [0, -7, 0] },
    floatDur: 3.8,
    badgeSize: 'w-11 h-11 rounded-xl',
    textSize: 'text-lg',
    titleSize: 'text-xs',
    subSize: 'text-[10px]',
    padding: 'p-3.5 gap-2.5 rounded-2xl',
  },
];

function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pauseRef = useRef(false);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
    pauseRef.current = true;
    setTimeout(() => {
      pauseRef.current = false;
    }, 2000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!pauseRef.current) {
        setActiveIndex((prev) => (prev + 1) % heroSlides.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[activeIndex];

  return (
    <div className="relative">
      {/* Animated gradient border */}
      <div className="absolute -inset-3 rounded-3xl animated-border" />
      <div className="absolute -inset-4 bg-white/10 rounded-3xl rotate-2" />
      <div className="absolute -inset-4 bg-ecommerce-purple/20 rounded-3xl -rotate-2" />

      {/* Carousel slides */}
      <div className="relative rounded-2xl shadow-2xl w-full h-[420px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            {/* Floating badge */}
            <motion.div
              animate={slide.floatAnim}
              transition={{ duration: slide.floatDur, repeat: Infinity, ease: 'easeInOut' }}
              className={`${slide.badgePos} glass shadow-xl flex items-center ${slide.padding}`}
            >
              <div className={`${slide.badgeSize} ${slide.badgeBg} flex items-center justify-center shrink-0`}>
                <span className={slide.textSize}>{slide.badgeEmoji}</span>
              </div>
              <div>
                <p className={`${slide.titleSize} font-bold text-ecommerce-text-primary`}>{slide.badgeTitle}</p>
                <p className={`${slide.subSize} text-ecommerce-text-muted`}>{slide.badgeSub}</p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              style={{
                width: i === activeIndex ? 24 : 8,
                height: 8,
                backgroundColor: i === activeIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Main Hero */}
      <div className="relative bg-gradient-to-br from-ecommerce-red via-rose-500 to-ecommerce-purple dark:from-ecommerce-red/90 dark:via-rose-600/80 dark:to-ecommerce-purple/90">
        {/* Mesh + Particles */}
        <MeshBackground />
        <FloatingParticles />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-medium mb-6 backdrop-blur-sm border border-white/10"
              >
                <Zap size={14} className="text-ecommerce-amber" />
                New Collection 2025
                <span className="w-2 h-2 rounded-full bg-ecommerce-amber badge-pulse" />
              </motion.span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                Discover Your
                <span className="block mt-1">
                  Perfect{' '}
                  <span className="relative inline-block">
                    Style
                    <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 8 Q25 0, 50 5 Q75 10, 100 3" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </h1>
              <p className="mt-6 text-lg text-white/80 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Explore curated collections of premium products. From tech to fashion, find everything you need with exclusive deals.
              </p>

              {/* Countdown Timer */}
              <CountdownTimer />

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-ecommerce-red hover:bg-white/90 rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-black/10 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] glow-red"
                >
                  <Link href="#products">
                    Shop Now
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/25 text-white hover:bg-white/10 rounded-xl px-8 h-12 text-base font-semibold backdrop-blur-sm hover:border-white/40 transition-all"
                >
                  <Link href="#categories">View Categories</Link>
                </Button>
              </div>
              {/* Stats */}
              <div className="mt-10 flex items-center gap-8 justify-center lg:justify-start">
                {[
                  { value: '10K+', label: 'Products' },
                  { value: '50K+', label: 'Customers' },
                  { value: '99%', label: 'Satisfaction' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Social Proof Avatars */}
              <SocialProofAvatars />

              {/* Live Activity Strip */}
              <LiveActivityStrip />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <HeroCarousel />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white dark:bg-ecommerce-surface border-b border-ecommerce-border relative">
        {/* Subtle top shadow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ecommerce-red/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-ecommerce-border">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-3 justify-center md:justify-start md:px-6 first:md:pl-0 group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-ecommerce-red/10 flex items-center justify-center shrink-0 group-hover:bg-ecommerce-red/15 transition-colors">
                  <f.icon size={18} className="text-ecommerce-red" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ecommerce-text-primary">{f.title}</p>
                  <p className="text-xs text-ecommerce-text-muted">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}