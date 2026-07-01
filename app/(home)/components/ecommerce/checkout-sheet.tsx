'use client';

import { useCartStore, useUIStore } from '../../lib/store';
import { Button } from '../ui/button';
import {
  Shield, Lock, Truck, ChevronRight
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export function CheckoutSheet() {
  const { items, isCartOpen, setCartOpen } = useCartStore();
  const { navigate } = useUIStore();
  const t = useTranslations();

  const startCheckout = () => {
    setCartOpen(false);
    navigate('checkout');
  };

  return (
    <>
      {/* Checkout trigger in cart - redirects to checkout page */}
      {isCartOpen && items.length > 0 && (
        <div className="absolute bottom-0 start-0 end-0 p-4 bg-white dark:bg-ecommerce-surface border-t border-ecommerce-border">
          <Button
            onClick={startCheckout}
            className="w-full h-12 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-[1.01] active:scale-95"
          >
            {t('cart.checkout')}
            <ChevronRight size={16} />
          </Button>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-[10px] text-ecommerce-text-muted">
              <Lock size={10} /> {t('checkout.sslEncrypted')}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-ecommerce-text-muted">
              <Shield size={10} /> {t('hero.securePayment')}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-ecommerce-text-muted">
              <Truck size={10} /> {t('hero.onOrders')}
            </div>
          </div>
        </div>
      )}
    </>
  );
}