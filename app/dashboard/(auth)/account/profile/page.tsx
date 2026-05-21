'use client'
// material-ui
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
// project import
import ProfileForm from '../../_components/ProfileForm';
import { useTranslations } from 'next-intl';
import MainCard from '@dashboard/_components/MainCard';

// ===============================|| COLOR BOX ||=============================== //

function Profile() {
  const t = useTranslations("");
  return (
    <Grid container direction="row" spacing={3} sx={{ justifyContent: "center", alignItems: "flex-start" }} >
      <Grid size={7}>
        <Typography variant="h5">{t('pages.edit-profile')}</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 10, xl: 7 }}>
        <MainCard>
          <ProfileForm />
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default Profile;
