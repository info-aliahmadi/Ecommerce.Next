'use client'
// material-ui
import ArticlesTrashDataGrid from '@dashboard/(cms)/_components/Article/ArticlesTrashDataGrid';
import { Grid, Typography } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
// ===============================|| COLOR BOX ||=============================== //

function ArticlesTrashList() {
  const t = useTranslations("");
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
