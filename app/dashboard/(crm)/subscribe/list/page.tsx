'use client';
import SubscribeDataGrid from '@dashboard/(crm)/_components/Subscribe/SubscribeDataGrid';
// material-ui
import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
// ===============================|| COLOR BOX ||=============================== //

function SubscribeList() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.subscribes') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} item size={{ xs: 12, sm: 12, md: 10, lg: 10, xl: 7}} >
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
