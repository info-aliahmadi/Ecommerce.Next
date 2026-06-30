'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageComparisonProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BEFORE_IMG = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop&q=80';
const AFTER_IMG = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=500&fit=crop&q=80';

export function ImageComparison({
  beforeImage = BEFORE_IMG,
  afterImage = AFTER_IMG,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: ImageComparisonProps) {
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
            See the <span className="gradient-text-warm">Transformation</span>
          </h2>
          <p className="text-ecommerce-text-secondary mt-2 text-sm md:text-base">
            Drag the slider to compare before &amp; after
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
              alt={afterLabel}
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
                alt={beforeLabel}
                className="absolute top-0 left-0 h-full object-cover"
                style={{ width: '200vw', maxWidth: 'none' }}
                draggable={false}
              />
            </div>

            {/* Before label */}
            <div
              className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider pointer-events-none z-10"
              style={{ opacity: position > 15 ? 1 : 0 }}
            >
              {beforeLabel}
            </div>

            {/* After label */}
            <div
              className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider pointer-events-none z-10"
              style={{ opacity: position < 85 ? 1 : 0 }}
            >
              {afterLabel}
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
                <ChevronLeft size={16} className="text-ecommerce-text-primary -ml-0.5" />
                <ChevronRight size={16} className="text-ecommerce-text-primary -mr-0.5" />
              </div>
            </div>

            {/* Overlay gradient edges for polish */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/10 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}