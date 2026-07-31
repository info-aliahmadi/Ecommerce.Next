'use client';

import Avatar from '@mui/material/Avatar';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import OrderService from '../../_service/OrderService';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Divider } from '@mui/material';
import CurrencyTypes from '@root/app/types/enums/CurrencyTypes';
import { GetImage } from '@root/app/(home)/_lib/utils';
import OrderItemModel from '../../_types/Order/OrderItemModel';

export default function OrderItemData({ orderId, currency }: Readonly<{ orderId: number; currency: CurrencyTypes }>) {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const [fieldsName, buttonName] = ['fields.orderItem.', 'buttons.orderItem.'];

  const { data: itemsResponse, isLoading, error } = useQuery({
    queryKey: ['orderItems', orderId],
    queryFn: async () => {
      const service = new OrderService(jwt ?? '');
      const result = await service.getOrderItemList(orderId);
      // if (!result.succeeded) throw new Error(result.message ?? 'Failed to load order items');
      return result.data ?? { orderItems: [] as OrderItemModel[], orderSummary: undefined };
    },
    enabled: orderId > 0 && !!jwt,
  });

  const values = itemsResponse?.orderItems ?? [];
  const valueAmounts = itemsResponse?.orderSummary;

  if (isLoading) {
    return <span>{t('fields.orderItem.loading')}</span>;
  }

  if (error) {
    return <span>{t('fields.orderItem.loadError', { message: error instanceof Error ? error.message : '' })}</span>;
  }

  return (
    <>
      {values.length > 0 ? (
        <TableContainer sx={{ marginTop: '10px' }} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{t(fieldsName + 'imagePreview')}</TableCell>
                <TableCell>{t(fieldsName + 'productName')}</TableCell>
                <TableCell>{t(fieldsName + 'quantity')}</TableCell>
                <TableCell>{t(fieldsName + 'unitPrice')}</TableCell>
                <TableCell>{t(fieldsName + 'discountAmount')}</TableCell>
                <TableCell>{t(fieldsName + 'totalPriceTax')}</TableCell>
                <TableCell>{t(fieldsName + 'totalPrice')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {values.map((res, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Avatar alt="" src={GetImage(res.productImagePreview, true)} sx={{ width: 40, height: 40, borderRadius: 1 }}></Avatar>
                  </TableCell>
                  <TableCell >{res.productName}</TableCell>
                  <TableCell >{res.quantity}</TableCell>
                  <TableCell >
                    {res.unitPrice.toCurrency(currency)}
                  </TableCell>
                  <TableCell >
                    {res.discountAmount.toCurrency(currency)}
                  </TableCell>
                  <TableCell >
                    {res.totalPriceTax.toCurrency(currency)}
                  </TableCell>
                  <TableCell >
                    {res.totalPrice.toCurrency(currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Divider />
          {valueAmounts && (
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Sum {t(fieldsName + 'discountAmount')}</TableCell>
                  <TableCell align="center">Sum {t(fieldsName + 'totalPriceTax')}</TableCell>
                  <TableCell align="center">Sum {t(fieldsName + 'totalPrice')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">
                    {valueAmounts.totalDiscountAmount ? valueAmounts.totalDiscountAmount.toCurrency(currency) : '0'}
                  </TableCell>
                  <TableCell align="center">
                    {valueAmounts.totalTax ? valueAmounts.totalTax.toCurrency(currency) : '0'}
                  </TableCell>
                  <TableCell align="center">
                    {valueAmounts.totalPrice ? valueAmounts.totalPrice.toCurrency(currency) : '0'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </TableContainer>
      ) : (
        <span>{t('fields.orderItem.noItems')}</span>
      )}
    </>
  );
}
