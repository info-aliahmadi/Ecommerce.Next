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
import AddOrEditTaxRate from './AddOrEditTaxRate';
import DeleteTaxRate from './DeleteTaxRate';
import { useSession } from 'next-auth/react';
import TaxRateService from '../../_service/TaxRateService';
import TaxRateModel from '../../_types/Common/TaxRateModel';
import { MRT_Row } from 'material-react-table';
import { MRT_Column } from '@root/app/types/MRT_Column';
import GridDataBound from '@root/app/types/GridDataBound';

// ===============================|| TAX RATE DATA GRID ||=============================== //

function TaxRateDataGrid() {
  const t = useTranslations('');
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const service = new TaxRateService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [rowId, setRowId] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<TaxRateModel>>();
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [fieldsName, buttonName] = ['fields.taxRate.', 'buttons.taxRate.'];

  const columns = useMemo<MRT_Column<TaxRateModel>[]>(
    () => [
      {
        accessorKey: 'taxCategoryName',
        header: t(fieldsName + 'taxCategoryId'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'countryName',
        header: t(fieldsName + 'countryId'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'percentage',
        header: t(fieldsName + 'percentage'),
        enableClickToCopy: true,
        type: 'number'
      }
    ],
    []
  );

  const handleTaxRateList = useCallback(async (filters: GridDataBound) => {
    return await service.getTaxRateList(filters);
  }, []);

  const handleNewRow = () => {
    setIsNew(true);
    setRowId(0);
    setOpen(true);
  };
  const handleEditRow = (row: MRT_Row<TaxRateModel>) => {
    const taxRateId = row.original.id;
    setIsNew(false);
    setRowId(taxRateId);
    setRow(row);
    setOpen(true);
  };
  const handleDeleteRow = (row: MRT_Row<TaxRateModel>) => {
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
    ({ row }: { row: MRT_Row<TaxRateModel> }) => (
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
            dataApi={handleTaxRateList}
            enableRowActions
            renderRowActions={DeleteOrEdit}
          />
        </TableCard>
      </MainCard>
      <AddOrEditTaxRate isNew={isNew} taxRateId={rowId} open={open} setOpen={setOpen} refetch={handleRefetch} />
      <DeleteTaxRate row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch} />
    </>
  );
}

export default TaxRateDataGrid;
