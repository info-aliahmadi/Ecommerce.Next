'use client';

import { motion, useInView } from 'framer-motion';
import { Truck, Shield, RotateCcw, Headphones, BadgePercent, Zap, ShieldCheck } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

function AnimatedMetric({ value, suffix = '' }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const startTime = performance.now();
    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [isInView, value]);

  return <span ref={ref} className="count-up">{count.toLocaleString()}{suffix}</span>;
}

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On all orders over $50',
    metric: '$0',
    metricValue: 0,
    metricSuffix: '',
    color: 'ecommerce-amber',
    bgClass: 'bg-ecommerce-amber/10',
    iconClass: 'text-ecommerce-amber',
    metricClass: 'text-ecommerce-amber',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: 'SSL encrypted checkout',
    metric: '100%',
    metricValue: 100,
    metricSuffix: '%',
    color: 'ecommerce-red',
    bgClass: 'bg-ecommerce-red/10',
    iconClass: 'text-ecommerce-red',
    metricClass: 'text-ecommerce-red',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: 'Hassle-free 30-day returns',
    metric: '30 Days',
    metricValue: 30,
    metricSuffix: ' Days',
    color: 'ecommerce-teal',
    bgClass: 'bg-ecommerce-teal/10',
    iconClass: 'text-ecommerce-teal',
    metricClass: 'text-ecommerce-teal',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated help center',
    metric: '24/7',
    metricValue: 0,
    metricSuffix: '',
    color: 'ecommerce-purple',
    bgClass: 'bg-ecommerce-purple/10',
    iconClass: 'text-ecommerce-purple',
    metricClass: 'text-ecommerce-purple',
  },
  {
    icon: BadgePercent,
    title: 'Best Prices',
    description: 'Price match guarantee',
    metric: '50K+',
    metricValue: 50000,
    metricSuffix: 'K+',
    color: 'ecommerce-rose',
    bgClass: 'bg-ecommerce-rose/10',
    iconClass: 'text-ecommerce-rose',
    metricClass: 'text-ecommerce-rose',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Express shipping available',
    metric: '< 3 Days',
    metricValue: 3,
    metricSuffix: ' Days',
    color: 'ecommerce-emerald',
    bgClass: 'bg-ecommerce-emerald/10',
    iconClass: 'text-ecommerce-emerald',
    metricClass: 'text-ecommerce-emerald',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants : any = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function TrustSection() {
  const t = useTranslations();

  return (
    <section className="py-14 sm:py-20 relative overflow-hidden bg-gradient-to-b from-transparent via-ecommerce-red/[0.02] to-transparent">
      {/* Background decorations */}
      <div className="absolute inset-0 grid-bg-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-ecommerce-purple/[0.04] rounded-full -translate-y-1/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-ecommerce-amber/[0.05] rounded-full translate-y-1/3 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-56 h-56 bg-ecommerce-emerald/[0.03] rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ecommerce-emerald/10 text-ecommerce-emerald text-xs font-semibold uppercase tracking-widest mb-3"
          >
            <ShieldCheck size={12} />
            Why Choose Us
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ecommerce-text-primary tracking-tight"
          >
            {t('homepage.trust.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm text-ecommerce-text-muted mt-3 max-w-lg mx-auto"
          >
            We&apos;re committed to making your shopping experience seamless, secure, and satisfying every step of the way.
          </motion.p>
          {/* Decorative dot divider */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-6 flex items-center justify-center gap-2"
          >
            <div className="h-px w-8 bg-ecommerce-border" />
            <div className="h-1.5 w-1.5 rounded-full bg-ecommerce-emerald" />
            <div className="h-px w-8 bg-ecommerce-border" />
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="scroll-reveal group bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5 sm:p-6 premium-shadow hover:-translate-y-1 transition-transform duration-300 cursor-default"
            >
              {/* Icon container */}
              <div className={`w-12 h-12 rounded-xl ${feature.bgClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={22} className={feature.iconClass} strokeWidth={1.8} />
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold text-ecommerce-text-primary mb-1.5">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-ecommerce-text-muted leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Metric */}
              <div className="inline-flex items-center gap-1.5">
                {feature.metricValue > 0 ? (
                  <>
                    {feature.metric === '50K+' && <span className="text-xs font-medium text-ecommerce-text-muted">~</span>}
                    <span className={`text-lg sm:text-xl font-extrabold ${feature.metricClass}`}>
                      <AnimatedMetric value={feature.metricValue} suffix={feature.metricSuffix} />
                    </span>
                  </>
                ) : (
                  <span className={`text-lg sm:text-xl font-extrabold ${feature.metricClass}`}>
                    {feature.metric}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}