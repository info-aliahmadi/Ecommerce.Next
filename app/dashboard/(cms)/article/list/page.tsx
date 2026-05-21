'use client'
import { ArticlesDataGrid } from '@dashboard/(cms)/_components/Article/ArticlesDataGrid';
// material-ui
import { Grid, Typography } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
// ===============================|| COLOR BOX ||=============================== //

export default function ArticlesList() {
  const t = useTranslations("");
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} item xs={12} sm={12} md={12} lg={12} >
        <Grid item>
          <Typography variant="h5">{t('pages.articles')}</Typography>
        </Grid>
        <Grid item>
          <ArticlesDataGrid />
        </Grid>
      </Grid>
    </Grid>
  );
}

