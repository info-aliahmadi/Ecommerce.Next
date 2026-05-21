// material-ui
import { Chip, Link } from '@mui/material';

// project import
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { AttachFile, Person } from '@mui/icons-material';
import MessageTypeChip from './MessageTypeChip';
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { MessageTypes } from './MessageType';
import { useRouter } from 'next/navigation';
import MessageService from '@dashboard/(crm)/_service/MessageService';
import { useSession } from 'next-auth/react';
import { MRT_Column } from '@root/app/types/MRT_Column';
import { MRT_Cell, MRT_Row } from 'material-react-table';
import { MessageType } from '../../_types/MessageModel';
import MessageModel from '../../_types/MessageModel';
// ===============================|| COLOR BOX ||=============================== //

export default function MessagesOutboxDataGrid() {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const router = useRouter();

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
        minSize: 60,
        maxSize: 60,
        size: 60,
        filterVariant: 'select',
        filterSelectOptions: MessageTypes.map((a) => ({ value: a.id, text: t('fields.message.messageInbox.messageType.' + a.title) })),
        Cell: ({ renderedCellValue }: { renderedCellValue: any }) => <MessageTypeChip messageTypeId={renderedCellValue as MessageType} />
      },
      {
        accessorKey: 'subject',
        header: t(fieldsName + 'subject'),
        enableClickToCopy: false,
        type: 'string',
        enableResizing: true,
        Cell: ({ renderedCellValue, row }: { renderedCellValue: ReactNode; row: MRT_Row<MessageModel> }) => (
          <Link href={'/dashboard/message/outbox/' + row.original.id} underline="none" variant={'subtitle2'} display="block">
            {renderedCellValue}
            {row.original.haveAttachment && <AttachFile fontSize="medium" sx={{ verticalAlign: 'middle' }} />}
          </Link>
        )
      },
      {
        accessorKey: 'toUsers',
        header: t(fieldsName + 'toUsers'),
        enableClickToCopy: false,
        type: 'string',
        enableResizing: true,
        maxSize: 100,
        Cell: ({ cell, renderedCellValue, row }: { cell: MRT_Cell<MessageModel, unknown>; renderedCellValue: ReactNode; row: MRT_Row<MessageModel> }) => (
          row.original.toUsers.map((user) => (
              <Chip
                key={user?.toUserId}
                onClick={() => {
                  router.push('/dashboard/message/send/0/' + user?.toUserId);
                }}
                icon={<Person />}
                title={user?.toUser?.name}
                label={user?.toUser?.userName}
                variant="filled"
                size="medium"
                sx={{ borderRadius: '16px', m: '0 2px' }}
              />
          ))
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
    return await messagesService.getSentMessages(filters);
  }, []);

  return (
      <MainCard title={t('pages.cards.messagesOutbox')}>
        <TableCard>
          <MaterialTable
            refetch={refetch}
            columns={columns}
            dataApi={handleMessageList}
            enableRowActions={false}
            defaultDensity="compact"
          />
        </TableCard>
      </MainCard>
  );
}
