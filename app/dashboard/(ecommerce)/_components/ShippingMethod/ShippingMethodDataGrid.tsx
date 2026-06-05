// material-ui
import { Box, Button, IconButton, Tooltip } from '@mui/material';

// project import
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
 import AddOrEditShippingMethod from './AddOrEditShippingMethod';
import DeleteShippingMethod from './DeleteShippingMethod';
import { useSession } from 'next-auth/react';
import ShippingMethodService from '../../_service/ShippingMethodService';
import ShippingMethodModel from '../../_types/Common/ShippingMethodModel';
import { MRT_Row } from 'material-react-table';
import { MRT_Column } from '@root/app/types/MRT_Column';
import GridDataBound from '@root/app/types/GridDataBound';
import Result from '@root/app/types/Result';

// ===============================|| SHIPPING METHOD DATA GRID ||=============================== //

function ShippingMethodDataGrid() {
  const t = useTranslations('');
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const service = new ShippingMethodService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [rowId, setRowId] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<ShippingMethodModel>>();
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [fieldsName, buttonName] = ['fields.shippingMethod.', 'buttons.shippingMethod.'];

  const columns = useMemo<MRT_Column<ShippingMethodModel>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t(fieldsName + 'name'),
        enableClickToCopy: true,
        type: 'string'
      }
    ],
    []
  );

  const handleShippingMethodList = useCallback(async (filters: GridDataBound): Promise<Result<PaginatedList<ShippingMethodModel>>> => {
    const response = await service.getShippingMethodList();
    const items = response.data ?? [];
    const pageIndex = filters.pageIndex ?? 0;
    const pageSize = filters.pageSize ?? 10;
    const pagedItems = items.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

    return {
      ...response,
      data: {
        pageIndex,
        pageSize,
        totalPages: Math.ceil(items.length / pageSize),
        totalItems: items.length,
        items: pagedItems
      }
    } as Result<PaginatedList<ShippingMethodModel>>;
  }, []);

  const handleNewRow = () => {
    setIsNew(true);
    setRowId(0);
    setOpen(true);
  };
  const handleEditRow = (row: MRT_Row<ShippingMethodModel>) => {
    const shippingMethodId = row.original.id;
    setIsNew(false);
    setRowId(shippingMethodId);
    setRow(row);
    setOpen(true);
  };
  const handleDeleteRow = (row: MRT_Row<ShippingMethodModel>) => {
    setRow(row);
    setOpenDelete(true);
  };
  const handleRefetch = () => {
    setRefetch(Date.now());
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
    ({ row }: { row: MRT_Row<ShippingMethodModel> }) => (
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
            dataApi={handleShippingMethodList}
            enableRowActions
            renderRowActions={DeleteOrEdit}
          />
        </TableCard>
      </MainCard>
      <AddOrEditShippingMethod isNew={isNew} shippingMethodId={rowId} open={open} setOpen={setOpen} refetch={handleRefetch} />
      <DeleteShippingMethod row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch} />
    </>
  );
}

export default ShippingMethodDataGrid;
