'use client'
// material-ui
import PermissionDataGrid from '@dashboard/(auth)/_components/Permission/PermissionDataGrid';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect } from 'react';
// project import
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
// ===============================|| COLOR BOX ||=============================== //

function PermissionList() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.permissions') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 10, lg: 10, xl: 7 }}>
          <Grid size={12}>
            <Typography variant="h5">{t('pages.permissions')}</Typography>
          </Grid>
          <Grid size={12}>
            <PermissionDataGrid />
          </Grid>
        </Grid>
      </Grid>
  );
}

export default PermissionList;
