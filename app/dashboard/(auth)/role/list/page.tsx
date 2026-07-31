'use client';
// material-ui
import RoleDataGrid from '@dashboard/(auth)/_components/Role/RoleDataGrid';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
// ===============================|| COLOR BOX ||=============================== //

function RoleList() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.roles') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container direction="row" spacing={3} size={{ xs: 12, sm: 12, md: 10, lg: 10, xl: 7 }} >
        <Grid size={12}>
          <Typography variant="h5">{t('pages.roles')}</Typography>
        </Grid>
        <Grid size={12}>
          <RoleDataGrid />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default RoleList;
