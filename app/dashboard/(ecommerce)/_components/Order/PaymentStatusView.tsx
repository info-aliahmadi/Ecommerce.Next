import { Chip } from '@mui/material';
import PaymentStatus from '@root/app/types/enums/PaymentStatus';
import { useTranslations } from 'next-intl';

export default function PaymentStatusView({ paymentStatus }: Readonly<{ paymentStatus?: PaymentStatus }>) {
  const t = useTranslations('');
  let color = 'primary';
  let text = '';

  switch (paymentStatus) {
    case PaymentStatus.Pending:
      color = 'secondary';
      text = t('fields.order.paymentStatusTypes.Pending');
      break;
    case PaymentStatus.Authorized:
      color = 'warning';
      text = t('fields.order.paymentStatusTypes.Authorized');
      break;
    case PaymentStatus.Paid:
      color = 'success';
      text = t('fields.order.paymentStatusTypes.Paid');
      break;
    case PaymentStatus.PartiallyRefunded:
    case PaymentStatus.Refunded:
      color = 'primary';
      text = t('fields.order.paymentStatusTypes.Refunded');
      break;
    case PaymentStatus.Voided:
      color = 'error';
      text = t('fields.order.paymentStatusTypes.Voided');
      break;
  }

  return (
      <Chip label={text} color={color as 'primary' | 'secondary' | 'warning' | 'success' | 'error' | 'default' | 'info'} />
  );
}
