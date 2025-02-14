'use client'

import React, { useEffect, useState } from 'react';


import MessageService from '@dashboard/(crm)/_service/MessageService';
import ViewMessage from '@dashboard/(crm)/_components/Message/ViewMessage';
import { useSession } from 'next-auth/react';

export default function ViewOutboxMessage({ params }: { readonly params: Promise<{ id: number }> }) {
  const { id } = React.use(params);

  const { data: session } = useSession();
  const jwt = session?.accessToken;

  let messageService = new MessageService(jwt ?? '');
  const [message, setMessage] = useState<MessageModel>();

  const loadMessage = () => {
    messageService.getMessageByIdForSender(id).then((result) => {
      setMessage(result.data);
    });
  };
  useEffect(() => {
    if (id > 0) loadMessage();
  }, [id]);

  return message && <ViewMessage fromPage={'outbox'} message={message} />
}
