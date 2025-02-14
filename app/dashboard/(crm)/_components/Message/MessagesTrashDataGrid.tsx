// material-ui
import { Box, IconButton, Link, Tooltip } from '@mui/material';

// project import
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { AttachFile, RestoreFromTrash } from '@mui/icons-material';
import Notify from '@dashboard/_components/@extended/Notify';
import MessageTypeChip from './MessageTypeChip';
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { MessageTypes } from './MessageType';
import MessageService from '@dashboard/(crm)/_service/MessageService';
import { useSession } from 'next-auth/react';
import { MRT_Column } from '@root/app/types/MRT_Column';
import { MRT_Row } from 'material-react-table';
// ===============================|| COLOR BOX ||=============================== //

export default function MessagesTrashDataGrid() {
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
        minSize: 60,
        maxSize: 60,
        size: 60,
        filterVariant: 'select',
        filterSelectOptions: MessageTypes.map((a) => ({ value: a.id, text: t('fields.message.messageInbox.messageType.' + a.title) })),
        Cell: ({ renderedCellValue }) => <MessageTypeChip messageTypeId={renderedCellValue as MessageType} />
      },
      {
        accessorKey: 'subject',
        header: t(fieldsName + 'subject'),
        enableClickToCopy: false,
        type: 'string',
        enableResizing: true,
        Cell: ({ renderedCellValue, row }: { renderedCellValue: ReactNode; row: MRT_Row<MessageModel> }) => (
          <Link
            href={'/message/inbox/view/' + row.original.id}
            underline="none"
            variant={row.original.toUser.isRead ? 'subtitle2' : 'subtitle1'}
            display="block"
          >
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
          row.original.fromUserId ? (
            <Link
              href={'/message/inbox/view/' + row.original.id}
              underline="none"
              title={row.original.fromUser?.email}
              variant={row.original.toUser.isRead ? 'subtitle2' : 'subtitle1'}
              display="block"
            >
              {row.original.fromUser?.name}
            </Link>
          ) : (
            <Link
              href={'/sendEmail/' + row.original.email}
              title={row.original.email}
              variant={row.original.toUser.isRead ? 'subtitle2' : 'subtitle1'}
              display="block"
            >
              {row.original.name ? row.original.name : row.original.email}
            </Link>
          )
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

  const handleRefetch = () => {
    setRefetch(Date.now());
  };
  const handleRestoreRow = (row: MRT_Row<MessageModel>) => {
    let messageId = row.original.id;
    messagesService
      .restoreMessage(messageId)
      .then(() => {
        setNotify({ open: true });
        handleRefetch();
      })
      .catch((error) => {
        setNotify({ open: true, type: 'error', description: error });
      });
  };
  const handleMessageList = useCallback(async (filters: GridDataBound) => {
    return await messagesService.getDeletedInboxMessages(filters);
  }, []);

  const Restore = useCallback(
    ({ row }: { row: MRT_Row<MessageModel> }) => (
      <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'nowrap' }}>
        <Tooltip arrow placement="top-start" title={t('buttons.restore')}>
          <IconButton color="success" onClick={() => handleRestoreRow(row)}>
            <RestoreFromTrash />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    []
  );

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <MainCard title={t('pages.cards.messagesDeleted')}>
        <TableCard>
          <MaterialTable
            refetch={refetch}
            columns={columns}
            dataApi={handleMessageList}
            enableRowActions={true}
            renderRowActions={Restore}
            displayColumnDefOptions={{
              'mrt-row-actions': {
                //header: 'Change Account Settings', //change header text
                size: 40 //make actions column wider
              }
            }}
            defaultDensity="compact"
          />
        </TableCard>
      </MainCard>
    </>
  );
}
