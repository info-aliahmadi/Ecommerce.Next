import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
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
import OrderItemModel, { SumOrderItemsModel } from '../../_types/Order/OrderItemModel';
import CurrencyTypes from '@root/app/types/enums/CurrencyTypes';

// ===============================|| COLOR BOX ||=============================== //

export default function OrderItemData({ orderId, currency }: Readonly<{ orderId: number; currency: CurrencyTypes }>) {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const service = new OrderService(jwt ?? '');
  const [values, setValues] = useState<OrderItemModel[]>([]);
  const [valueAmounts, setValueSumAmounts] = useState<SumOrderItemsModel>();
  const [fieldsName, buttonName] = ['fields.orderItem.', 'buttons.orderItem.'];

  useEffect(() => {
    loadOrderItems();
  }, []);

  const loadOrderItems = () => {
    if (orderId > 0) {
      //setLoading(true);


      service.getOrderItemList(orderId).then((result) => {
        setValues(result.data?.[0] ?? []);
        setValueSumAmounts(result.data?.[1] ?? undefined);
      });
    } else {
      setValues([]);
      setValueSumAmounts(undefined);
    }
  };

  return (
    <>
      {values.length > 0 ? (
        <TableContainer sx={{ marginTop: '10px' }} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell align="center">{t(fieldsName + 'productName')}</TableCell>
                <TableCell align="center">{t(fieldsName + 'quantity')}</TableCell>
                <TableCell align="center">{t(fieldsName + 'unitPrice')}</TableCell>
                <TableCell align="center">{t(fieldsName + 'discountAmount')}</TableCell>
                <TableCell align="center">{t(fieldsName + 'totalPriceTax')}</TableCell>
                <TableCell align="center">{t(fieldsName + 'totalPrice')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {values.map((res, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Avatar alt="" src={'/images/rez.jpg'} sx={{ width: 80, height: 80, borderRadius: 1 }}></Avatar>
                  </TableCell>
                  <TableCell align="center">{res.productName}</TableCell>
                  <TableCell align="center">{res.quantity}</TableCell>
                  <TableCell align="center">
                    {res.unitPrice.toCurrency(currency)}
                  </TableCell>
                  <TableCell align="center">
                    {res.discountAmount.toCurrency(currency)}
                  </TableCell>
                  <TableCell align="center">
                    {res.totalPriceTax.toCurrency(currency)}
                  </TableCell>
                  <TableCell align="center">
                    {res.totalPrice.toCurrency(currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Divider />
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Sum {t(fieldsName + 'unitPrice')}</TableCell>
                <TableCell align="center">Sum {t(fieldsName + 'discountAmount')}</TableCell>
                <TableCell align="center">Sum {t(fieldsName + 'totalPriceTax')}</TableCell>
                <TableCell align="center">Sum {t(fieldsName + 'totalPrice')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center">
                  {valueAmounts?.totalPrice.toCurrency(currency)}
                </TableCell>
                <TableCell align="center">
                  {valueAmounts?.totalDiscountAmount?.toCurrency(currency)}
                </TableCell>
                <TableCell align="center">
                  {valueAmounts?.totalPrice.toCurrency(currency)}
                </TableCell>
                <TableCell align="center">
                  {valueAmounts?.totalPrice.toCurrency(currency)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <span>There is no item.</span>
      )}
    </>
  );
}
