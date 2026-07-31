# Split OrderDetail.tsx into 3 focused components

## Goal
Encapsulate `app/dashboard/(ecommerce)/_components/Order/OrderDetail.tsx` into 3 self-contained components, leaving `OrderDetail.tsx` as a thin orchestrator. `OrderDataGrid.tsx` needs NO changes (OrderDetail keeps the same `({ row, refetch })` signature, used at `OrderDataGrid.tsx:117`).

## Three new components

### 1. `OrderChangeStatus.tsx` (the Formik form)
**Path:** `app/dashboard/(ecommerce)/_components/Order/OrderChangeStatus.tsx`
- **Props:** `{ row: MRT_Row<OrderModel>; refetch: () => void }`
- **Moves** from OrderDetail:
  - `useState<NotifyProps>` + `Notify` (lines 43, 60-62)
  - `OrderService` instantiation + `handleSubmit` (lines 41, 47-58)
  - The entire `Formik` tree (lines 64-225): validation schema, initial values from `row.original`, the 4 `Select*` components, the 3 `TextField`s, and the Save `Button`.
- **Imports:** `FormHelperText, Grid, InputLabel, TextField, Stack` + `Save` from `@mui/icons-material`; `* as Yup, Formik`; `useTranslations, useSession`; `MainCard, setServerErrors, Notify, OrderService, SelectPaymentStatus, SelectShippingStatus, SelectOrderStatus, SelectShippingMethod, MRT_Row, OrderModel, OrderChangeStatusModel, AnimateButton, Button`.
- Note: keep `paymentMethodId: row.original.paymentMethodId ?? null` and `enableReinitialize` exactly as-is.

### 2. `OrderShipment.tsx` (tracking + dialog)
**Path:** `app/dashboard/(ecommerce)/_components/Order/OrderShipment.tsx`
- **Props:** `{ orderId: number; shipmentId: number | null; trackingNumber: string; refetch: () => void }`
- **Moves** from OrderDetail:
  - `useState` for `shipmentOpen` (line 44)
  - The Shipment `MainCard` with title + Add/Edit `Button` secondary (lines 227-258)
  - `<ShipmentDialog>` (lines 260-266)
- **Imports:** `Grid, InputLabel, TextField, Stack`; `useTranslations`; `MainCard, AnimateButton, Button, ShipmentDialog`.
- Design: primitives (`orderId`, `shipmentId`, `trackingNumber`) instead of `MRT_Row` — `MRT_Row` is not needed here and removes the table dependency from this component.

### 3. `OrderItems.tsx` (items table)
**Path:** `app/dashboard/(ecommerce)/_components/Order/OrderItems.tsx`
- **Props:** `{ orderId: number; currency: CurrencyTypes }`
- **Moves** from OrderDetail: the single `<OrderItemData orderId={...} currency={...} />` (line 268) and the existing import.
- **UI decision:** Unlike the other two sections, the original `OrderItemData` has NO `MainCard` wrapper. To match the `OrderShipment` card aesthetics, wrap it in a `MainCard` titled `t('fields.order.orderItems')` (or reuse `OrderItemData`'s own structure). This is a deliberate consistency change — flag if it should NOT be wrapped to preserve exact current rendering.
- **Imports:** `MainCard, OrderItemData, useTranslations, CurrencyTypes, Grid, Stack` (only if wrapped).

## Resulting OrderDetail.tsx (reduced)
```tsx
'use client';
import OrderChangeStatus from './OrderChangeStatus';
import OrderShipment from './OrderShipment';
import OrderItems from './OrderItems';
import { MRT_Row } from 'material-react-table';
import OrderModel from '../../_types/Order/OrderModel';
import { useTranslations } from 'next-intl';

export default function OrderDetail({ row, refetch }: Readonly<{ row: MRT_Row<OrderModel>; refetch: () => void }>) {
  const t = useTranslations('');
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
```
- Remove now-unused imports from OrderDetail (`useState, Grid, TextField, Stack, Save, * as Yup, Formik, MRT_Row/OrderModel kept, FormHelperText, InputLabel, useSession, MainCard, setServerErrors, Notify, OrderService, all Select*, ShipmentDialog, OrderItemData, AnimateButton, Button, OrderChangeStatusModel`). `t` is unused in the slimmed OrderDetail — remove the `useTranslations` import there.

## OrderDataGrid.tsx
- **No changes.** `renderDetailPanel={({ row }) => <OrderDetail row={row} refetch={handleRefetch} />}` still works; OrderDetail signature is unchanged.

## Validation
- `npx tsc --noEmit` — check for unused-variable errors (the `t` and unused imports in each file).
- `npm run lint` — Next legacy eslintrc; confirm no unused imports flagged.
- `npm run dev` — smoke-test the order detail panel expansion in the dashboard.

## Open question
Should `OrderItems` wrap `OrderItemData` in a `MainCard` (matching `OrderShipment`) or render it bare to preserve current UI? Default in plan = wrap for consistency.
