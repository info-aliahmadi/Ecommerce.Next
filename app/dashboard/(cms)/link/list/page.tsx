'use client';
// material-ui
import { Grid, Typography } from '@mui/material';

// project import
import LinkSectionDataGrid from '../../_components/Link/LinkSectionDataGrid';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import CONFIG from '@root/config';
// ===============================|| COLOR BOX ||=============================== //

function MenuList() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.linkSection') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} size={12} >
          <Grid size={12}>
            <Typography variant="h5">{t('pages.linkSection')}</Typography>
          </Grid>
          <Grid size={12}>
            <LinkSectionDataGrid />
          </Grid>
        </Grid>
      </Grid>
  );
}

export default MenuList;
