'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ImageComparisonProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BEFORE_IMG = '/images/before.jpg';
const AFTER_IMG = '/images/after.jpg';

export function ImageComparison({
  beforeImage = BEFORE_IMG,
  afterImage = AFTER_IMG,
  beforeLabel,
  afterLabel,
}: Readonly<ImageComparisonProps>) {
  const t = useTranslations();
  const resolvedBeforeLabel = beforeLabel ?? t('homepage.imageComparison.before');
  const resolvedAfterLabel = afterLabel ?? t('homepage.imageComparison.after');
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setPosition(percent);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Prevent text selection while dragging
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      return () => {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
      };
    }
  }, [isDragging]);

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-ecommerce-text-primary">
            {t('homepage.imageComparison.title').split('homepage. ').slice(0, -1).join(' ')} <span className="gradient-text-warm">{t('homepage.imageComparison.title').split('homepage. ').slice(-1)}</span>
          </h2>
          <p className="text-ecommerce-text-secondary mt-2 text-sm md:text-base">
            {t('homepage.imageComparison.dragHint')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl cursor-col-resize select-none touch-none"
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* After image (full width, underneath) */}
          <div className="relative aspect-[16/10] md:aspect-[16/9]">
            <img
              src={afterImage}
              alt={resolvedAfterLabel}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />

            {/* Before image (clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${position}%` }}
            >
              <img
                src={beforeImage}
                alt={resolvedBeforeLabel}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
            </div>

            {/* Before label */}
            <div
              className="absolute top-4 start-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider pointer-events-none z-10"
              style={{ opacity: position > 15 ? 1 : 0 }}
            >
              {resolvedBeforeLabel}
            </div>

            {/* After label */}
            <div
              className="absolute top-4 end-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider pointer-events-none z-10"
              style={{ opacity: position < 85 ? 1 : 0 }}
            >
              {resolvedAfterLabel}
            </div>

            {/* Divider line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white z-20 pointer-events-none"
              style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
            />

            {/* Handle */}
            <div
              className="absolute top-1/2 z-30 pointer-events-none"
              style={{ left: `${position}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center gap-0.5 transition-transform duration-150 ${isDragging ? 'scale-110' : 'scale-100'}`}
              >
                <ChevronLeft size={16} className="text-ecommerce-text-primary -ms-0.5" />
                <ChevronRight size={16} className="text-ecommerce-text-primary -me-0.5" />
              </div>
            </div>

            {/* Overlay gradient edges for polish */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute start-0 top-0 bottom-0 w-8 bg-gradient-to-e from-black/10 to-transparent" />
              <div className="absolute end-0 top-0 bottom-0 w-8 bg-gradient-to-s from-black/10 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}