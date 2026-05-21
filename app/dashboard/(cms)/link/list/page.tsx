'use client';
// material-ui
import { Grid, Typography } from '@mui/material';

// project import
import LinkSectionDataGrid from '../../_components/Link/LinkSectionDataGrid';
import { useTranslations } from 'next-intl';
// ===============================|| COLOR BOX ||=============================== //

function MenuList() {
  const t = useTranslations("");
  return (
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} item xs={12} sm={12} md={12} lg={12} xl={8} >
          <Grid item>
            <Typography variant="h5">{t('pages.linkSection')}</Typography>
          </Grid>
          <Grid item>
            <LinkSectionDataGrid />
          </Grid>
        </Grid>
      </Grid>
  );
}

export default MenuList;
