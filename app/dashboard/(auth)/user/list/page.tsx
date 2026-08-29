'use client';
import { Grid, Stack, Typography } from '@mui/material';
import UserDataGrid from '../../_components/User/UsersDataGrid';
import { useTranslations } from 'next-intl';

function UsersList() {
  const t = useTranslations("");

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
