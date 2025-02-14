'use client'
import React, { useEffect, useState } from 'react';
import ViewMessage from '@dashboard/(crm)/_components/Message/ViewMessage';
import MessageService from '@dashboard/(crm)/_service/MessageService';
import { useSession } from 'next-auth/react';

export default function ViewInboxMessage({ params }: { readonly params: Promise<{ id: number }> }) {
  const { id } = React.use(params);

  const { data: session } = useSession();
  const jwt = session?.accessToken;

  let messageService = new MessageService(jwt ?? '');
  const [message, setMessage] = useState<MessageModel>();

  const loadMessage = () => {
    messageService.getMessageByIdForReceiver(id).then((result) => {
      setMessage(result.data);
    });
  };
  useEffect(() => {
    if (id > 0) loadMessage();
  }, [id]);

  return message && <ViewMessage fromPage={'inbox'} message={message} />;
}
