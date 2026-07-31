'use client'
// material-ui
import PagesDataGrid from '@dashboard/(cms)/_components/Page/PagesDataGrid';
import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
// ===============================|| COLOR BOX ||=============================== //

function PagesList() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.pages') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} size={12} >
          <Grid size={12}>
            <Typography variant="h5">{t('pages.pages')}</Typography>
          </Grid>
          <Grid size={12}>
            <PagesDataGrid />
          </Grid>
        </Grid>
      </Grid>
  );
}

export default PagesList;
