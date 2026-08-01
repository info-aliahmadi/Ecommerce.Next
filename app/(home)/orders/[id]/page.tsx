'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../../_components/ui/card';
import { Button } from '../../_components/ui/button';
import { Separator } from '../../_components/ui/separator';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';
import MyOrderService from '@root/app/(home)/_services/MyOrderService';
import OrderModel from '@root/app/dashboard/(ecommerce)/_types/Order/OrderModel';
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

export default function OrderDetailPage() {
  const t = useTranslations();
  const { data: session } = useSession();
  const params = useParams();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<OrderModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!session?.user?.accessToken || !orderId) {
        setLoading(false);
        return;
      }

      const service = new MyOrderService(session.user.accessToken);

      try {
        const result = await service.getMyOrderById(orderId);
        if (result.succeeded && result.data) {
          setOrder(result.data);
        } else {
          setError(result.message || 'Failed to fetch order');
        }
      } catch {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [session?.user?.accessToken, orderId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/profile"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.orderHistory')}</h2>
        </div>
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardContent className="py-12 flex flex-col items-center text-center">
            <Loader2 className="w-8 h-8 text-ecommerce-red animate-spin mb-4" />
            <p className="text-sm text-ecommerce-text-muted">{t('homepage.common.loading')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/profile"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.orderHistory')}</h2>
        </div>
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardContent className="py-12 flex flex-col items-center text-center">
            <p className="text-sm text-ecommerce-text-muted">{error || 'Order not found'}</p>
            <Button asChild className="mt-4 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white">
              <Link href="/profile">{t('homepage.common.back')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusString = mapOrderStatus(order.orderStatusId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.orderHistory')}</h2>
      </div>

      <Card className="bg-ecommerce-surface border-ecommerce-border">
        <CardHeader>
          <CardTitle className="text-ecommerce-text-primary">
            {t('homepage.profile.orderNumber', { number: order.id })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusString === 'delivered' ? 'text-ecommerce-emerald bg-ecommerce-emerald/10' : statusString === 'shipped' ? 'text-ecommerce-purple bg-ecommerce-purple/10' : statusString === 'processing' ? 'text-blue-500 bg-blue-500/10' : statusString === 'pending' ? 'text-ecommerce-amber bg-ecommerce-amber/10' : 'text-red-500 bg-red-500/10'}`}>
              {statusString}
            </span>
            <span className="text-sm text-ecommerce-text-muted">
              {new Date(order.createdOnUtc).toLocaleString()}
            </span>
          </div>

          <Separator className="bg-ecommerce-border" />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ecommerce-text-primary uppercase tracking-wider">
              {t('homepage.profile.orderItems') || 'Order Items'}
            </h3>
            {order.items.length === 0 ? (
              <p className="text-sm text-ecommerce-text-muted">No items found</p>
            ) : (
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-ecommerce-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-ecommerce-text-primary">{item.productName || `Item #${item.id}`}</p>
                      <p className="text-xs text-ecommerce-text-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-ecommerce-text-primary">
                      {CurrencyViewer(item.unitPrice * item.quantity, order.userCurrencyType)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="bg-ecommerce-border" />

          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-ecommerce-text-primary">{t('homepage.profile.orderTotal')}</span>
            <span className="text-base font-bold text-ecommerce-text-primary">
              {CurrencyViewer(order.totalAmount, order.userCurrencyType)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
