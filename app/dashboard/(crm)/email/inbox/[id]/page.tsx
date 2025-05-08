'use client'
import React, { useEffect, useState } from 'react';

import ViewEmailInbox from '@dashboard/(crm)/_components/Email/Inbox/ViewEmailInbox';
import EmailInboxService from '@dashboard/(crm)/_service/EmailInboxService';
import { useSession } from 'next-auth/react';
import EmailInboxModel from '../../../_types/EmailInboxModel';

export default function ViewInboxEmail({params}: { readonly params: Promise<{ id: number}> }) {
  const { id } = React.use(params);

  const { data: session } = useSession();
  const jwt = session?.accessToken;

  let emailInboxService = new EmailInboxService(jwt ?? '');
  const [emailInbox, setEmailInbox] = useState<EmailInboxModel>();

  const loadEmailInbox = () => {
    emailInboxService.getEmailInboxById(id).then((result) => {
      setEmailInbox(result.data);
      emailInboxService.readEmailInbox(id);
    });
  };
  useEffect(() => {
    if (id > 0) loadEmailInbox();
  }, [id]);

  return emailInbox ? <ViewEmailInbox emailInbox={emailInbox} /> : null;
}
