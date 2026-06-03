'use client';
// material-ui
import { Grid, Typography } from '@mui/material';
import CategoryDataGrid from '../../_components/Category/CategoryDataGrid';

// project import
import { useTranslations } from 'next-intl';
// ===============================|| CATEGORY LIST ||=============================== //
function CategoryList() {
  const t = useTranslations("");
  return (
    <>
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
    </>
  );
}

export default CategoryList; 