// material-ui
import { Box, Button, IconButton, Tooltip } from '@mui/material';

// project import
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Delete } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeleteProductTag from './DeleteProductTag';
import AddOrEditProductTag from './AddOrEditProductTag';
import { useSession } from 'next-auth/react';
import ProductTagService from '../../_service/ProductTagService';
import ProductTagModel from '../../_types/Product/ProductTagModel';
import { MRT_Row } from 'material-react-table';
import MRT_Column from '@root/app/types/MRT_Column';

// ===============================|| PRODUCT TAG DATA GRID ||=============================== //

function ProductTagDataGrid() {
  const [t] = useTranslation();
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const service = new ProductTagService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [rowId, setRowId] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<ProductTagModel>>();
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [fieldsName, buttonName] = ['fields.product-tag.', 'buttons.product-tag.'];
  
  const columns = useMemo<MRT_Column<ProductTagModel>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('fields.product-tag.name'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'products',
        header: t('fields.product-tag.products'),
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
  const handleEditRow = (row : MRT_Row<ProductTagModel>) => {
    let productTagId = row.original.id;
    setIsNew(false);
    setRowId(productTagId);
    setRow(row);
    setOpen(true);
  };
  const handleDeleteRow = (row: MRT_Row<ProductTagModel>) => {
    setRow(row);
    setOpenDelete(true);
  };
  const handleRefetch = () => {
    setRefetch(Date.now());
  };

  const handleProductTagList = useCallback(async (filters: GridDataBound) => {
    return await service.getProductTagList(filters);
  }, []);

  const AddRow = useCallback(
    () => (
      <Button color="primary" onClick={handleNewRow} variant="contained" startIcon={<LocalOfferIcon />}>
        {t('buttons.product-tag.add')}
      </Button>
    ),
    []
  );

  const DeleteOrEdit = useCallback(
    ({ row }: { row: MRT_Row<ProductTagModel> }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="top-start" title={t('buttons.product-tag.delete')}>
          <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t('buttons.product-tag.edit')}>
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
            dataApi={handleProductTagList}
            enableRowActions
            renderRowActions={DeleteOrEdit}
          />
        </TableCard>
      </MainCard>
      <AddOrEditProductTag isNew={isNew} row={row} open={open} setOpen={setOpen} refetch={handleRefetch} />
      <DeleteProductTag row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch} />
    </>
  );
}

export default ProductTagDataGrid; 