'use client';
import { useState } from 'react';

import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import { useTranslations } from 'next-intl';

import MainCard from '@dashboard/_components/MainCard';
import AnimateButton from '@dashboard/_components/@extended/AnimateButton';
import { Button } from '@mui/material';
import ShipmentDialog from './ShipmentDialog';

export default function OrderShipment({ orderId, shipmentId, trackingNumber, refetch }: Readonly<{ orderId: number; shipmentId: number | null; trackingNumber: string; refetch: () => void }>) {
  const t = useTranslations('');
  const [fieldsName] = ['fields.order.', 'validation.order.', 'buttons.order.'];
  const [shipmentOpen, setShipmentOpen] = useState(false);

  return (
    <>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={12}>
          <MainCard
            title={t(fieldsName + 'trackingNumber')}
            secondary={
              <AnimateButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setShipmentOpen(true)}
                >
                  {shipmentId ? t('buttons.edit') : t('buttons.add')}
                </Button>
              </AnimateButton>
            }
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="currentTrackingNumber">{t(fieldsName + 'trackingNumber')}</InputLabel>
                  <TextField
                    id="currentTrackingNumber"
                    defaultValue={trackingNumber}
                    disabled
                    fullWidth
                  />
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>

      <ShipmentDialog
        orderId={orderId}
        shipmentId={shipmentId}
        open={shipmentOpen}
        setOpen={setShipmentOpen}
        refetch={refetch}
      />
    </>
  );
}
