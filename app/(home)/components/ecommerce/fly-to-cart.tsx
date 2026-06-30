'use client';

import { useEffect, useState, useCallback, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface FlyingItem {
  id: string;
  image: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface FlyToCartEventDetail {
  id: string;
  image: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function triggerFlyToCart(imageUrl: string, sourceElement: HTMLElement) {
  if (typeof window === 'undefined') return;

  const sourceRect = sourceElement.getBoundingClientRect();
  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;

  // Find cart button by aria-label
  const cartButton = document.querySelector('[aria-label="Cart"]') as HTMLElement;
  let endX = 0;
  let endY = 0;

  if (cartButton) {
    const cartRect = cartButton.getBoundingClientRect();
    endX = cartRect.left + cartRect.width / 2;
    endY = cartRect.top + cartRect.height / 2;
  } else {
    // Fallback: top-right corner
    endX = window.innerWidth - 40;
    endY = 30;
  }

  const detail: FlyToCartEventDetail = {
    id: `fly-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    image: imageUrl,
    startX,
    startY,
    endX,
    endY,
  };

  window.dispatchEvent(new CustomEvent('fly-to-cart', { detail }));
}

export function FlyToCart() {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const handleFlyEvent = useCallback((e: Event) => {
    const detail = (e as CustomEvent<FlyToCartEventDetail>).detail;
    if (!detail) return;

    const item: FlyingItem = {
      id: detail.id,
      image: detail.image,
      startX: detail.startX,
      startY: detail.startY,
      endX: detail.endX,
      endY: detail.endY,
    };

    setFlyingItems((prev) => [...prev, item]);

    // Remove after animation completes (600ms + buffer)
    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((i) => i.id !== item.id));

      // Trigger badge bounce
      const cartButton = document.querySelector('[aria-label="Cart"]') as HTMLElement;
      if (cartButton) {
        const badge = cartButton.querySelector('div > div') as HTMLElement;
        if (badge) {
          badge.classList.remove('badge-bounce');
          // Force reflow to restart animation
          void badge.offsetWidth;
          badge.classList.add('badge-bounce');
          badge.addEventListener('animationend', () => {
            badge.classList.remove('badge-bounce');
          }, { once: true });
        }
      }
    }, 650);
  }, []);

  useEffect(() => {
    window.addEventListener('fly-to-cart', handleFlyEvent);
    return () => window.removeEventListener('fly-to-cart', handleFlyEvent);
  }, [handleFlyEvent]);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none" style={{ position: 'fixed', inset: 0, zIndex: 9998 }}>
      <AnimatePresence>
        {flyingItems.map((item) => {
          // Control point above the midpoint for a curved arc
          const midX = (item.startX + item.endX) / 2;
          const midY = Math.min(item.startY, item.endY) - 120;

          return (
            <motion.div
              key={item.id}
              initial={{
                left: item.startX - 20,
                top: item.startY - 20,
                width: 40,
                height: 40,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                left: [
                  item.startX - 20,
                  midX - 15,
                  item.endX - 10,
                ],
                top: [
                  item.startY - 20,
                  midY - 15,
                  item.endY - 10,
                ],
                width: [40, 30, 20],
                height: [40, 30, 20],
                opacity: [1, 1, 0.8],
                scale: [1, 0.9, 0.6],
              }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                opacity: { duration: 0.6, ease: 'easeIn' },
              }}
              style={{
                position: 'fixed',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(230, 57, 70, 0.35)',
              }}
            >
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}