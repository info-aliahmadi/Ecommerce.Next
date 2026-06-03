// material-ui
import { Box, Button, IconButton, Tooltip } from '@mui/material';

// project import
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import DeleteDiscount from './DeleteDiscount';
import AddOrEditDiscount from './AddOrEditDiscount';
import { useSession } from 'next-auth/react';
import DiscountService from '../../_service/DiscountService';
import DiscountModel from '../../_types/Common/DiscountModel';
import { MRT_Row } from 'material-react-table';
import { MRT_Column } from '@root/app/types/MRT_Column';
import GridDataBound from '@root/app/types/GridDataBound';

// ===============================|| DISCOUNT DATA GRID ||=============================== //

function DiscountDataGrid() {
  const t = useTranslations('');
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const service = new DiscountService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [rowId, setRowId] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<DiscountModel>>();
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [fieldsName, buttonName] = ['fields.discount.', 'buttons.discount.'];

  const columns = useMemo<MRT_Column<DiscountModel>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t(fieldsName + 'name'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'couponCode',
        header: t(fieldsName + 'couponCode'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'usePercentage',
        header: t(fieldsName + 'usePercentage'),
        enableClickToCopy: true,
        type: 'boolean'
      },
      {
        accessorKey: 'discountPercentage',
        header: t(fieldsName + 'discountPercentage'),
        enableClickToCopy: true,
        type: 'number'
      },
      {
        accessorKey: 'discountAmount',
        header: t(fieldsName + 'discountAmount'),
        enableClickToCopy: true,
        type: 'number'
      },
      {
        accessorKey: 'isActive',
        header: t(fieldsName + 'isActive'),
        enableClickToCopy: true,
        type: 'boolean'
      }
    ],
    []
  );

  const handleDiscountList = useCallback(async (filters: GridDataBound) => {
    return await service.getDiscountList(filters);
  }, []);

  const handleNewRow = () => {
    setIsNew(true);
    setRowId(0);
    setOpen(true);
  };
  const handleEditRow = (row: MRT_Row<DiscountModel>) => {
    let discountId = row.original.id;
    setIsNew(false);
    setRowId(discountId);
    setOpen(true);
  };
  const handleDeleteRow = (row: MRT_Row<DiscountModel>) => {
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
    ({ row }: { row: MRT_Row<DiscountModel> }) => (
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
            dataApi={handleDiscountList}
            enableRowActions
            renderRowActions={DeleteOrEdit}
          />
        </TableCard>
      </MainCard>
      <AddOrEditDiscount isNew={isNew} discountId={rowId} open={open} setOpen={setOpen} refetch={handleRefetch}  />
      <DeleteDiscount row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch}  />
    </>
  );
}

export default DiscountDataGrid;
