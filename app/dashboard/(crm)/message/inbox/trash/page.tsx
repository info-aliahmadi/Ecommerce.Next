'use client'
import MessagesTrashDataGrid from '@dashboard/(crm)/_components/Message/MessagesTrashDataGrid';
import { Grid, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

function MessagesTrashList() {
  const t = useTranslations("");
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
