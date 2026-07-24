'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

import { Button } from '@(home)/_components/ui/button';
import { Footer } from '@(home)/_components/ecommerce/footer';
import { BackToTop } from '@(home)/_components/ecommerce/back-to-top';
import { MobileBottomNav } from '@(home)/_components/ecommerce/mobile-bottom-nav';

export function EmptyCart() {
  const t = useTranslations('homepage.paymentPage');

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-ecommerce-surface">
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 rounded-full bg-ecommerce-surface-hover flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-ecommerce-text-muted" />
          </div>
          <h1 className="text-2xl font-extrabold text-ecommerce-text-primary mb-2">
            {t('emptyCart')}
          </h1>
          <p className="text-ecommerce-text-muted mb-8">{t('emptyCartDesc')}</p>
          <Link href="/products">
            <Button className="h-12 px-8 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-105">
              <ShoppingBag size={16} />
              {t('goShopping')}
            </Button>
          </Link>
        </motion.div>
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
      <BackToTop />
      <MobileBottomNav />
    </div>
  );
}
