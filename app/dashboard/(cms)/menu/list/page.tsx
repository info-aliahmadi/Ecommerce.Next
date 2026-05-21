'use client';
import MenuDataGrid from '@dashboard/(cms)/_components/Menu/MenuDataGrid';
// material-ui
import { Grid, Typography } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
// ===============================|| COLOR BOX ||=============================== //

export default function MenuList() {
  const t = useTranslations("");
  return (
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} item xs={12} sm={12} md={12} lg={12} xl={8} >
          <Grid item>
            <Typography variant="h5">{t('pages.menu')}</Typography>
          </Grid>
          <Grid item>
            <MenuDataGrid />
          </Grid>
        </Grid>
      </Grid>
  );
}
