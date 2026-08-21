// material-ui
import { Avatar, Box, Button, IconButton, Stack, Tooltip } from '@mui/material';

// project import
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Delete, Edit, Add, Link, Save, ImageNotSupported } from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import DeleteCategory from './DeleteCategory';
import AddOrEditCategory from './AddOrEditCategory';
import { useSession } from 'next-auth/react';
import CategoryService from '../../_service/CategoryService';
import CategoryModel from '../../_types/Product/CategoryModel';
import { MRT_Row } from 'material-react-table';
import { MRT_Column } from '@root/app/types/MRT_Column';
import CONFIG from '@root/config';
import Notify from '@root/app/dashboard/_components/@extended/Notify';
import { GetImage } from '@root/app/(home)/_lib/utils';

// ===============================|| CATEGORY DATA GRID ||=============================== //

function CategoryDataGrid() {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const service = new CategoryService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<CategoryModel>>();
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const [fieldsName, buttonName] = ['fields.category.', 'buttons.category.'];

  const columns = useMemo<MRT_Column<CategoryModel>[]>(
    () => [
      {
        accessorKey: 'imagePreview',
        header: t('fields.category.imagePreviewId'),
        type: 'string',
        Cell: ({ row }: { row: MRT_Row<CategoryModel> }) => <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          {row.original.imagePreview ? (
            <img alt="ImagePreview" src={GetImage(row.original.imagePreview, true)} height={'80px'} />
          ) : (
            <Avatar variant="rounded">
              <ImageNotSupported />
            </Avatar>
          )}
        </Box>
      },
      {
        accessorKey: 'name',
        header: t(fieldsName + 'name'),
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
        accessorKey: 'showOnHomepage',
        header: t(fieldsName + 'showOnHomepage'),
        enableClickToCopy: true,
        type: 'boolean'
      },
      {
        accessorKey: 'metaTitle',
        header: t(fieldsName + 'metaTitle'),
        enableClickToCopy: true,
        type: 'string'
      }
      // {
      //   accessorKey: 'metaDescription',
      //   header: t(fieldsName + 'metaDescription'),
      //   enableClickToCopy: true,
      //   type: 'string'
      // }
    ],
    []
  );

  const handleCategoryList = () => {
    service.getCategoryList().then((result) => {
      setCategories(result.data ?? []);
      handleRefetch();
    });
  };
  useEffect(() => {
    handleCategoryList();
  }, []);
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


  const handleSaveOrder = (categories: CategoryModel[]) => {
    service
      .updateOrderCategories(categories)
      .then((result) => {
        setNotify({ open: true });
        setShowSaveBtn(false);
        handleRefetch();
      })
      .catch((error) => {
        setNotify({ open: true, type: 'error', description: error });
      });
  };

  const AddOrOrderRow = useCallback(
    (showSaveBtn: boolean, categories: CategoryModel[]) => (
      <Stack spacing={2} direction="row">
        <Button color="primary" onClick={() => handleNewRow()} variant="contained" startIcon={<CategoryIcon />}>
          {t(buttonName + 'addMainCategory')}
        </Button>
        {showSaveBtn && (
          <Button color="info" onClick={() => handleSaveOrder(categories)} variant="contained" startIcon={<Save />}>
            {t('buttons.category.saveOrder')}
          </Button>
        )}
      </Stack>
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

  function replaceAndSort(categories: CategoryModel[], idToReplace: number, idToReplaceBeside: number) {
    const findItem = (id: number, items: CategoryModel[]): CategoryModel | null => {
      for (const item of items) {
        if (item.id === id) {
          return item;
        } else if (item?.childs && item?.childs.length > 0) {
          const found = findItem(id, item.childs);
          if (found) return found;
        }
      }
      return null;
    };

    function findItemParent(id: number, categories: CategoryModel[]): CategoryModel | undefined {
      for (const category of categories) {
        if (category.childs?.some((child) => child.id === id)) {
          return category;
        } else if (category.childs && category.childs.length > 0) {
          const found = findItemParent(id, category.childs);
          if (found) return found;
        }
      }
      return undefined;
    }
    const itemToReplace = findItem(idToReplace, categories);
    const itemBeside = findItem(idToReplaceBeside, categories);
    if (itemToReplace && itemBeside) {
      itemToReplace.parentCategoryId = itemBeside?.parentCategoryId;
      itemToReplace.displayOrder = itemToReplace.displayOrder > itemBeside.displayOrder ? itemBeside.displayOrder - 1 : itemBeside.displayOrder + 1;
      itemToReplace.isEdited = true;


      const parentOfItemToReplace = findItemParent(idToReplace, categories);
      const parentOfItemBeside = findItemParent(idToReplaceBeside, categories);
      if (parentOfItemToReplace && parentOfItemBeside) {

        if (!parentOfItemToReplace || !parentOfItemBeside) {
          return categories;
        }
        if (parentOfItemToReplace?.childs && parentOfItemBeside?.childs) {
          // Find the indices of the items within their respective parents
          const indexToReplace = parentOfItemToReplace.childs.findIndex((child: CategoryModel) => child.id === idToReplace);
          const indexBeside = parentOfItemBeside.childs.findIndex((child: CategoryModel) => child.id === idToReplaceBeside);

          if (indexToReplace === -1 || indexBeside === -1) {
            return categories;
          }
          // Replace items between different parents at the same depth
          parentOfItemToReplace.childs.splice(indexToReplace, 1);
          parentOfItemBeside.childs.splice(indexBeside, 0, itemToReplace);
        }

      } else {
        const indexToReplace = categories.findIndex((x) => x.id === idToReplace);
        const indexBeside = categories.findIndex((x) => x.id === idToReplaceBeside);

        categories.splice(indexToReplace, 1);
        categories.splice(indexBeside, 0, itemToReplace);
      }

    }

    // Sort by order
    const sortRecursive = (categories: CategoryModel[]) => {
      categories.sort((a, b) => a.displayOrder - b.displayOrder);
      for (const category of categories) {
        if (category.childs) {
          sortRecursive(category.childs);
        }
      }
    };

    sortRecursive(categories);
    return categories;
  }

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <MainCard title={AddOrOrderRow(showSaveBtn, categories)}>
        <TableCard>
          <MaterialTable
            dataSet={categories}
            refetch={refetch}
            columns={columns}
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
            enableRowOrdering={true}
            autoResetPageIndex={false}
            muiTableBodyRowDragHandleProps={({ table }: { table: any }) => ({
              onDragEnd: () => {
                const { draggingRow, hoveredRow } = table.getState();
                if (hoveredRow && draggingRow) {
                  if (hoveredRow.depth != draggingRow.depth) {
                    setNotify({ open: true, type: 'error', description: "You can't replace items from different depth" });
                    return;
                  }

                  replaceAndSort(categories, draggingRow.original.id, hoveredRow.original.id);
                  setCategories([...categories]);
                  setShowSaveBtn(true);
                  handleRefetch();
                }
              }
            })}
            displayColumnDefOptions={{
              'mrt-row-actions': {
                //header: 'Change Account Settings', //change header text
                size: 180 //make actions column wider
              }
            }}
          />
        </TableCard>
      </MainCard>
      <AddOrEditCategory isNew={isNew} row={row} open={open} setOpen={setOpen} refetch={handleCategoryList} />
      <DeleteCategory row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleCategoryList} />
    </>
  );
}

export default CategoryDataGrid; 