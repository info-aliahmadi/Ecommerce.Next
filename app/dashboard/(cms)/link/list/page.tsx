'use client';
import { Grid, Typography } from '@mui/material';
import LinkSectionDataGrid from '../../_components/Link/LinkSectionDataGrid';
import { useTranslations } from 'next-intl';

function MenuList() {
  const t = useTranslations("");

  return (
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} size={12} >
          <Grid size={12}>
            <Typography variant="h5">{t('pages.linkSection')}</Typography>
          </Grid>
          <Grid size={12}>
            <LinkSectionDataGrid />
          </Grid>
        </Grid>
      </Grid>
  );
}

export default MenuList;
