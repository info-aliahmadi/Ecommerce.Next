'use client';
import MenuDataGrid from '@dashboard/(cms)/_components/Menu/MenuDataGrid';
// material-ui
import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
// ===============================|| COLOR BOX ||=============================== //

export default function MenuList() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.menu') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} size={12} >
          <Grid size={12}>
            <Typography variant="h5">{t('pages.menu')}</Typography>
          </Grid>
          <Grid size={12}>
            <MenuDataGrid />
          </Grid>
        </Grid>
      </Grid>
  );
}
