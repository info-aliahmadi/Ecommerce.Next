'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';

import { Card, CardContent } from '../../_components/ui/card';
import { Button } from '../../_components/ui/button';
import { MockOrder, STATUS_CONFIG, staggerContainer, staggerItem } from './types';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';

const MOCK_ORDERS: MockOrder[] = [
  { id: 'o1', orderNum: 1247, date: '2024-12-15', status: 'delivered', items: 3, total: 289.97 },
  { id: 'o2', orderNum: 1251, date: '2025-01-03', status: 'shipped', items: 1, total: 149.99 },
  { id: 'o3', orderNum: 1268, date: '2025-01-18', status: 'processing', items: 2, total: 449.50 },
  { id: 'o4', orderNum: 1275, date: '2025-02-01', status: 'pending', items: 4, total: 359.96 },
];

export function OrdersTab() {
  const t = useTranslations();
  const statusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status];
    if (!cfg) return null;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
        {t(cfg.labelKey)}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.orderHistory')}</h2>

      {MOCK_ORDERS.length === 0 ? (
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardContent className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-ecommerce-surface-hover flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-ecommerce-text-muted" />
            </div>
            <h3 className="font-semibold text-ecommerce-text-primary">{t('homepage.profile.noOrders')}</h3>
            <p className="text-sm text-ecommerce-text-muted mt-1 max-w-sm">{t('homepage.profile.noOrdersDesc')}</p>
            <Button asChild className="mt-4 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white">
              <Link href="/">{t('homepage.profile.startShopping')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
          {MOCK_ORDERS.map((order) => (
            <motion.div key={order.id} variants={staggerItem}>
              <Card className="bg-ecommerce-surface border-ecommerce-border hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-ecommerce-text-primary">
                          {t('homepage.profile.orderNumber', { number: order.orderNum })}
                        </h3>
                        {statusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 text-sm text-ecommerce-text-muted">
                        <span>{t('homepage.profile.orderDate', { date: order.date })}</span>
                        <span className="hidden sm:inline">·</span>
                        <span>{t('homepage.profile.itemsLabel', { count: order.items })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-base font-bold text-ecommerce-text-primary">
                        {t('homepage.profile.orderTotal', { amount: CurrencyViewer(order.total, CONFIG.DEFAULT_CURRENCY) })}
                      </span>
                      <Button variant="outline" size="sm" className="border-ecommerce-border hover:border-ecommerce-red hover:text-ecommerce-red transition-colors shrink-0">
                        {t('homepage.profile.viewOrder')}
                        <ChevronRight className="w-3.5 h-3.5 ms-1 rtl:rotate-180" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
