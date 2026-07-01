'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function BackToTop() {
  const t = useTranslations();
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;

      setShow(scrollY > 400);
      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-20 sm:bottom-8 end-4 sm:end-6 z-40 group"
          aria-label={t('backToTop.label')}
        >
          {/* Progress ring */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-ecommerce-border dark:text-white/10"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="text-ecommerce-red transition-all duration-150"
              />
            </svg>
            {/* Button */}
            <div className="absolute inset-1 rounded-full bg-white dark:bg-ecommerce-surface shadow-lg border border-ecommerce-border flex items-center justify-center group-hover:bg-ecommerce-red group-hover:border-ecommerce-red transition-all duration-300">
              <ArrowUp size={18} className="text-ecommerce-text-primary group-hover:text-white transition-colors" />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}