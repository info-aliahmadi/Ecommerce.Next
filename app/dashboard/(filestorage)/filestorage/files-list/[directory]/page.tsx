'use client';
import FilesList from '@dashboard/(filestorage)/_components/FilesList';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import { useTranslations } from 'next-intl';

export default function FilesListPage({ params }: { readonly params: Promise<{ directory: string }> }) {
  const t = useTranslations("");

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

