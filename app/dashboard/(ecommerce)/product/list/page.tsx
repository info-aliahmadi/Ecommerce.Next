'use client';

// material-ui
import { Grid, Typography } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
import ProductDataGrid from '../../_components/Product/ProductDataGrid';
// ===============================|| COLOR BOX ||=============================== //

function OrderList() {
  const t = useTranslations("");
  return (
    <>
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} size={12} >
          <Grid size={12}>
            <Typography variant="h5">{t('pages.product')}</Typography>
          </Grid>
          <Grid size={12}>
            <ProductDataGrid />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default OrderList;
