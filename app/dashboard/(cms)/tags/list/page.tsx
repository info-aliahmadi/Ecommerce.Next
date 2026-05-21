'use client'
// material-ui
import TagDataGrid from '@dashboard/(cms)/_components/Tag/TagDataGrid';
import { Grid, Typography } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
// ===============================|| COLOR BOX ||=============================== //

function TagList() {
  const t = useTranslations("");
  return (
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} item xs={12} sm={12} md={10} lg={10} xl={7} >
          <Grid item>
            <Typography variant="h5">{t('pages.tags')}</Typography>
          </Grid>
          <Grid item>
            <TagDataGrid />
          </Grid>
        </Grid>
      </Grid>
  );
}

export default TagList;
