'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { toast } from 'sonner';

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function WelcomeToast() {
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(() => {
      const welcomed = localStorage.getItem('shopsphere-welcomed');
      if (!welcomed) {
        toast('Welcome to ShopSphere! 🎉', {
          description: 'Use code FIRST10 for 10% off your first order',
          duration: 6000,
        });
        localStorage.setItem('shopsphere-welcomed', 'true');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [mounted]);

  return null;
}