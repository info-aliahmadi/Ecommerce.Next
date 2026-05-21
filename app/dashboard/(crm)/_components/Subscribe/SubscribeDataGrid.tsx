// material-ui
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';

// project import
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Delete } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import SubscribeService from '@dashboard/(crm)/_service/SubscribeService';
import DeleteSubscribe from './DeleteSubscribe';
import AddOrEditSubscribe from './AddOrEditSubscribe';
import { useSession } from 'next-auth/react';
import { MRT_Column } from '@root/app/types/MRT_Column';
import { MRT_Row } from 'material-react-table';
import SubscribeModel from '../../_types/SubscribeModel';

// ===============================|| COLOR BOX ||=============================== //

function SubscribeDataGrid() {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const service = new SubscribeService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [rowId, setRowId] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<SubscribeModel>>();
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [fieldsName, buttonName] = ['fields.subscribe.', 'buttons.subscribe.'];

  const columns = useMemo<MRT_Column<SubscribeModel>[]>(
    () => [
      {
        accessorKey: 'subscribeLabelTitle',
        header: t(fieldsName + 'subscribeLabelTitle'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'email',
        header: t(fieldsName + 'email'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'insertDate',
        header: t(fieldsName + 'insertDate'),
        enableClickToCopy: true,
        type: 'string'
      }
    ],
    []
  );

  const handleNewRow = () => {
    setIsNew(true);
    setRowId(0);
    setOpen(true);
  };
  const handleEditRow = (row : MRT_Row<SubscribeModel>) => {
    let subscribeId = row.original.id;
    setIsNew(false);
    setRowId(subscribeId);
    setOpen(true);
  };
  const handleDeleteRow = (row: MRT_Row<SubscribeModel>) => {
    setRow(row);
    setOpenDelete(true);
  };
  const handleRefetch = () => {
    setRefetch(Date.now());
  };

  const handleSubscribeList = useCallback(async (filters : GridDataBound) => {
    return await service.getSubscribeList(filters);
  }, []);
  const AddRow = useCallback(
    () => (
      <Button color="primary" onClick={handleNewRow} variant="contained" startIcon={<AddIcon />}>
        {t(buttonName + 'add')}
      </Button>
    ),
    []
  );

  const DeleteOrEdit = useCallback(
    ({ row }: { row: MRT_Row<SubscribeModel> }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="top-start" title={t(buttonName + 'delete')}>
          <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t(buttonName + 'edit')}>
          <IconButton onClick={() => handleEditRow(row)}>
            <Edit />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    []
  );
  return (
    <>
      <MainCard title={<AddRow />}>
        <TableCard>
          <MaterialTable
            refetch={refetch}
            columns={columns}
            dataApi={handleSubscribeList}
            enableRowActions
            renderRowActions={DeleteOrEdit}
          />
        </TableCard>
      </MainCard>
      <AddOrEditSubscribe isNew={isNew} subscribeId={rowId} open={open} setOpen={setOpen} refetch={handleRefetch} /> 
      <DeleteSubscribe row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch} />
    </>
  );
}

export default SubscribeDataGrid;
