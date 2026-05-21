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
        <Grid container spacing={3} item xs={12} sm={12} md={12} lg={12} >
          <Grid item>
            <Typography variant="h5">{t('pages.product')}</Typography>
          </Grid>
          <Grid item>
            <ProductDataGrid />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default OrderList;
