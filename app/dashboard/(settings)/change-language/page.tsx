'use client';
// material-ui
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
// project import
import { useTranslations } from 'next-intl';
import ChangeLanguageForm from '../_components/ChangeLanguageForm';
import MainCard from '@dashboard/_components/MainCard';

// ===============================|| COLOR BOX ||=============================== //

function ChangeLanguage() {
  const t = useTranslations("");
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }} >
        <Grid size={12}>
          <Typography variant="h5">{t('pages.language')}</Typography>
        </Grid>
        <Grid size={12}>
          <MainCard>
            <ChangeLanguageForm />
          </MainCard>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ChangeLanguage;
