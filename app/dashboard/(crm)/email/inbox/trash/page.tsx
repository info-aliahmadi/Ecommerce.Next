'use client';
import { Button, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';
import { Send, Drafts } from '@mui/icons-material';
import CONFIG from '@root/config';

import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import EmailInboxTrashDataGrid from '@dashboard/(crm)/_components/Email/Inbox/EmailInboxTrashDataGrid';
import Link from 'next/link';

// ===============================|| COLOR BOX ||=============================== //

function EmailInboxsInbox() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.emailInboxsInbox') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  const buttonName = 'buttons.emailInbox.emailInboxInbox.';
  const EmailInboxHeader = () => {
    return (
      <Grid container direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Grid size={12}>
          <Button
            component={Link}
            color="primary"
            variant="contained"
            href='/dashboard/emailInbox/send/0'
            startIcon={<Send />}
          >
            {t(buttonName + 'send')}
          </Button>
          <Button
            component={Link}
            color="warning"
            variant="contained"
            href='/dashboard/emailInbox/draft'
            startIcon={<Drafts />}
            sx={{ m: '0 15px' }}
          >
            {t('pages.cards.emailInboxsDraft')}
          </Button>
        </Grid>
      </Grid>
    );
  };
  return (
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} size={12} >
          <Grid size={12}>
            <Typography variant="h5">{t('pages.emailInboxsInbox')}</Typography>
          </Grid>
          <Grid size={12}>
            <MainCard title={<EmailInboxHeader />}>
              <TableCard>
                <EmailInboxTrashDataGrid />
              </TableCard>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
  );
}

export default EmailInboxsInbox;
