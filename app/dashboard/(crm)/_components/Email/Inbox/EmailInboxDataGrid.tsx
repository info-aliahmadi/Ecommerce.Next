// material-ui
import { Box, IconButton, Link, Tooltip } from '@mui/material';

// project import
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Delete, PushPin, AttachFile } from '@mui/icons-material';
import Notify from '@dashboard/_components/@extended/Notify';
import EmailInboxService from '@dashboard/(crm)/_service/EmailInboxService';
import DeleteEmailInbox from './DeleteEmailInbox';
import { useSession } from 'next-auth/react';
import { MRT_Cell, MRT_Row } from 'material-react-table';
import EmailInboxModel from '../../../_types/EmailInboxModel';

import { MRT_Column } from '@root/app/types/MRT_Column';
// ===============================|| COLOR BOX ||=============================== //

export default function EmailInboxDataGrid({ reloadCall }: { reloadCall: any }) {
  debugger
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<EmailInboxModel>>();
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });

  const emailInboxsService = new EmailInboxService(jwt ?? '');

  const fieldsName = 'fields.email.emailInbox.';

  useEffect(() => {
    handleRefetch()
  }, [reloadCall]);

  const columns = useMemo<MRT_Column<EmailInboxModel>[]>(
    () => [
      {
        accessorKey: 'fromAddress',
        header: t(fieldsName + 'fromAddress'),
        enableClickToCopy: false,
        type: 'string',
        enableResizing: true,

        maxSize: 60,
        Cell: ({ cell, renderedCellValue, row }: { cell: MRT_Cell<EmailInboxModel, unknown>; renderedCellValue: ReactNode; row: MRT_Row<EmailInboxModel> }) => (
          row.original.fromAddress?.map((email) => (
            <Link
              key={email.address}
              href={'/dashboard/email/send/' + email.address}
              underline="none"
              title={email.address}
              variant={row.original.isRead ? 'subtitle2' : 'subtitle1'}
              display="block"
            >
              {email.name}
            </Link>
          ))
        )
      },
      {
        accessorKey: 'subject',
        header: t(fieldsName + 'subject'),
        enableClickToCopy: false,
        type: 'string',
        enableResizing: true,
        Cell: ({ renderedCellValue, row }: { renderedCellValue: ReactNode; row: MRT_Row<EmailInboxModel> }) => (
          <Link
            href={'/dashboard/email/inbox/' + row.original.id}
            underline="none"
            variant={row.original.isRead ? 'subtitle2' : 'subtitle1'}
            display="block"
          >
            {renderedCellValue}
            {row.original.haveAttachment && <AttachFile fontSize="medium" sx={{ verticalAlign: 'middle' }} />}
          </Link>
        )
      },
      {
        accessorKey: 'registerDate',
        header: t(fieldsName + 'registerDate'),
        type: 'dateTime'
      }
    ],
    []
  );
  const handleDeleteRow = (row: MRT_Row<EmailInboxModel>) => {
    setRow(row);
    setOpenDelete(true);
  };
  const handleRefetch = () => {
    setRefetch(Date.now());
  };

  const handlePinRow = (emailInboxId: number) => {
    emailInboxsService
      .pinEmailInbox(emailInboxId)
      .then(() => {
        handleRefetch();
      })
      .catch((error) => {
        setNotify({ open: true, type: 'error', description: error });
      });
  };
  const handleEmailInboxList = useCallback(async (filters: GridDataBound) => {
    return await emailInboxsService.getAllEmailInbox(filters);
  }, []);

  const DeleteOrPin = useCallback(
    ({ row }: { row: MRT_Row<EmailInboxModel> }) => (
      <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'nowrap' }}>
        <Tooltip arrow placement="top-start" title={t('buttons.delete')}>
          <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            <Delete />
          </IconButton>
        </Tooltip>

        <Tooltip arrow placement="top-start" title={t('buttons.pin')}>
          <IconButton onClick={() => handlePinRow(row.original.id)} color={row.original.isPin ? 'warning' : 'secondary'}>
            <PushPin />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    []
  );

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <MaterialTable
        refetch={refetch}
        columns={columns}
        dataApi={handleEmailInboxList}
        enableRowActions={true}
        renderRowActions={DeleteOrPin}
        displayColumnDefOptions={{
          'mrt-row-actions': {
            //header: 'Change Account Settings', //change header text
            size: 40 //make actions column wider
          }
        }}
        defaultDensity="compact"
      />
      <DeleteEmailInbox row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch} />
    </>
  );
}
