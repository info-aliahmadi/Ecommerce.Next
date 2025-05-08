// material-ui
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';

// project import
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Delete } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import DeleteProductAttribute from './DeleteProductAttribute';
import AddOrEditProductAttribute from './AddOrEditProductAttribute';
import { useSession } from 'next-auth/react';
import ProductAttributeService from '../../_service/ProductAttributeService';
import ProductAttributeModel from '../../_types/Product/ProductAttributeModel';
import MRT_Column from '@root/app/types/MRT_Column';

import { MRT_Row } from 'material-react-table';


// ===============================|| COLOR BOX ||=============================== //

export default function ProductAttributeDataGrid() {
  const [t] = useTranslation();
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const service = new ProductAttributeService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [rowId, setRowId] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<ProductAttributeModel>>();
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [fieldsName, buttonName] = ['fields.productAttribute.', 'buttons.productAttribute.'];

  const columns = useMemo<MRT_Column<ProductAttributeModel>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t(fieldsName + 'name'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'metaKeywords',
        header: t(fieldsName + 'metaKeywords'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'metaTitle',
        header: t(fieldsName + 'metaTitle'),
        enableClickToCopy: true,
        type: 'string'
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

  const handleNewRow = () => {
    setIsNew(true);
    setRowId(0);
    setOpen(true);
  };
  const handleEditRow = (row : MRT_Row<ProductAttributeModel>) => {
    let productAttributeId = row.original.id;
    setIsNew(false);
    setRowId(productAttributeId);
    setOpen(true);
  };
  const handleDeleteRow = (row: MRT_Row<ProductAttributeModel>) => {
    setRow(row);
    setOpenDelete(true);
  };
  const handleRefetch = () => {
    setRefetch(Date.now());
  };

  const handleProductAttributeList = useCallback(async (filters : GridDataBound ) => {
    return await service.getProductAttributeList(filters);
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
    ({ row }: { row: MRT_Row<ProductAttributeModel> }) => (
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
            dataApi={handleProductAttributeList}
            enableRowActions
            renderRowActions={DeleteOrEdit}
          />
        </TableCard>
      </MainCard>
      <AddOrEditProductAttribute isNew={isNew} productAttributeId={rowId} open={open} setOpen={setOpen} refetch={handleRefetch} />
      <DeleteProductAttribute row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch} />
    </>
  );
}

