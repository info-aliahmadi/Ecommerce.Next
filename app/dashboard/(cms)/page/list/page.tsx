'use client'
// material-ui
import PagesDataGrid from '@dashboard/(cms)/_components/Page/PagesDataGrid';
import { Grid, Typography } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
// ===============================|| COLOR BOX ||=============================== //

function PagesList() {
  const t = useTranslations("");
  return (
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} item xs={12} sm={12} md={12} lg={12} >
          <Grid item>
            <Typography variant="h5">{t('pages.pages')}</Typography>
          </Grid>
          <Grid item>
            <PagesDataGrid />
          </Grid>
        </Grid>
      </Grid>
  );
}

export default PagesList;
