'use client';

// assets
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import OrderService from '../../_service/OrderService';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/system';

import MainCard from '@dashboard/_components/MainCard';
import PaymentStatus from './PaymentStatus';
import OrderModel from '../../_types/Order/OrderModel';

export default function PaymentDetail({ orderId, open, setOpen, refetch }: { orderId: number; open: boolean; setOpen: (open: boolean) => void; refetch: () => void }) {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const orderService = new OrderService(jwt ?? '');
  const [payment, setPayment] = useState<OrderModel>();

  const [fieldsName] = ['fields.order.', 'validation.order.', 'buttons.'];

  const loadPayment = () => {
    orderService.getOrderPaymentById(orderId).then((result) => {
      setPayment(result.data);
    });
  };

  useEffect(() => {
    if (orderId > 0) {
      loadPayment();
    } else {
      setPayment(undefined);
    }
  }, [orderId, open]);

  const CloseDialog = ({ onClose }: { onClose: () => void }) => (
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: (theme) => theme.palette.grey[500]
      }}
    >
      <CloseIcon />
    </IconButton>
  );

  const onClose = () => {
    setOpen(false);
    setPayment(undefined);
  };

  return (
    <>
      <Dialog open={open} fullWidth>
        <DialogTitle>
          {t('dialog.payment.title')}
          <CloseDialog onClose={onClose} />
        </DialogTitle>
        <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
          <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
            <Grid size={12}>
              <MainCard>
                <Grid container spacing={3} >
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }} lg={4} xl={4}>
                      <Stack spacing={1}>
                        <TextField
                          id="transactionTrackingCode"
                          label={t(fieldsName + 'transactionTrackingCode')}
                          defaultValue={payment?.transactionTrackingCode}
                          InputProps={{
                            readOnly: true
                          }}
                        />
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }} lg={4} xl={4}>
                      <Stack spacing={1}>
                        <TextField
                          id="paymentTrackingCode"
                          label={t(fieldsName + 'paymentTrackingCode')}
                          defaultValue={payment?.paymentTrackingCode}
                          InputProps={{
                            readOnly: true
                          }}
                        />
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }} lg={4} xl={4}>
                      <Stack spacing={1}>
                        <TextField
                          id="paymentDateUtcToString"
                          label={t(fieldsName + 'paymentDateUtcToString')}
                          defaultValue={payment?.paymentDateUtcToString}
                          InputProps={{
                            readOnly: true
                          }}
                        />
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }} lg={4} xl={4}>
                      <Stack spacing={1}>
                        <TextField
                          id="paymentMethodId"
                          label={t(fieldsName + 'paymentMethodId')}
                          defaultValue={payment?.paymentMethodId}
                          InputProps={{
                            readOnly: true
                          }}
                        />
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }} lg={4} xl={4}>
                      <Stack spacing={1}>
                        <TextField
                          id="paymentStatusTitle"
                          label={t(fieldsName + 'paymentStatusTitle')}
                          defaultValue={payment?.paymentStatusTitle}
                          InputProps={{
                            readOnly: true
                          }}
                        />
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12}} lg={12} xl={12}>
                      <Stack spacing={1}>
                        <PaymentStatus status={payment?.paymentStatusTitle ?? ''} id={payment?.paymentStatusId ?? 0} />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
}
