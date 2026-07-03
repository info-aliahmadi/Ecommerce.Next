'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function WelcomeToast() {
  const t = useTranslations();
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(() => {
      const welcomed = localStorage.getItem('shopsphere-welcomed');
      if (!welcomed) {
        toast(t('homepage.welcome.title'), {
          description: t('homepage.welcome.message'),
          duration: 6000,
        });
        localStorage.setItem('shopsphere-welcomed', 'true');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [mounted]);

  return null;
}