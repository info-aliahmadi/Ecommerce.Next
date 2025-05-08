'use client';
// material-ui
import { Grid, Typography } from '@mui/material';
import CategoryDataGrid from '../../_components/Category/CategoryDataGrid';

// project import
import { useTranslation } from 'react-i18next';
// ===============================|| CATEGORY LIST ||=============================== //
function CategoryList() {
  const [t] = useTranslation();
  return (
    <>
      <Grid container justifyContent="center" direction="row" alignItems="flex-start">
        <Grid container spacing={3} item xs={12} sm={12} md={12} lg={12} xl={12} direction="column">
          <Grid item>
            <Typography variant="h5">{t('pages.categories')}</Typography>
          </Grid>
          <Grid item>
            <CategoryDataGrid />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default CategoryList; 