'use client';

import { useCartStore } from '../../_lib/store';
import {
  Shield, Lock, Truck, ChevronRight
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import CONFIG from '@root/config';

export function CheckoutSheet() {
  const { items, isCartOpen, setCartOpen } = useCartStore();
  const t = useTranslations();
  const navigate = useRouter();
  const startCheckout = () => {
    setCartOpen(false);
    navigate.push('/checkout');
  };

  return (
    <>
      {/* Checkout trigger in cart - redirects to checkout page */}
      {isCartOpen && items.length > 0 && (
        <div className="shrink-0 px-4 pb-4 pt-2 bg-white dark:bg-ecommerce-surface">
          <Button
            onClick={startCheckout}
            className="flex items-center justify-center w-full h-12 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-[1.01] active:scale-95"
          >
            {t('homepage.cart.checkout')}
            <ChevronRight size={16} />
          </Button>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-[10px] text-ecommerce-text-muted">
              <Lock size={10} /> {t('homepage.checkout.sslEncrypted')}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-ecommerce-text-muted">
              <Shield size={10} /> {t('homepage.hero.securePayment')}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-ecommerce-text-muted">
              <Truck size={10} /> {t('homepage.hero.onOrders', { amount: CONFIG.FREE_SHIPPING_THRESHOLD })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}