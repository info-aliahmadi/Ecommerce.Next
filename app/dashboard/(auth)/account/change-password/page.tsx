'use client'
// project import
import MainCard from '@dashboard/_components/MainCard';
import { useTranslations } from 'next-intl';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect } from 'react';
import ChangePasswordForm from '../../_components/ChangePasswordForm';
import CONFIG from '@root/config';

// ===============================|| COLOR BOX ||=============================== //

function ChangePassword() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.change-password') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid size={7}>
        <Typography variant="h5">{t('pages.change-password')}</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 10, lg: 8, xl: 6 }}>
        <MainCard>
          <ChangePasswordForm />
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default ChangePassword;
