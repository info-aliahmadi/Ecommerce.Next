'use client';
import { Grid, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';

// project import
import UserDataGrid from '../../_components/User/UsersDataGrid';
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
// ===============================|| COLOR BOX ||=============================== //

function UsersList() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.users') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
    <Grid container direction="row" rowSpacing={2}>
        <Grid size={12}>
          <Typography variant="h5">{t('pages.users')}</Typography>
        </Grid>
        <Grid size={12}>
          <UserDataGrid />
        </Grid>
    </Grid>
  );
}

export default UsersList;
