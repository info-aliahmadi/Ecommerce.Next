'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  CheckCircle2, ShoppingBag, Truck, Package, Download,
} from 'lucide-react';

import { Button } from '@(home)/_components/ui/button';
import { Separator } from '@(home)/_components/ui/separator';

interface ConfirmationStepProps {
  orderNumber: string;
  email: string;
}

export function ConfirmationStep({ orderNumber, email }: Readonly<ConfirmationStepProps>) {
  const t = useTranslations('homepage.paymentPage');

  return (
    <div className="flex flex-col items-center text-center py-8 px-4">
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-ecommerce-emerald/15 flex items-center justify-center mb-6"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, delay: 0.3 }}
        >
          <CheckCircle2 size={48} className="text-ecommerce-emerald" />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl sm:text-3xl font-extrabold text-ecommerce-text-primary mb-2"
      >
        {t('orderPlaced')}
      </motion.h1>

      <motion.p
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-ecommerce-text-muted max-w-md mb-8"
      >
        {t('orderPlacedDesc')}
      </motion.p>

      {/* Order Number */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-sm p-4 rounded-xl bg-ecommerce-surface-hover border border-ecommerce-border mb-6"
      >
        <p className="text-xs text-ecommerce-text-muted mb-1">{t('orderNumber', { number: orderNumber }).replace(`Order #${orderNumber}`, '') || 'Order Number'}</p>
        <p className="text-lg font-bold text-ecommerce-text-primary font-mono">{orderNumber}</p>
      </motion.div>

      {/* Estimated delivery */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-3 p-4 rounded-xl bg-ecommerce-emerald/10 border border-ecommerce-emerald/20 mb-6"
      >
        <Package size={20} className="text-ecommerce-emerald shrink-0" />
        <div className="text-start">
          <p className="text-sm font-semibold text-ecommerce-emerald">{t('estimatedDelivery')}</p>
          <p className="text-xs text-ecommerce-emerald/70">{t('deliveryDays')}</p>
        </div>
      </motion.div>

      {/* Email confirmation */}
      <motion.p
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-ecommerce-text-muted mb-8"
      >
        {t('emailConfirmation', { email: email || 'your email' })}
      </motion.p>

      {/* Action buttons */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
      >
        <Link href="/profile" className="flex-1">
          <Button className="flex-1 h-12 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-105">
            <Truck size={16} />
            {t('trackOrder')}
          </Button>
        </Link>
        <Link href="/products" className="flex-1">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl font-semibold text-sm gap-2 border-ecommerce-border text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-all hover:scale-105"
          >
            <ShoppingBag size={16} />
            {t('continueShopping')}
          </Button>
        </Link>
      </motion.div>

      {/* Extra links */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="flex items-center gap-4 mt-8"
      >
        <button type='button' className="flex items-center gap-1.5 text-xs text-ecommerce-text-muted hover:text-ecommerce-red transition-colors">
          <Download size={14} />
          {t('downloadInvoice')}
        </button>
        <Separator orientation="vertical" className="h-4 bg-ecommerce-border" />
        <button type='button' className="flex items-center gap-1.5 text-xs text-ecommerce-text-muted hover:text-ecommerce-red transition-colors">
          {t('needHelp')}?
        </button>
      </motion.div>

      {/* Need help */}
      <motion.p
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="text-[11px] text-ecommerce-text-muted mt-6"
      >
        {t('contactSupport')}
      </motion.p>
    </div>
  );
}
