import { Chip } from '@mui/material';
import ShippingStatus from '@root/app/types/enums/ShippingStatus';
import { useTranslations } from 'next-intl';

export default function ShippingStatusView({ status }: Readonly<{ status: ShippingStatus }>) {
  const t = useTranslations('');
  let color = 'primary';
  let title = 'None';

  switch (status) {
    case ShippingStatus.NotYetShipped:
      color = 'warning';
      title = t('fields.order.shippingStatusTypes.NotYetShipped');
      break;
    case ShippingStatus.Shipped:
      color = 'success';
      title = t('fields.order.shippingStatusTypes.Shipped');
      break;
    case ShippingStatus.Delivered:
      color = 'success';
      title = t('fields.order.shippingStatusTypes.Delivered');
      break;
    case ShippingStatus.ShippingNotRequired:
      color = 'success';
      title = t('fields.order.shippingStatusTypes.ShippingNotRequired');
      break;
    case ShippingStatus.Backordered:
      color = 'error';
      title = t('fields.order.shippingStatusTypes.Backordered');
      break;
    case ShippingStatus.PartiallyShipped:
      color = 'warning';
      title = t('fields.order.shippingStatusTypes.PartiallyShipped');
      break;
  }

  return <Chip label={title} color={color as 'primary' | 'secondary' | 'warning' | 'success' | 'error' | 'default' | 'info'}  />
    ;
}
