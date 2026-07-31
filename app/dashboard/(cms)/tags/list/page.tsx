'use client'
// material-ui
import TagDataGrid from '@dashboard/(cms)/_components/Tag/TagDataGrid';
import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
// ===============================|| COLOR BOX ||=============================== //

function TagList() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.tags') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 10, lg: 10, xl: 7}} >
          <Grid size={12}>
            <Typography variant="h5">{t('pages.tags')}</Typography>
          </Grid>
          <Grid size={12}>
            <TagDataGrid />
          </Grid>
        </Grid>
      </Grid>
  );
}

export default TagList;
