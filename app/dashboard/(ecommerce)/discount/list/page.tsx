'use client';
// material-ui
import { Grid, Typography } from '@mui/material';
import ManufacturerDataGrid from '../../_components/Discount/DiscountDataGrid';
import { useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
// ===============================|| COLOR BOX ||=============================== //
function ManufacturerList() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.discounts') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} size={12} >
        <Grid size={12}>
          <Typography variant="h5">{t('pages.discounts')}</Typography>
        </Grid>
        <Grid size={12}>
          <ManufacturerDataGrid />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ManufacturerList;
