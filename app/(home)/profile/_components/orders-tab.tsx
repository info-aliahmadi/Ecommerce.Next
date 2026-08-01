'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, ChevronRight, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { Card, CardContent } from '../../_components/ui/card';
import { Button } from '../../_components/ui/button';
import { STATUS_CONFIG, staggerContainer, staggerItem } from './types';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';
import MyOrderService from '@root/app/(home)/_services/MyOrderService';
import OrderModel from '@root/app/dashboard/(ecommerce)/_types/Order/OrderModel';
import OrderStatus from '@root/app/types/enums/OrderStatus';
import { GetImage } from '../../_lib/utils';
import FileUploadModel from '@root/app/dashboard/(filestorage)/_types/FileUploadModel';

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
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

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
          setOrders(result.data || []);
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

  const toggleExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
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
            <p className="text-sm text-ecommerce-text-muted">{t('homepage.common.loading')}</p>
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
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const statusString = mapOrderStatus(order.orderStatusId);

            return (
              <motion.div key={order.id} variants={staggerItem}>
                <Card className="bg-ecommerce-surface border-ecommerce-border hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-ecommerce-text-primary">
                            {t('homepage.profile.orderNumber', { number: order.id })}
                          </h3>
                          {statusBadge(statusString)}
                        </div>
                        <div className="flex items-center gap-4 mt-1.5 text-sm text-ecommerce-text-muted">
                          <span>{t('homepage.profile.orderDate', { date: new Date(order.createdOnUtc).toLocaleDateString() })}</span>
                          <span className="hidden sm:inline">·</span>
                          <span>{t('homepage.profile.itemsLabel', { count: order.items.length })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-base font-bold text-ecommerce-text-primary">
                          {t('homepage.profile.orderTotal', { amount: CurrencyViewer(order.totalAmount, order.userCurrencyType) })}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-ecommerce-border hover:border-ecommerce-red hover:text-ecommerce-red transition-colors shrink-0"
                          onClick={() => toggleExpand(order.id)}
                        >
                          {t('homepage.profile.viewOrder')}
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 ms-1 rtl:rotate-180" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 ms-1 rtl:rotate-180" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-ecommerce-border">
                        <div className="space-y-3">
                          {order.items.map((item) => {
                            const imagePreview = item.productImagePreview as FileUploadModel | undefined;
                            const imageSrc = GetImage(imagePreview, true);

                            return (
                              <div key={item.id} className="flex items-center gap-3 py-2">
                                <div className="w-12 h-12 rounded-md border border-ecommerce-border overflow-hidden bg-ecommerce-surface-hover shrink-0">
                                  <img
                                    src={imageSrc}
                                    alt={item.productName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-ecommerce-text-primary truncate">
                                    {item.productName || `Item #${item.id}`}
                                  </p>
                                  <p className="text-xs text-ecommerce-text-muted">
                                    {t('homepage.profile.itemsLabel', { count: item.quantity })}
                                  </p>
                                </div>
                                <span className="text-sm font-bold text-ecommerce-text-primary shrink-0">
                                  {CurrencyViewer(item.unitPrice * item.quantity, order.userCurrencyType)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
