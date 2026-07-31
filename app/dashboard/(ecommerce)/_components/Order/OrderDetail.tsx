'use client';
import OrderChangeStatus from './OrderChangeStatus';
import OrderShipment from './OrderShipment';
import OrderItems from './OrderItems';

import { MRT_Row } from 'material-react-table';
import OrderModel from '../../_types/Order/OrderModel';

export default function OrderDetail({ row, refetch }: Readonly<{ row: MRT_Row<OrderModel>; refetch: () => void }>) {
  return (
    <>
      <OrderChangeStatus row={row} refetch={refetch} />
      <OrderShipment
        orderId={row.original.id}
        shipmentId={row.original.shipmentId}
        trackingNumber={row.original.trackingNumber}
        refetch={refetch}
      />
      <OrderItems orderId={row.original.id} currency={row.original.userCurrencyType} />
    </>
  );
}
