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
import AddOrEditStateProvince from './AddOrEditStateProvince';
import DeleteStateProvince from './DeleteStateProvince';
import { useSession } from 'next-auth/react';
import StateProvinceService from '../../_service/StateProvinceService';
import StateProvinceModel from '../../_types/Common/StateProvinceModel';
import { MRT_Row } from 'material-react-table';
import { MRT_Column } from '@root/app/types/MRT_Column';
import GridDataBound from '@root/app/types/GridDataBound';

// ===============================|| STATE PROVINCE DATA GRID ||=============================== //

function StateProvinceDataGrid() {
  const t = useTranslations('');
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const service = new StateProvinceService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [rowId, setRowId] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<StateProvinceModel>>();
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [fieldsName, buttonName] = ['fields.stateProvince.', 'buttons.stateProvince.'];

  const columns = useMemo<MRT_Column<StateProvinceModel>[]>(
    () => [
      {
        accessorKey: 'countryName',
        header: t(fieldsName + 'countryId'),
        enableClickToCopy: true,
        type: 'string',
      },
      {
        accessorKey: 'name',
        header: t(fieldsName + 'name'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'abbreviation',
        header: t(fieldsName + 'abbreviation'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'published',
        header: t(fieldsName + 'published'),
        enableClickToCopy: true,
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

  const handleStateProvinceList = useCallback(async (filters: GridDataBound) => {
    return await service.getStateProvinceList(filters);
  }, []);

  const handleNewRow = () => {
    setIsNew(true);
    setRowId(0);
    setOpen(true);
  };
  const handleEditRow = (row: MRT_Row<StateProvinceModel>) => {
    const stateProvinceId = row.original.id;
    setIsNew(false);
    setRowId(stateProvinceId);
    setRow(row);
    setOpen(true);
  };
  const handleDeleteRow = (row: MRT_Row<StateProvinceModel>) => {
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
    ({ row }: { row: MRT_Row<StateProvinceModel> }) => (
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
            dataApi={handleStateProvinceList}
            enableRowActions
            renderRowActions={DeleteOrEdit}
          />
        </TableCard>
      </MainCard>
      <AddOrEditStateProvince isNew={isNew} stateProvinceId={rowId} open={open} setOpen={setOpen} refetch={handleRefetch} />
      <DeleteStateProvince row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch} />
    </>
  );
}

export default StateProvinceDataGrid;
