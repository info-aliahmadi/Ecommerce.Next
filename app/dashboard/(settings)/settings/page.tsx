'use client';
// material-ui
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

// project import
import { useTranslations } from 'next-intl';

// ===============================|| COLOR BOX ||=============================== //

function Setting() {
  const t = useTranslations("");
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 7 }} >
        <Grid>
          <Typography variant="h5">{t('pages.settings')}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Setting;
