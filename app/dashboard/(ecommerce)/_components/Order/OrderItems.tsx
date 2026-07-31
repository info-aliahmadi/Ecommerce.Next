'use client';

import { useTranslations } from 'next-intl';

import MainCard from '@dashboard/_components/MainCard';
import OrderItemData from '../OrderItem/OrderItemData';
import CurrencyTypes from '@root/app/types/enums/CurrencyTypes';

export default function OrderItems({ orderId, currency }: Readonly<{ orderId: number; currency: CurrencyTypes }>) {
  const t = useTranslations('');

  return (
    // <MainCard title={t('fields.order.orderItems')} sx={{ mt: 2 }}>
      <OrderItemData orderId={orderId} currency={currency} />
    // </MainCard>
  );
}
