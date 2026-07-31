'use client';
// material-ui
import { Grid, Typography } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
import FilesCategoryList from '../_components/FilesDirectoryList';
import { useEffect } from 'react';
import CONFIG from '@root/config';
// ===============================|| COLOR BOX ||=============================== //

export default function DirectoryList() {
  const t = useTranslations("");
   useEffect(() => {
     document.title = t('pages.fileStorage') + " - " + CONFIG.APP_HEADER;
   }, [t]);

  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} size={12} >
        <Grid size={12}>
          <Typography variant="h5">{t('pages.fileStorage')}</Typography>
        </Grid>
        <Grid size={12}>
          <FilesCategoryList />
        </Grid>
      </Grid>
    </Grid>
  );
}
