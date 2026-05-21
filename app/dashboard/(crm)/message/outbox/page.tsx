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
      <Grid container spacing={3} item xs={12} sm={12} md={12} lg={12} >
        <Grid item>
          <Typography variant="h5">{t('pages.messagesOutbox')}</Typography>
        </Grid>
        <Grid item>
          <MessagesOutboxDataGrid />
        </Grid>
      </Grid>
    </Grid>
  );
}
