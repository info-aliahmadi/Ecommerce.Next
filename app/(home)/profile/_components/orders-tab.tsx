'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { Card, CardContent } from '../../_components/ui/card';
import { Button } from '../../_components/ui/button';
import { STATUS_CONFIG, staggerContainer, staggerItem } from './types';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';
import MyOrderService from '@root/app/(home)/_services/MyOrderService';
import OrderModel from '@root/app/dashboard/(ecommerce)/_types/Order/OrderModel';
import OrderItemModel from '@root/app/dashboard/(ecommerce)/_types/Order/OrderItemModel';
import OrderStatus from '@root/app/types/enums/OrderStatus';

function mapOrderStatus(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Pending:
      return 'pending';
    case OrderStatus.Processing:
      return 'processing';
    case OrderStatus.Complete:
      return 'delivered';
    case OrderStatus.Cancelled:
      return 'cancelled';
    default:
      return 'pending';
  }
}

export function OrdersTab() {
  const t = useTranslations();
  const { data: session } = useSession();
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemCounts, setItemCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.accessToken) {
        setLoading(false);
        return;
      }

      const service = new MyOrderService(session.user.accessToken);

      try {
        const result = await service.getMyOrders();
        if (result.succeeded && result.data) {
          const ordersData = result.data.items || [];
          setOrders(ordersData);

          const itemCountPromises = ordersData.map((order) =>
            service.getMyOrderItems(order.id).then((itemResult) => ({
              orderId: order.id,
              count: itemResult.succeeded && itemResult.data ? itemResult.data.length : 0,
            }))
          );

          const itemCountsResult = await Promise.all(itemCountPromises);
          const counts: Record<number, number> = {};
          itemCountsResult.forEach(({ orderId, count }) => {
            counts[orderId] = count;
          });
          setItemCounts(counts);
        } else {
          setError(result.message || 'Failed to fetch orders');
        }
      } catch {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session?.user?.accessToken]);

  const statusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status];
    if (!cfg) return null;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
        {t(cfg.labelKey)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.orderHistory')}</h2>
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardContent className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-ecommerce-surface-hover flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-ecommerce-text-muted" />
            </div>
            <p className="text-sm text-ecommerce-text-muted">{t('homepage.profile.loading') || 'Loading...'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.orderHistory')}</h2>
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardContent className="py-12 flex flex-col items-center text-center">
            <p className="text-sm text-ecommerce-text-muted">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.orderHistory')}</h2>

      {orders.length === 0 ? (
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
          {orders.map((order) => (
            <motion.div key={order.id} variants={staggerItem}>
              <Card className="bg-ecommerce-surface border-ecommerce-border hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-ecommerce-text-primary">
                          {t('homepage.profile.orderNumber', { number: order.id })}
                        </h3>
                        {statusBadge(mapOrderStatus(order.orderStatusId))}
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 text-sm text-ecommerce-text-muted">
                        <span>{t('homepage.profile.orderDate', { date: new Date(order.createdOnUtc).toLocaleDateString() })}</span>
                        <span className="hidden sm:inline">·</span>
                        <span>{t('homepage.profile.itemsLabel', { count: itemCounts[order.id] ?? 0 })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-base font-bold text-ecommerce-text-primary">
                        {t('homepage.profile.orderTotal', { amount: CurrencyViewer(order.totalAmount, order.userCurrencyType) })}
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
