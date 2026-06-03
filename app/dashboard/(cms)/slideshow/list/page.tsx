'use client'
import SlideshowDataGrid from '@dashboard/(cms)/_components/Slideshow/SlideshowDataGrid';
// material-ui
import { Grid, Typography } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
// ===============================|| COLOR BOX ||=============================== //

function SlideshowList() {
  const t = useTranslations("");
  return (
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} size={12} >
          <Grid size={12}>
            <Typography variant="h5">{t('pages.slideshow')}</Typography>
          </Grid>
          <Grid size={12}>
            <SlideshowDataGrid />
          </Grid>
        </Grid>
      </Grid>
  );
}

export default SlideshowList;
