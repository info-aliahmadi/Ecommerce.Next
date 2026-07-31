'use client';
import { Button, Chip, Grid, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

// project import
import { useTranslations } from 'next-intl';

import { Email, RestoreFromTrash, Refresh } from '@mui/icons-material';
import CONFIG from '@root/config';

import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import EmailInboxDataGrid from '@dashboard/(crm)/_components/Email/Inbox/EmailInboxDataGrid';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import EmailInboxService from '@dashboard/(crm)/_service/EmailInboxService';

// ===============================|| COLOR BOX ||=============================== //

function EmailInboxsInbox() {
   
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const [reload, setReload] = useState(false);
  const [reloadData, setReloadData] = useState<number | undefined>();

  useEffect(() => {
    document.title = t('pages.emailInboxs') + " - " + CONFIG.APP_HEADER;
  }, [t]);


  const service = new EmailInboxService(jwt ?? '');


  const buttonName = 'buttons.email.emailInbox.';

  const handleReload = () => {
    setReload(true);
    service.loadEmailInbox().finally(() => {
      setReload(false);
      setReloadData(Date.now())
    });
  };

  const EmailInboxHeader = () => {
    return (
      <Grid container direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Grid size={12}>
          <Button
            component={Link}
            color="primary"
            variant="contained"
            href='/dashboard/email/send'
            startIcon={<Email />}
          >
            {t(buttonName + 'send')}
          </Button>
          <Button
            disabled={reload}
            sx={{ mr: 2, ml: 2 }}
            color="info"
            variant="contained"
            onClick={handleReload}
            startIcon={<Refresh />}
          >
            {t(buttonName + 'reload')}
          </Button>
        </Grid>
        <Grid size={12}>
          <Chip
            href="/dashboard/email/inbox/trash"
            clickable
            component={Link}
            target="_blank"
            icon={<RestoreFromTrash />}
            label={t('pages.emailInboxsTrash')}
            variant="outlined"
            size="medium"
            color="error"
            sx={{ borderRadius: '16px' }}
          />
        </Grid>
      </Grid>
    );
  };
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} size={12} >
        <Grid size={12}>
          <Typography variant="h5">{t('pages.emailInboxs')}</Typography>
        </Grid>
        <Grid size={12}>
          <MainCard title={<EmailInboxHeader />}>
            <TableCard>
              <EmailInboxDataGrid reloadCall={reloadData} />
            </TableCard>
          </MainCard>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default EmailInboxsInbox;
