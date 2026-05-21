'use client';
// material-ui
import { Grid, Typography } from '@mui/material';
import ManufacturerDataGrid from '../../_components/Manufacturer/ManufacturerDataGrid';

// project import
import { useTranslations } from 'next-intl';
// ===============================|| COLOR BOX ||=============================== //
function ManufacturerList() {
  const t = useTranslations("");
  return (
    <>
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} item xs={12} sm={12} md={12} lg={12} xl={8} >
          <Grid item>
            <Typography variant="h5">{t('pages.manufacturers')}</Typography>
          </Grid>
          <Grid item>
            <ManufacturerDataGrid />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default ManufacturerList;
