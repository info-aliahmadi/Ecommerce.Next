'use client'
import PagesDataGrid from '@dashboard/(cms)/_components/Page/PagesDataGrid';
import { Grid, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

function PagesList() {
  const t = useTranslations("");
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
