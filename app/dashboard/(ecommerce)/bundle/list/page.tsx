'use client';
// material-ui
import { Grid, Typography } from '@mui/material';
import BundleDataGrid from '../../_components/Bundle/BundleDataGrid';
import { useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';

function BundleList() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.bundles') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} size={12} >
        <Grid size={12}>
          <Typography variant="h5">{t('pages.bundles')}</Typography>
        </Grid>
        <Grid size={12}>
          <BundleDataGrid />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default BundleList;
