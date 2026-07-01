'use client';

import { useEffect, useRef, useCallback } from 'react';

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    // Observe all scroll-reveal children within the container
    const revealElements = element.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
    );
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [handleIntersection]);

  return ref;
}