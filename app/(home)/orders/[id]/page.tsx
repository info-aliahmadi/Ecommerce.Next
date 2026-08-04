'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../../_components/ui/card';
import { Button } from '../../_components/ui/button';
import { Separator } from '../../_components/ui/separator';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import MyOrderService from '@root/app/(home)/_services/MyOrderService';
import OrderModel from '@root/app/dashboard/(ecommerce)/_types/Order/OrderModel';
import OrderStatus from '@root/app/types/enums/OrderStatus';
import PaymentStatus from '@root/app/types/enums/PaymentStatus';
import ShippingStatus from '@root/app/types/enums/ShippingStatus';

function mapOrderStatus(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Pending:
      return 'Pending';
    case OrderStatus.Processing:
      return 'Processing';
    case OrderStatus.Complete:
      return 'Complete';
    case OrderStatus.Cancelled:
      return 'Cancelled';
    default:
      return 'Pending';
  }
}

function mapPaymentStatus(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.Pending:
      return 'Pending';
    case PaymentStatus.Authorized:
      return 'Authorized';
    case PaymentStatus.Paid:
      return 'Paid';
    case PaymentStatus.PartiallyRefunded:
      return 'PartiallyRefunded';
    case PaymentStatus.Refunded:
      return 'Refunded';
    case PaymentStatus.Voided:
      return 'Voided';
    default:
      return 'Pending';
  }
}

function mapShippingStatus(status: ShippingStatus): string {
  switch (status) {
    case ShippingStatus.ShippingNotRequired:
      return 'ShippingNotRequired';
    case ShippingStatus.NotYetShipped:
      return 'NotYetShipped';
    case ShippingStatus.PartiallyShipped:
      return 'PartiallyShipped';
    case ShippingStatus.Shipped:
      return 'Shipped';
    case ShippingStatus.Delivered:
      return 'Delivered';
    case ShippingStatus.Backordered:
      return 'Backordered';
    default:
      return 'NotYetShipped';
  }
}

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  Pending: 'text-ecommerce-amber bg-ecommerce-amber/10',
  Authorized: 'text-blue-500 bg-blue-500/10',
  Paid: 'text-ecommerce-emerald bg-ecommerce-emerald/10',
  PartiallyRefunded: 'text-orange-500 bg-orange-500/10',
  Refunded: 'text-ecommerce-purple bg-ecommerce-purple/10',
  Voided: 'text-ecommerce-text-muted bg-ecommerce-text-muted/10',
};

const SHIPPING_STATUS_COLORS: Record<string, string> = {
  ShippingNotRequired: 'text-ecommerce-text-muted bg-ecommerce-text-muted/10',
  NotYetShipped: 'text-ecommerce-amber bg-ecommerce-amber/10',
  PartiallyShipped: 'text-blue-500 bg-blue-500/10',
  Shipped: 'text-ecommerce-purple bg-ecommerce-purple/10',
  Delivered: 'text-ecommerce-emerald bg-ecommerce-emerald/10',
  Backordered: 'text-red-500 bg-red-500/10',
};

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
  const paymentString = mapPaymentStatus(order.paymentStatusId);
  const shippingString = mapShippingStatus(order.shippingStatusId);
  const paymentColors = PAYMENT_STATUS_COLORS[paymentString] || 'text-ecommerce-amber bg-ecommerce-amber/10';
  const shippingColors = SHIPPING_STATUS_COLORS[shippingString] || 'text-ecommerce-amber bg-ecommerce-amber/10';

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
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusString === 'Complete' ? 'text-ecommerce-emerald bg-ecommerce-emerald/10' : statusString === 'Processing' ? 'text-blue-500 bg-blue-500/10' : statusString === 'Pending' ? 'text-ecommerce-amber bg-ecommerce-amber/10' : 'text-red-500 bg-red-500/10'}`}>
              {t(`fields.order.orderStatusTypes.${statusString}`)}
            </span>
            <span className="text-sm text-ecommerce-text-muted">
              {CurrencyViewer(order.totalAmount, order.userCurrencyType)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-ecommerce-text-muted uppercase tracking-wider">
                {t('homepage.profile.paymentStatusLabel')}:
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${paymentColors}`}>
                {t(`fields.order.paymentStatusTypes.${paymentString}`)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-ecommerce-text-muted uppercase tracking-wider">
                {t('homepage.profile.shippingStatusLabel')}:
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${shippingColors}`}>
                {t(`fields.order.shippingStatusTypes.${shippingString}`)}
              </span>
            </div>
          </div>

          <Separator className="bg-ecommerce-border" />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ecommerce-text-primary uppercase tracking-wider">
              {t('homepage.profile.orderItems') || 'Order Items'}
            </h3>
            {order.items.length === 0 ? (
              <p className="text-sm text-ecommerce-text-muted">{t('homepage.paymentPage.emptyCart')}</p>
            ) : (
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-ecommerce-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-ecommerce-text-primary">{item.productName || `Item #${item.id}`}</p>
                      <p className="text-xs text-ecommerce-text-muted">{t('homepage.peymentPage.quantity')}: {item.quantity}</p>
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
