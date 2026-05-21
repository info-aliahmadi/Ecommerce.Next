'use client'
import MessagesTrashDataGrid from '@dashboard/(crm)/_components/Message/MessagesTrashDataGrid';
import { Grid, Typography } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
// ===============================|| COLOR BOX ||=============================== //

function MessagesTrashList() {
  const t = useTranslations("");
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} item xs={12} sm={12} md={12} lg={12} >
        <Grid item>
          <Typography variant="h5">{t('pages.messagesTrash')}</Typography>
        </Grid>
        <Grid item>
          <MessagesTrashDataGrid />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default MessagesTrashList;
