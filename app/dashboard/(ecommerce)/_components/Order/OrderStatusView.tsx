import Dot from '@dashboard/_components/@extended/Dot';
import Typography from '@mui/material/Typography';
import OrderStatus from '@root/app/types/enums/OrderStatus';
import { useTranslations } from 'next-intl';

export default function OrderStatusView({ status }: Readonly<{ status: OrderStatus }>) {
  const t = useTranslations('');
  let color = 'primary';
  let title = 'None';

  switch (status) {
    case OrderStatus.Pending:
      color = 'warning';
      title = t('fields.order.orderStatusTypes.Pending');
      break;
    case OrderStatus.Processing:
      color = 'primary';
      title = t('fields.order.orderStatusTypes.Processing');
      break;
    case OrderStatus.Complete:
      color = 'success';
      title = t('fields.order.orderStatusTypes.Complete');
      break;
    case OrderStatus.Cancelled:
      color = 'error';
      title = t('fields.order.orderStatusTypes.Cancelled');
      break;
  }

  return (
    <>
      <Dot color={color} size={10} />
      <Typography sx={{mx : 1}}>{title}</Typography>
    </>
  );
}
