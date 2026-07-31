'use client';
// material-ui
import { Grid, Typography } from '@mui/material';
import CategoryDataGrid from '../../_components/Category/CategoryDataGrid';
import { useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
// ===============================|| CATEGORY LIST ||=============================== //
function CategoryList() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.categories') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} size={12} >
        <Grid size={12}>
          <Typography variant="h5">{t('pages.categories')}</Typography>
        </Grid>
        <Grid size={12}>
          <CategoryDataGrid />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CategoryList; 