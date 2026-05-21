'use client';
import { Button, Grid, Typography } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
import { Send, Drafts } from '@mui/icons-material';

import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import EmailInboxTrashDataGrid from '@dashboard/(crm)/_components/Email/Inbox/EmailInboxTrashDataGrid';
import Link from 'next/link';

// ===============================|| COLOR BOX ||=============================== //

function EmailInboxsInbox() {
  const t = useTranslations("");
  const buttonName = 'buttons.emailInbox.emailInboxInbox.';
  const EmailInboxHeader = () => {
    return (
      <Grid container item direction="row" justifyContent="space-between" alignItems="center">
        <Grid item>
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
        <Grid container spacing={3} item xs={12} sm={12} md={12} lg={12} >
          <Grid item>
            <Typography variant="h5">{t('pages.emailInboxsInbox')}</Typography>
          </Grid>
          <Grid item>
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
