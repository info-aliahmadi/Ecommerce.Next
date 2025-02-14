'use client';
import FilesList from '@dashboard/(filestorage)/_components/FilesList';
import { Grid, Typography } from '@mui/material';
import React from 'react';

// project import
import { useTranslation } from 'react-i18next';
// ===============================|| COLOR BOX ||=============================== //

export default function FilesListPage({ params }: { readonly params: Promise<{ directory: string }> }) {
  const [t] = useTranslation();
  const { directory } = React.use(params);
  return (
    <Grid container justifyContent="center" direction="row" alignItems="flex-start">
      <Grid container spacing={3} item xs={12} sm={12} md={12} lg={12} direction="column">
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

