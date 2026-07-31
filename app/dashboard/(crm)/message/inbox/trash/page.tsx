'use client'
import MessagesTrashDataGrid from '@dashboard/(crm)/_components/Message/MessagesTrashDataGrid';
import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
// ===============================|| COLOR BOX ||=============================== //

function MessagesTrashList() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.messagesTrash') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} size={12} >
        <Grid size={12}>
          <Typography variant="h5">{t('pages.messagesTrash')}</Typography>
        </Grid>
        <Grid size={12}>
          <MessagesTrashDataGrid />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default MessagesTrashList;
