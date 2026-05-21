'use client';
import FilesList from '@dashboard/(filestorage)/_components/FilesList';
import { Grid, Typography } from '@mui/material';
import React from 'react';

// project import
import { useTranslations } from 'next-intl';
// ===============================|| COLOR BOX ||=============================== //

export default function FilesListPage({ params }: { readonly params: Promise<{ directory: string }> }) {
  const t = useTranslations("");
  const { directory } = React.use(params);
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} item xs={12} sm={12} md={12} lg={12} >
        <Grid item>
          <Typography variant="h5">{t('pages.filesList')}</Typography>
        </Grid>
        <Grid item>
          <FilesList directory={directory} />
        </Grid>
      </Grid>
    </Grid>
  );
}

