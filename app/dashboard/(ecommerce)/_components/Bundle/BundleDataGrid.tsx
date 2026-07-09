// material-ui
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';

// project import
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Delete } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import DeleteBundle from './DeleteBundle';
import AddOrEditBundle from './AddOrEditBundle';
import { useSession } from 'next-auth/react';
import BundleService from '../../_service/BundleService';
import BundleModel from '../../_types/Product/BundleModel';
import { MRT_Row } from 'material-react-table';
import { MRT_Column } from '@root/app/types/MRT_Column';


function BundleDataGrid() {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const service = new BundleService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [rowId, setRowId] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [data, setData] = useState<BundleModel[]>([]);
  const [row, setRow] = useState<MRT_Row<BundleModel>>();
  const [fieldsName, buttonName] = ['fields.bundle.', 'buttons.bundle.'];

  const columns = useMemo<MRT_Column<BundleModel>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t(fieldsName + 'name'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'description',
        header: t(fieldsName + 'description'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'showOnHomepage',
        header: t(fieldsName + 'showOnHomepage'),
        type: 'boolean'
      },
      {
        accessorKey: 'displayOrder',
        header: t(fieldsName + 'displayOrder'),
        enableClickToCopy: true,
        type: 'number'
      }
    ],
    []
  );

  useEffect(() => {
    handleBundleList();
  }, []);

  const handleBundleList = async () => {
    const result = await service.getBundleList();
    if (result.succeeded) {
      setData(result.data ?? []);
    }
    return result;
  };

  const handleNewRow = () => {
    setIsNew(true);
    setRowId(0);
    setOpen(true);
  };
  const handleEditRow = (row: MRT_Row<BundleModel>) => {
    let bundleId = row.original.id;
    setIsNew(false);
    setRowId(bundleId);
    setOpen(true);
  };
  const handleDeleteRow = (row: MRT_Row<BundleModel>) => {
    setRow(row);
    setOpenDelete(true);
  };

  const AddRow = useCallback(
    () => (
      <Button color="primary" onClick={handleNewRow} variant="contained" startIcon={<AddIcon />}>
        {t(buttonName + 'add')}
      </Button>
    ),
    []
  );

  const DeleteOrEdit = useCallback(
    ({ row }: { row: MRT_Row<BundleModel> }) => (
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
            columns={columns}
            dataSet={data}
            enableRowActions
            renderRowActions={DeleteOrEdit}
          />
        </TableCard>
      </MainCard>
      <AddOrEditBundle isNew={isNew} bundleId={rowId} open={open} setOpen={setOpen} refetch={handleBundleList} />
      <DeleteBundle row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleBundleList} />
    </>
  );
}

export default BundleDataGrid;
