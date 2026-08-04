'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function ScrollProgress() {
  const t = useTranslations();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scaleX = useSpring(0, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    scaleX.set(scrollProgress / 100);
  }, [scrollProgress, scaleX]);

  return (
    <motion.div
      className="fixed top-0 start-0 end-0 h-[3px] z-[60] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #2563EB, #E91E63, #7B4397, #00A99D))',
      }}
    />
  );
}