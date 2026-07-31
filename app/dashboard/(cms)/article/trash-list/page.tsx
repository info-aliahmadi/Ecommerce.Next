'use client'
// material-ui
import ArticlesTrashDataGrid from '@dashboard/(cms)/_components/Article/ArticlesTrashDataGrid';
import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
// ===============================|| COLOR BOX ||=============================== //

function ArticlesTrashList() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.articlesTrash') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} size={12} >
          <Grid size={12}>
            <Typography variant="h5">{t('pages.articlesTrash')}</Typography>
          </Grid>
          <Grid size={12}>
            <ArticlesTrashDataGrid />
          </Grid>
        </Grid>
      </Grid>
  );
}

export default ArticlesTrashList;
