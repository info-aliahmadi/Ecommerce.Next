// material-ui
import { Chip, Link } from '@mui/material';

// project import
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { AttachFile } from '@mui/icons-material';
import Notify from '@dashboard/_components/@extended/Notify';
import MessageService from '@dashboard/(crm)/_service/MessageService';
import { MessageTypes } from './MessageType';
import { useSession } from 'next-auth/react';
import MRT_Column from '@root/app/types/MRT_Column';
import { MRT_Row } from 'material-react-table';

import MessageModel from '../../_types/MessageModel';

function MessagesPublicInboxDataGrid() {
  const [t] = useTranslation();
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });

  const messagesService = new MessageService(jwt ?? '');

  const fieldsName = 'fields.message.messageInbox.';

  const columns = useMemo<MRT_Column<MessageModel>[]>(
    () => [
      {
        accessorKey: 'messageType',
        header: t(fieldsName + 'messageType.messageType'),
        enableClickToCopy: true,
        type: 'number',
        enableResizing: true,
        size: 50,
        filterVariant: 'select',
        filterSelectOptions: MessageTypes.filter((x) => x.id == 1).map((a) => ({
          value: a.id,
          text: t('fields.message.messageInbox.messageType.' + a.title)
        })),
        Cell: () => (
          <Chip color="success" label={t(fieldsName + 'messageType.public')} sx={{ borderRadius: '16px' }} variant="filled" size="medium" />
        )
      },
      {
        accessorKey: 'subject',
        header: t(fieldsName + 'subject'),
        enableClickToCopy: false,
        type: 'string',
        enableResizing: true,
        Cell: ({ renderedCellValue, row }: { renderedCellValue: ReactNode; row: MRT_Row<MessageModel> }) => (
          <Link href={'/dashboard/message/inbox/' + row.original.id} underline="none" variant="subtitle1" display="block">
            {renderedCellValue}
            {row.original.haveAttachment && <AttachFile fontSize="medium" sx={{ verticalAlign: 'middle' }} />}
          </Link>
        )
      },
      {
        accessorKey: 'fromUser',
        header: t(fieldsName + 'fromUser'),
        enableClickToCopy: false,
        type: 'string',
        enableResizing: true,
        maxSize: 100,
        Cell: ({ renderedCellValue, row }: { renderedCellValue: ReactNode; row: MRT_Row<MessageModel> }) => (
          <Link
            href={'/dashboard/message/inbox/' + row.original.id}
            underline="none"
            title={row.original.fromUser?.email}
            variant="subtitle1"
            display="block"
          >
            {row.original.fromUser?.name}
          </Link>
        )
      },
      {
        accessorKey: 'registerDate',
        header: t(fieldsName + 'registerDate'),
        type: 'dateTime',
        maxSize: 60
      }
    ],
    []
  );

  const handleMessageList = useCallback(async (filters: GridDataBound) => {
    return await messagesService.getPublicInboxMessages(filters);
  }, []);

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <MaterialTable refetch={refetch} columns={columns} dataApi={handleMessageList} defaultDensity="compact" enableRowActions={false} />
    </>
  );
}

export default MessagesPublicInboxDataGrid;
