'use client';
import { Button, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';
import ArrowBack from '@mui/icons-material/ArrowBack';
import CONFIG from '@root/config';

import { useRouter } from 'next/navigation';
import MessagesDraftDataGrid from '@dashboard/(crm)/_components/Message/MessagesDraftDataGrid';
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import AnimateButton from '@dashboard/_components/@extended/AnimateButton';

// ===============================|| COLOR BOX ||=============================== //

export default function MessagesOutbox() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.messagesDraft') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  let router = useRouter();

  const MessageHeader = () => {
    return (
      <Grid container direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Grid size={12}>
          <AnimateButton>
            <Button
              size="large"
              onClick={() => {
                router.back();
              }}
              variant="outlined"
              color="secondary"
              startIcon={<ArrowBack />}
            >
              {t('pages.cards.messagesInbox')}
            </Button>
          </AnimateButton>

        </Grid>
      </Grid>
    );
  };
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} size={12} >
        <Grid size={12}>
          <Typography variant="h5">{t('pages.messagesDraft')}</Typography>
        </Grid>
        <Grid size={12}>
          <MainCard title={<MessageHeader />}>
            <TableCard>
              <MessagesDraftDataGrid />
            </TableCard>
          </MainCard>
        </Grid>
      </Grid>
    </Grid>
  );
}
