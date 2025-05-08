// material-ui
import { Box, Button, IconButton, Tooltip } from '@mui/material';

// project import
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Delete, Edit, Add, Link } from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import DeleteCategory from './DeleteCategory';
import AddOrEditCategory from './AddOrEditCategory';
import { useSession } from 'next-auth/react';
import CategoryService from '../../_service/CategoryService';
import CategoryModel from '../../_types/Product/CategoryModel';
import { MRT_Row } from 'material-react-table';
import MRT_Column from '@root/app/types/MRT_Column';
import CONFIG from '@root/config';

// ===============================|| CATEGORY DATA GRID ||=============================== //

function CategoryDataGrid() {
  const [t] = useTranslation();
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const service = new CategoryService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<CategoryModel>>();
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [fieldsName, buttonName] = ['fields.category.', 'buttons.category.'];

  const columns = useMemo<MRT_Column<CategoryModel>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t(fieldsName + 'name'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'displayOrder',
        header: t(fieldsName + 'displayOrder'),
        enableClickToCopy: true,
        type: 'number'
      },
      {
        accessorKey: 'published',
        header: t(fieldsName + 'published'),
        enableClickToCopy: true,
        type: 'boolean'
      },
      {
        accessorKey: 'showOnHomepage',
        header: t(fieldsName + 'showOnHomepage'),
        enableClickToCopy: true,
        type: 'boolean'
      }
    ],
    []
  );

  const handleNewRow = (row?: MRT_Row<CategoryModel>) => {
    setIsNew(true);
    setRow(row);
    setOpen(true);
  };
  
  const handleEditRow = (row: MRT_Row<CategoryModel>) => {
    setIsNew(false);
    setRow(row);
    setOpen(true);
  };
  
  const handleDeleteRow = (row: MRT_Row<CategoryModel>) => {
    setRow(row);
    setOpenDelete(true);
  };
  
  const handleRefetch = () => {
    setRefetch(Date.now());
  };

  const handleCategoryList = useCallback(() => {
    return service.getCategoryList();
  }, []);

  const AddRow = useCallback(
    () => (
      <Button color="primary" onClick={() => handleNewRow()} variant="contained" startIcon={<CategoryIcon />}>
        {t(buttonName + 'addMainCategory')}
      </Button>
    ),
    []
  );

  const DeleteOrEdit = useCallback(
    ({ row }: { row: MRT_Row<CategoryModel> }) => (
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
        <Tooltip arrow placement="top-start" title={t(buttonName + 'addSubCategory')}>
          <IconButton onClick={() => handleNewRow(row)}>
            <Add />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t('buttons.visitorlink')}>
          <IconButton
            target='_blank'
            href={CONFIG.DOMAIN + "/category/" + row.original.id}>
            <Link />
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
            dataApi={handleCategoryList}
            enableExpanding={true}
            enableExpandAll={true}
            getSubRows={(originalRow) => originalRow.childs}
            enablePagination={false}
            enableColumnOrdering={false}
            enableColumnFilters={false}
            enableColumnResizing={false}
            enableBottomToolbar={false}
            enableGlobalFilterModes={false}
            enableColumnFilterModes={false}
            enableRowActions
            renderRowActions={DeleteOrEdit}
          />
        </TableCard>
      </MainCard>
      <AddOrEditCategory isNew={isNew} categoryId={row?.original?.id ?? 0} open={open} setOpen={setOpen} refetch={handleRefetch} parentCategory={row?.original} />
      <DeleteCategory row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch} />
    </>
  );
}

export default CategoryDataGrid; 