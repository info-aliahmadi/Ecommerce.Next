// material-ui
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';

// project import
import MainCard from '@dashboard/_components/MainCard';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import ProductsService from '@dashboard/(ecommerce)/_service/ProductService';
import { ImageNotSupported, Delete, Edit } from '@mui/icons-material';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import CONFIG from '@root/config';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import TableCard from '@dashboard/_components/TableCard';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DeleteProduct from './DeleteProduct';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import ProductDetail from './ProductDetail';
import { MRT_Row } from 'material-react-table';
import ProductModel from '../../_types/Product/ProductModel';
import { MRT_Column } from '@root/app/types/MRT_Column';
import { GridDataBound } from '@root/app/types/GridDataBound';

// ===============================|| COLOR BOX ||=============================== //

export default function ProductDataGrid() {
  const t = useTranslations("");

  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<ProductModel>>();
  const { data: session } = useSession();

  const jwt = session?.accessToken;

  const service = new ProductsService(jwt ?? '');
  const router = useRouter();

  const [fieldsName, buttonName] = ['fields.product.', 'buttons.product.'];

  const ImagePreviewRow = (({ renderedCellValue, row } : { renderedCellValue: any, row : MRT_Row<ProductModel> }) => {
    let src = renderedCellValue ? CONFIG.UPLOAD_BASEPATH + renderedCellValue.directory + renderedCellValue?.thumbnail : null;

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        {src != null ? (
          <Avatar alt="ImagePreview" variant="rounded" src={src} sx={{ width: 50, height: 50 }}></Avatar>
        ) : (
          <Avatar variant="rounded" sx={{ width: 50, height: 50 }}>
            <ImageNotSupported />
          </Avatar>
        )}
      </Box>
    );
  });
  
  const columns = useMemo<MRT_Column<ProductModel>[]>(
    () => [
      {
        accessorKey: 'id',
        header: t(fieldsName + 'id'),
        enableClickToCopy: true,
        size: 70,
        type: 'number'
        // filterVariant: 'text' | 'select' | 'multi-select' | 'range' | 'range-slider' | 'checkbox',
      }, {
        accessorKey: 'previewImage',
        header: t(fieldsName + 'previewImage'),
        type: 'string',
        Cell: ({ renderedCellValue, row }) => <ImagePreviewRow renderedCellValue={renderedCellValue} row={row} />
      }, {
        accessorKey: 'name',
        header: t(fieldsName + 'name'),
        enableClickToCopy: true,
        type: 'string'
        // filterVariant: 'text' | 'select' | 'multi-select' | 'range' | 'range-slider' | 'checkbox',
      },
      {
        accessorKey: 'stockQuantity',
        header: t(fieldsName + 'stockQuantity'),
        enableClickToCopy: true,
        type: 'number',
        enableResizing: true
      },
      {
        accessorKey: 'price',
        header: t(fieldsName + 'price'),
        type: 'number',
        enableResizing: true,
        Cell: ({ renderedCellValue, row }) => CurrencyViewer(renderedCellValue as number, row.original.currencyCode)
      },
      {
        accessorKey: 'published',
        header: t(fieldsName + 'published'),
        type: 'boolean',
        enableResizing: true,
        Cell: ({ renderedCellValue, row }: { renderedCellValue: ReactNode; row: MRT_Row<ProductModel> }) => (
          <Chip
            variant="outlined"
            color={renderedCellValue == true ? 'primary' : 'warning'}
            // icon={<>{renderedCellValue == true ? 'Published' : 'Draft'}</>}
            label={renderedCellValue == true ? t(fieldsName + 'published') : t(fieldsName + 'draft')}
            // sx={{ ml: 1.25, pl: 1 }}
            size="small"
          />
        )
      },
      {
        accessorKey: 'updatedOnUtc',
        header: t(fieldsName + 'updatedOnUtc'),
        type: 'dateTime'
      },
      {
        accessorKey: 'createdOnUtc',
        header: t(fieldsName + 'createdOnUtc'),
        type: 'dateTime'
      }
    ],
    []
  );
  const handleDeleteRow = (row: MRT_Row<ProductModel>) => {
    setRow(row);
    setOpenDelete(true);
  };
  const handleRefetch = () => {
    setRefetch(Date.now());
  };
  const handleProductList = useCallback(async (filters: GridDataBound) => {
    return await service.getProductList(filters);
  }, []);
  const AddRow = useCallback(
    () => (
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          router.push('/dashboard/product/add/0');
        }}
        startIcon={<AddBusinessOutlinedIcon />}
      >
        {t(buttonName + 'add')}
      </Button>
    ),
    []
  );

  const DeleteOrEdit = useCallback(
      ({ row }: { row: MRT_Row<ProductModel> }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="top-start" title={t(buttonName + 'delete')}>
          <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t(buttonName + 'edit')}>
          <IconButton onClick={() => router.push('/dashboard/product/edit/' + row.original.id)}>
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
            dataApi={handleProductList}
            enableRowActions
            // renderTopToolbarCustomActions={AddRow}
            renderRowActions={DeleteOrEdit}
            renderDetailPanel={({ row }) => <ProductDetail row={row} />}
          />
        </TableCard>
      </MainCard>
      <DeleteProduct row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch} />
    </>
  );
}

