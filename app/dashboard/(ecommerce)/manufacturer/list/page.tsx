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
        <Grid container spacing={3} size={12} >
          <Grid size={12}>
            <Typography variant="h5">{t('pages.manufacturers')}</Typography>
          </Grid>
          <Grid size={12}>
            <ManufacturerDataGrid />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default ManufacturerList;
