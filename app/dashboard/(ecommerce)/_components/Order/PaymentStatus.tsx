import { Chip } from '@mui/material';
import PaymentStatus from '@root/app/types/enums/PaymentStatus';

export default function PaymentStatusView({ paymentStatus }: Readonly<{ paymentStatus?: PaymentStatus }>) {
  let label = 'primary';
  switch (paymentStatus) {
    case PaymentStatus.Pending:
      label = 'secondary'; //Pending
      break;
    case PaymentStatus.Authorized:
      label = 'warning'; //Authorized
      break;
    case PaymentStatus.Paid:
      label = 'success'; //Paid
      break;
    case PaymentStatus.PartiallyRefunded:
    case PaymentStatus.Refunded:
      label = 'primary'; //Refunded
      break;
    case PaymentStatus.Voided:
      label = 'error'; //Voided
      break;
  }

  return (
      <Chip label={status} color={label as 'primary' | 'secondary' | 'warning' | 'success' | 'error' | 'default' | 'info'} variant="outlined" />
  );
}
