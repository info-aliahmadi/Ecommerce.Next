'use client';
import TopicDataGrid from '@dashboard/(cms)/_components/Topic/TopicDataGrid';
// material-ui
import { Grid, Typography } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
// ===============================|| COLOR BOX ||=============================== //

export default function TopicList() {
  const t = useTranslations("");
  return (
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} size={12} xl={8} >
          <Grid size={12}>
            <Typography variant="h5">{t('pages.topics')}</Typography>
          </Grid>
          <Grid size={12}>
            <TopicDataGrid />
          </Grid>
        </Grid>
      </Grid>
  );
}
