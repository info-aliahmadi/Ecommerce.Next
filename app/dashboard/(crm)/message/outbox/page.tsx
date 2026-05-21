'use client'
import MessagesOutboxDataGrid from '@dashboard/(crm)/_components/Message/MessagesOutboxDataGrid';
import { Grid, Typography } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';


// ===============================|| COLOR BOX ||=============================== //

export default function MessagesOutbox() {
  const t = useTranslations("");

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
