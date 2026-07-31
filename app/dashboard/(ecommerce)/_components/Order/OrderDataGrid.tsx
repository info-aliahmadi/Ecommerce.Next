// material-ui
import Box from '@mui/material/Box';
import { MenuItem, ListItemIcon } from '@mui/material';

// project import
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { useSession } from 'next-auth/react';
import OrderService from '../../_service/OrderService';
import OrderStatus from './OrderStatus';
import OrderDetail from './OrderDetail';
import OrderUserAvatar from './OrderUserAvatar';
import PaymentStatus from './PaymentStatus';
import PaymentDetail from './PaymentDetail';
import OrderModel from '../../_types/Order/OrderModel';
import { MRT_Column } from '@root/app/types/MRT_Column';
import { MRT_Row } from 'material-react-table';
import GridDataBound from '@root/app/types/GridDataBound';


// ===============================|| COLOR BOX ||=============================== //

function OrderDataGrid() {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const service = new OrderService(jwt ?? '');
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [rowId, setRowId] = useState(0);
  const [open, setOpen] = useState(false);
  const [fieldsName, buttonName] = ['fields.order.', 'buttons.order.'];

  const columns = useMemo<MRT_Column<OrderModel>[]>(
    () => [
      {
        accessorKey: 'id',
        header: t(fieldsName + 'id'),
        enableClickToCopy: true,
        type: 'string',
        Cell: ({ renderedCellValue, row }) => <span># {renderedCellValue}</span>
      },
      {
        accessorKey: 'userName',
        header: t(fieldsName + 'userName'),
        enableClickToCopy: true,
        type: 'string',
        Cell: ({ renderedCellValue, row }: { renderedCellValue: ReactNode; row: MRT_Row<OrderModel> }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <OrderUserAvatar value={renderedCellValue as string} avatar={row.original.userAvatar} />
          </Box>
        )
      },
      {
        accessorKey: 'orderStatusId',
        header: t(fieldsName + 'orderStatusId'),
        enableClickToCopy: true,
        type: 'string',
        Cell: ({ renderedCellValue, row }: { renderedCellValue: ReactNode; row: MRT_Row<OrderModel> }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <OrderStatus status={renderedCellValue as number} />
          </Box>
        )
      },
      {
        accessorKey: 'finalPrice',
        header: t(fieldsName + 'finalPrice'),
        enableClickToCopy: true,
        type: 'string',
        Cell: ({ row }: { row: MRT_Row<OrderModel> }) => row.original.finalPrice.toCurrency(row.original.userCurrencyType)
      },
      {
        accessorKey: 'paymentStatusId',
        header: t(fieldsName + 'paymentStatusId'),
        enableClickToCopy: true,
        type: 'string',
        Cell: ({ row }: { row: MRT_Row<OrderModel> }) => <PaymentStatus paymentStatus={row.original.paymentStatusId} />
      },
      {
        accessorKey: 'paymentDateUtc',
        header: t(fieldsName + 'paymentDateUtc'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'paymentTrackingCode',
        header: t(fieldsName + 'paymentTrackingCode'),
        enableClickToCopy: true,
        type: 'string',
        Cell: ({ renderedCellValue, row }: { renderedCellValue: ReactNode; row: MRT_Row<OrderModel> }) => (
          <Box
            onClick={() => {
              handlePaymentDetail(row);
            }}
          >
            {renderedCellValue}
          </Box>
        )
      }
    ],
    []
  );

  const handleRefetch = () => {
    setRefetch(Date.now());
  };

  const handlePaymentDetail = (row: MRT_Row<OrderModel>) => {
    let orderId = row.original.id;
    setRowId(orderId);
    setOpen(true);
  };

  const RowActionMenuItems = useCallback(
    ({ closeMenu, row }: { closeMenu: () => void; row: MRT_Row<OrderModel> }) => [
      <MenuItem key={0} sx={{ m: 0 }}>
        <ListItemIcon>{/* <AccountCircle /> */}</ListItemIcon>
        View Detail
      </MenuItem>,
      <MenuItem
        key={1}
        onClick={() => {
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>{/* <Send /> */}</ListItemIcon>
        Send Email
      </MenuItem>
    ],
    []
  );

  const handleOrderList = useCallback(async (filters: GridDataBound) => {
    return await service.getOrderList(filters);
  }, []);

  return (
    <>
      <MainCard>
        <TableCard>
          <MaterialTable
            refetch={refetch}
            columns={columns}
            dataApi={handleOrderList}
            enableRowActions
            renderRowActionMenuItems={RowActionMenuItems}
            renderDetailPanel={({ row }) => <OrderDetail row={row} refetch={handleRefetch} />}
          />
        </TableCard>
      </MainCard>
      {/* <PaymentDetail orderId={rowId} open={open} setOpen={setOpen} refetch={handleRefetch} /> */}
    </>
  );
}

export default OrderDataGrid;
