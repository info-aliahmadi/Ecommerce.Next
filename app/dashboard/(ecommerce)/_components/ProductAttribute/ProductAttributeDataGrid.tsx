// material-ui
import { Box, Button, IconButton, Tooltip, Typography, Chip } from '@mui/material';

// project import
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import DeleteProductAttribute from './DeleteProductAttribute';
import AddOrEditProductAttribute from './AddOrEditProductAttribute';
import { useSession } from 'next-auth/react';
import ProductAttributeService from '../../_service/ProductAttributeService';
import ProductAttributeModel from '../../_types/Product/ProductAttributeModel';
import { MRT_Column } from '@root/app/types/MRT_Column';

import { MRT_Row } from 'material-react-table';
import AttributeType from '@root/app/types/enums/AttributeType';

// Mapping function for AttributeType to get descriptive names and colors
const getAttributeTypeConfig = (type: AttributeType): { label: string; color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default' } => {
  const t = useTranslations("fields.productAttribute.attributeTypes");
  const attributeTypeMap = {
    [AttributeType.Color]: {
      label: t('Color'),
      color: 'primary' as const
    },
    [AttributeType.Size]: {
      label: t('Size'),
      color: 'secondary' as const
    },
    [AttributeType.Weight]: {
      label: t('Weight'),
      color: 'info' as const
    },
    [AttributeType.Length]: {
      label: t('Length'),
      color: 'success' as const
    },
    [AttributeType.Width]: {
      label: t('Width'),
      color: 'warning' as const
    },
    [AttributeType.Height]: {
      label: t('Height'),
      color: 'error' as const
    },
    [AttributeType.Material]: {
      label: t('Material'),
      color: 'primary' as const
    },
    [AttributeType.Style]: {
      label: t('Style'),
      color: 'secondary' as const
    },
    [AttributeType.Pattern]: {
      label: t('Pattern'),
      color: 'info' as const
    },
    [AttributeType.Brand]: {
      label: t('Brand'),
      color: 'success' as const
    },
    [AttributeType.Model]: {
      label: t('Model'),
      color: 'warning' as const
    }
  };

  return attributeTypeMap[type] || { label: `Unknown Type (${type})`, color: 'default' as const };
};

// ===============================|| COLOR BOX ||=============================== //

export default function ProductAttributeDataGrid() {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const service = new ProductAttributeService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [rowId, setRowId] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<ProductAttributeModel>>();
  const [productAttributeList, setProductAttributeList] = useState<ProductAttributeModel[]>([]);
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
        accessorKey: 'value',
        header: t(fieldsName + 'value'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'attributeType',
        header: t(fieldsName + 'attributeType'),
        enableClickToCopy: true,
        type: 'string',
        Cell: ({ row }) => {
          const config = getAttributeTypeConfig(row.original.attributeType);
          return (
            <Chip
              label={config.label}
              color={config.color}
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 'medium',
                minWidth: '80px'
              }}
            />
          );
        }
      },
      {
        accessorKey: 'description',
        header: t(fieldsName + 'description'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'showOnHomepage',
        header: t(fieldsName + 'showOnHomepage'),
        enableClickToCopy: false,
        type: 'boolean'
      }
    ],
    []
  );

  useEffect(() => {
    handleProductAttributeList();
  }, []);

  const handleNewRow = () => {
    setIsNew(true);
    setRowId(0);
    setOpen(true);
  };

  const handleEditRow = (row: MRT_Row<ProductAttributeModel>) => {
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

  const handleProductAttributeList = async () => {
    const result = await service.getProductAttributeList();
    if (result.succeeded) {
      setProductAttributeList(result.data ?? []);
    }
    return result;
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
            dataSet={productAttributeList}
            enableRowActions
            renderRowActions={DeleteOrEdit}
          />
        </TableCard>
      </MainCard>
      <AddOrEditProductAttribute isNew={isNew} productAttributeId={rowId} open={open} setOpen={setOpen} refetch={handleProductAttributeList} />
      <DeleteProductAttribute row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleProductAttributeList} />
    </>
  );
}

