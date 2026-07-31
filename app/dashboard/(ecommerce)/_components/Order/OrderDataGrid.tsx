// material-ui
import Box from '@mui/material/Box';

// project import
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { useSession } from 'next-auth/react';
import OrderService from '../../_service/OrderService';
import OrderStatusView from './OrderStatusView';
import OrderDetail from './OrderDetail';
import OrderUserAvatar from './OrderUserAvatar';
import PaymentStatusView from './PaymentStatusView';
import OrderModel from '../../_types/Order/OrderModel';
import { MRT_Column } from '@root/app/types/MRT_Column';
import { MRT_Row } from 'material-react-table';
import GridDataBound from '@root/app/types/GridDataBound';
import { DateTimeViewer } from '@root/utils/DateViewer';
import CONFIG from '@root/config';
import ShippingStatus from '@root/app/types/enums/ShippingStatus';
import ShippingStatusView from './ShippingStatusView';


// ===============================|| COLOR BOX ||=============================== //

function OrderDataGrid() {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const defaultLanguage = session?.user.defaultLanguage ?? CONFIG.DEFAULT_LANGUAGE;
  const service = new OrderService(jwt ?? '');
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
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
        accessorKey: 'finalPrice',
        header: t(fieldsName + 'finalPrice'),
        enableClickToCopy: true,
        type: 'string',
        Cell: ({ row }: { row: MRT_Row<OrderModel> }) => row.original.finalPrice.toCurrency(row.original.userCurrencyType)
      },
      {
        accessorKey: 'orderStatusId',
        header: t(fieldsName + 'orderStatusId'),
        enableClickToCopy: true,
        type: 'string',
        Cell: ({ renderedCellValue, row }: { renderedCellValue: ReactNode; row: MRT_Row<OrderModel> }) => <OrderStatusView status={row.original.orderStatusId} />
      },
      {
        accessorKey: 'paymentStatusId',
        header: t(fieldsName + 'paymentStatusId'),
        enableClickToCopy: true,
        type: 'string',
        Cell: ({ row }: { row: MRT_Row<OrderModel> }) => <PaymentStatusView paymentStatus={row.original.paymentStatusId} />
      },
      {
        accessorKey: 'paymentDateUtc',
        header: t(fieldsName + 'paymentDateUtc'),
        enableClickToCopy: true,
        type: 'string',
        Cell: ({ row }: { row: MRT_Row<OrderModel> }) => row.original.paymentDateUtc && DateTimeViewer(defaultLanguage, row.original.paymentDateUtc)
      },
      {
        accessorKey: 'shippingStatusId',
        header: t(fieldsName + 'shippingStatusId'),
        enableClickToCopy: true,
        type: 'string',
        Cell: ({ row }: { row: MRT_Row<OrderModel> }) => <ShippingStatusView status={row.original.shippingStatusId} />
      }
    ],
    []
  );

  const handleRefetch = () => {
    setRefetch(Date.now());
  };

  const handleOrderList = useCallback(async (filters: GridDataBound) => {
    return await service.getOrderList(filters);
  }, []);

  return (
    <MainCard>
      <TableCard>
        <MaterialTable
          refetch={refetch}
          columns={columns}
          dataApi={handleOrderList}
          renderDetailPanel={({ row }) => <OrderDetail row={row} refetch={handleRefetch} />}
        />
      </TableCard>
    </MainCard>
  );
}

export default OrderDataGrid;
