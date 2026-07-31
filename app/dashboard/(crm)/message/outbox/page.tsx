'use client'
import MessagesOutboxDataGrid from '@dashboard/(crm)/_components/Message/MessagesOutboxDataGrid';
import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';


// ===============================|| COLOR BOX ||=============================== //

export default function MessagesOutbox() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.messagesOutbox') + " - " + CONFIG.APP_HEADER;
  }, [t]);

  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} size={12} >
        <Grid size={12}>
          <Typography variant="h5">{t('pages.messagesOutbox')}</Typography>
        </Grid>
        <Grid size={12}>
          <MessagesOutboxDataGrid />
        </Grid>
      </Grid>
    </Grid>
  );
}
