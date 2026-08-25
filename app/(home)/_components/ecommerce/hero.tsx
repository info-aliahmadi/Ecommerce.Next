'use client';

import { ArrowRight, Truck, Shield, RotateCcw, Headphones, Sparkles, Zap, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import HomePageService from '../../_services/HomePageService';
import CONFIG from '@root/config';
import SlideshowDisplayModel from '../../_types/SlideshowDisplayModel';
import { GetImage } from '../../_lib/utils';
import CurrencyViewer from '@root/utils/CurrencyViewer';

interface SlideModel {
  header?: string;
  description?: string;
  alt?: string;
  image?: string;
  badgeEmoji?: string;
  badgeTitle?: string;
  badgeSub?: string;
  badgeBg?: string;
  badgePos?: string;
  floatAnim: {
    y: number[];
  };
  floatDur?: number;
  badgeSize?: string;
  textSize?: string;
  titleSize?: string;
  subSize?: string;
  padding?: string;
}

const liveActivities = [
  { name: 'Sarah', city: 'NY', product: 'Wireless Headphones', color: '#2563EB' },
  { name: 'Michael', city: 'LA', product: 'Smart Watch Pro', color: '#7B4397' },
  { name: 'Emily', city: 'Chicago', product: 'Leather Jacket', color: '#00A99D' },
  { name: 'David', city: 'Houston', product: 'Running Shoes', color: '#FFD600' },
  { name: 'Lisa', city: 'Miami', product: 'Skincare Kit', color: '#E91E63' },
  { name: 'James', city: 'Seattle', product: 'Bluetooth Speaker', color: '#10B981' },
];

const badgeEmojis = ['🔥', '✨', '⌚', '👟', '👜', '💎', '🎁', '⚡', '🌟', '🎯'];
const badgeBgs = [
  'bg-ecommerce-amber/20',
  'bg-ecommerce-emerald/20',
  'bg-ecommerce-purple/20',
  'bg-ecommerce-teal/20',
  'bg-ecommerce-rose/20',
  'bg-ecommerce-red/20',
];
const badgePositions = [
  'absolute -bottom-2 start-6',
  'absolute -top-3 -end-3',
  'absolute top-1/3 -start-5',
  'absolute -bottom-2 end-6',
  'absolute top-5 -start-3',
  'absolute bottom-8 end-8',
];
const badgeSizes = [
  'w-12 h-12 rounded-xl',
  'w-10 h-10 rounded-xl',
  'w-8 h-8 rounded-lg',
  'w-11 h-11 rounded-xl',
  'w-9 h-9 rounded-lg',
];
const textSizes = ['text-2xl', 'text-xl', 'text-sm', 'text-lg'];
const titleSizes = ['text-sm', 'text-xs', 'text-[11px]'];
const subSizes = ['text-xs', 'text-[10px]', 'text-[9px]'];
const paddings = [
  'p-4 gap-3 rounded-2xl',
  'p-3 gap-2.5 rounded-2xl',
  'p-2.5 gap-2 rounded-xl',
  'p-3.5 gap-2.5 rounded-2xl',
];

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const floatAnimPresets: { y: number[] }[] = [
  { y: [0, -8, 0] },
  { y: [0, 6, 0] },
  { y: [0, -5, 0] },
  { y: [0, -7, 0] },
];

function randomizeSlidePadding(index: number) {
  const seed = index * 17 + 3;
  return {
    badgeEmoji: badgeEmojis[seed % badgeEmojis.length],
    badgeBg: badgeBgs[(seed + 2) % badgeBgs.length],
    badgePos: badgePositions[(seed + 5) % badgePositions.length],
    floatAnim: floatAnimPresets[(seed + 1) % floatAnimPresets.length],
    floatDur: 3 + ((seed + 7) % 3),
    badgeSize: badgeSizes[(seed + 3) % badgeSizes.length],
    textSize: textSizes[(seed + 4) % textSizes.length],
    titleSize: titleSizes[(seed + 1) % titleSizes.length],
    subSize: subSizes[(seed + 6) % subSizes.length],
    padding: paddings[(seed + 2) % paddings.length],
  };
}

function mapBackendSlides(slides: SlideshowDisplayModel[]) {
  return slides.map((slide, index) => {
    const random = randomizeSlidePadding(index);
    return {
      header: slide.header,
      description: slide.description,
      image: GetImage(slide.previewImage),
      alt: slide.header || `Slide ${index + 1}`,
      badgeEmoji: random.badgeEmoji,
      badgeTitle: slide.header || '',
      badgeSub: slide.description || '',
      badgeBg: random.badgeBg,
      badgePos: random.badgePos,
      floatAnim: random.floatAnim,
      floatDur: random.floatDur,
      badgeSize: random.badgeSize,
      textSize: random.textSize,
      titleSize: random.titleSize,
      subSize: random.subSize,
      padding: random.padding,
    } as SlideModel;
  });
}

function CountdownTimer() {
  const t = useTranslations();
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
      <span className="text-sm text-white/80">{t('homepage.hero.flashSaleEnds')}</span>
      <div className="flex items-center gap-1.5 ms-1">
        {[
          { value: pad(timeLeft.hours), label: t('homepage.hero.hrs') },
          { value: pad(timeLeft.minutes), label: t('homepage.hero.min') },
          { value: pad(timeLeft.seconds), label: t('homepage.hero.sec') },
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
      <div className="absolute -top-40 -end-40 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px]" />
      <div className="absolute -bottom-40 -start-40 w-[400px] h-[400px] rounded-full bg-rose-500/10 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-[120px]" />
    </div>
  );
}


function LiveActivityStrip() {
  const t = useTranslations();
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
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">{t('homepage.hero.live')}</span>
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
            {t('homepage.hero.justPurchased', { name: activity.name, city: activity.city, product: activity.product })}
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
  const t = useTranslations();
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
        {t('homepage.hero.joinShoppers', { count: '50,000' })}
      </p>
    </div>
  );
}

function HeroCarousel() {
  const { data: slideshows = [], isLoading } = useQuery({
    queryKey: ['slideshows'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getSlideshows();
      const items = result.succeeded ? result?.data || [] : [];
      items.sort((a: SlideshowDisplayModel, b: SlideshowDisplayModel) => (a.order ?? 0) - (b.order ?? 0));
      return items;
    },
  });

  const heroSlides = mapBackendSlides(slideshows ?? []);

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
    if (heroSlides.length === 0) return;
    const interval = setInterval(() => {
      if (!pauseRef.current) {
        setActiveIndex((prev) => (prev + 1) % heroSlides.length);
      }
    }, 5000);
    return () => clearInterval(interval);

  }, [heroSlides.length]);

  if (isLoading) {
    return (
      <div className="relative rounded-2xl shadow-2xl w-full h-[420px] overflow-hidden bg-gradient-to-br from-ecommerce-red/20 via-rose-500/10 to-ecommerce-purple/20" />
    );
  }

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
              src={slide?.image}
              alt={slide?.alt}
              className="w-full h-full object-cover"
            />
            {/* Floating badge */}
            <motion.div
              animate={slide?.floatAnim}
              transition={{ duration: slide?.floatDur, repeat: Infinity, ease: 'easeInOut' }}
              className={`${slide?.badgePos} glass shadow-xl flex items-center ${slide?.padding}`}
            >
              <div className={`${slide?.badgeSize} ${slide?.badgeBg} flex items-center justify-center shrink-0`}>
                <span className={slide?.textSize}>{slide?.badgeEmoji}</span>
              </div>
              <div>
                <p className={`${slide?.titleSize} font-bold text-ecommerce-text-primary`}>{slide?.badgeTitle}</p>
                <p className={`${slide?.subSize} text-ecommerce-text-muted`}>{slide?.badgeSub}</p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {heroSlides?.map((_, i) => (
            <button
              type="button"
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
  const t = useTranslations();

  const features = [
    { icon: Truck, title: t('homepage.hero.freeShipping'), desc: t('homepage.hero.onOrders', { amount: CurrencyViewer(CONFIG.FREE_SHIPPING_THRESHOLD, CONFIG.DEFAULT_CURRENCY) }) },
    { icon: Shield, title: t('homepage.hero.securePayment'), desc: t('homepage.hero.protected') },
    { icon: RotateCcw, title: t('homepage.hero.easyReturns'), desc: t('homepage.hero.returnPolicy') },
    { icon: Headphones, title: t('homepage.hero.support247'), desc: t('homepage.hero.helpCenter') },
  ];

  const stats = [
    { value: '10K+', label: t('homepage.hero.productsCount') },
    { value: '50K+', label: t('homepage.hero.customersCount') },
    { value: '99%', label: t('homepage.hero.satisfactionCount') },
  ];

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
              className="text-center lg:text-start"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-medium mb-6 backdrop-blur-sm border border-white/10"
              >
                <Zap size={14} className="text-ecommerce-amber" />
                {t('homepage.hero.badge')}
                <span className="w-2 h-2 rounded-full bg-ecommerce-amber badge-pulse" />
              </motion.span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                {t('homepage.hero.title1')}
                <span className="block mt-1">
                  {t('homepage.hero.title2')}{' '}
                  <span className="relative inline-block">
                    Style
                    <svg className="absolute -bottom-1 start-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 8 Q25 0, 50 5 Q75 10, 100 3" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </h1>
              <p className="mt-6 text-lg text-white/80 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                {t('homepage.hero.subtitle')}
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
                    {t('homepage.hero.shopNow')}
                    <ArrowRight size={18} className="ms-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white bg-white/10 hover:bg-white/30 hover:text-white rounded-xl px-8 h-12 text-base font-semibold backdrop-blur-sm hover:border-white/40 transition-all "
                >
                  <Link href="#categories">{t('homepage.hero.viewCategories')}</Link>
                </Button>
              </div>
              {/* Stats */}
              <div className="mt-10 flex items-center gap-8 justify-center lg:justify-start">
                {stats.map((stat, i) => (
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
        <div className="absolute top-0 start-0 end-0 h-px bg-gradient-to-r from-transparent via-ecommerce-red/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-ecommerce-border">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-3 justify-center md:justify-start md:px-6 first:md:ps-0 group cursor-default"
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