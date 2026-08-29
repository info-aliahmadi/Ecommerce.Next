'use client';
import SubscribeDataGrid from '@dashboard/(crm)/_components/Subscribe/SubscribeDataGrid';
import { Grid, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

function SubscribeList() {
  const t = useTranslations("");
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 10, lg: 10, xl: 7}} >
        <Grid size={12}>
          <Typography variant="h5">{t('pages.subscribes')}</Typography>
        </Grid>
        <Grid size={12}>
          <SubscribeDataGrid />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default SubscribeList;
