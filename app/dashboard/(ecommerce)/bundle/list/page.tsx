'use client';
// material-ui
import { Grid, Typography } from '@mui/material';
import BundleDataGrid from '../../_components/Bundle/BundleDataGrid';

// project import
import { useTranslations } from 'next-intl';

function BundleList() {
  const t = useTranslations("");
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
