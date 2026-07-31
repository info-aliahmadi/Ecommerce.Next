'use client';
import FilesList from '@dashboard/(filestorage)/_components/FilesList';
import { Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
// ===============================|| COLOR BOX ||=============================== //

export default function FilesListPage({ params }: { readonly params: Promise<{ directory: string }> }) {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.filesList') + " - " + CONFIG.APP_HEADER;
  }, [t]);

  const { directory } = React.use(params);
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} size={12} >
        <Grid size={12}>
          <Typography variant="h5">{t('pages.filesList')}</Typography>
        </Grid>
        <Grid size={12}>
          <FilesList directory={directory} />
        </Grid>
      </Grid>
    </Grid>
  );
}

