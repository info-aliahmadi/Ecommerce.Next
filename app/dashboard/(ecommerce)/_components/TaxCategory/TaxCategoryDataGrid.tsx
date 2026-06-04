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
import AddOrEditTaxCategory from './AddOrEditTaxCategory';
import DeleteTaxCategory from './DeleteTaxCategory';
import { useSession } from 'next-auth/react';
import TaxCategoryService from '../../_service/TaxCategoryService';
import TaxCategoryModel from '../../_types/Common/TaxCategoryModel';
import { MRT_Row } from 'material-react-table';
import { MRT_Column } from '@root/app/types/MRT_Column';
import GridDataBound from '@root/app/types/GridDataBound';
import Result from '@root/app/types/Result';

// ===============================|| TAX CATEGORY DATA GRID ||=============================== //

function TaxCategoryDataGrid() {
  const t = useTranslations('');
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const service = new TaxCategoryService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [rowId, setRowId] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<TaxCategoryModel>>();
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [fieldsName, buttonName] = ['fields.taxCategory.', 'buttons.taxCategory.'];

  const columns = useMemo<MRT_Column<TaxCategoryModel>[]>(
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

  const handleTaxCategoryList = useCallback(async (filters: GridDataBound): Promise<Result<PaginatedList<TaxCategoryModel>>> => {
    const response = await service.getTaxCategoryList();
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
    } as Result<PaginatedList<TaxCategoryModel>>;
  }, []);

  const handleNewRow = () => {
    setIsNew(true);
    setRowId(0);
    setOpen(true);
  };
  const handleEditRow = (row: MRT_Row<TaxCategoryModel>) => {
    const taxCategoryId = row.original.id;
    setIsNew(false);
    setRowId(taxCategoryId);
    setRow(row);
    setOpen(true);
  };
  const handleDeleteRow = (row: MRT_Row<TaxCategoryModel>) => {
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
    ({ row }: { row: MRT_Row<TaxCategoryModel> }) => (
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
            dataApi={handleTaxCategoryList}
            enableRowActions
            renderRowActions={DeleteOrEdit}
          />
        </TableCard>
      </MainCard>
      <AddOrEditTaxCategory isNew={isNew} taxCategoryId={rowId} open={open} setOpen={setOpen} refetch={handleRefetch} />
      <DeleteTaxCategory row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch} />
    </>
  );
}

export default TaxCategoryDataGrid;
