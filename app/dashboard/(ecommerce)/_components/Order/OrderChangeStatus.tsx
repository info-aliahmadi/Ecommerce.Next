'use client';
import { useState } from 'react';

import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Save from '@mui/icons-material/Save';

import * as Yup from 'yup';
import { Formik } from 'formik';

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

import MainCard from '@dashboard/_components/MainCard';
import setServerErrors from '@root/utils/setServerErrors';
import Notify from '@dashboard/_components/@extended/Notify';
import OrderService from '../../_service/OrderService';
import SelectPaymentStatus from './SelectPaymentStatus';
import SelectShippingStatus from './SelectShippingStatus';
import SelectOrderStatus from './SelectOrderStatus';
import SelectShippingMethod from './SelectShippingMethod';
import AnimateButton from '@dashboard/_components/@extended/AnimateButton';
import { Button } from '@mui/material';

import { MRT_Row } from 'material-react-table';
import OrderModel from '../../_types/Order/OrderModel';
import OrderChangeStatusModel from '../../_types/Order/OrderChangeStatusModel';

export default function OrderChangeStatus({ row, refetch }: Readonly<{ row: MRT_Row<OrderModel>; refetch: () => void }>) {
  const t = useTranslations('');
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const orderService = new OrderService(jwt ?? '');
  const [fieldsName, buttonName] = ['fields.order.', 'buttons.'];
  const [notify, setNotify] = useState<NotifyProps>({ open: false });

  const handleSubmit = (order: OrderChangeStatusModel, resetForm: (values: any) => void, setErrors: (errors: any) => void) => {
    orderService
      .updateOrderState(order)
      .then(() => {
        setNotify({ open: true });
        refetch();
      })
      .catch((error) => {
        setErrors(setServerErrors(error));
        setNotify({ open: true, type: 'error', description: error });
      });
  };

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>

      <Formik
        initialValues={{
          orderId: row.original.id,
          paymentStatusId: row.original.paymentStatusId,
          shippingMethodId: row.original.shippingMethodId,
          orderStatusId: row.original.orderStatusId,
          shippingStatusId: row.original.shippingStatusId,
          paymentMethodId: row.original.paymentMethodId ?? null
        } as OrderChangeStatusModel}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          paymentStatusId: Yup.number().nullable().required(t('validation.requiredField')),
          orderStatusId: Yup.number().nullable().required(t('validation.requiredField'))
        })}
        onSubmit={(values, { setErrors, setStatus, setSubmitting, resetForm }) => {
          try {
            handleSubmit(values as OrderChangeStatusModel, resetForm, setErrors);
          } catch (err) {
            console.error(err);
            setStatus({ success: false });

            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
              <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
                <Grid size={12}>
                  <MainCard>
                    <Grid container spacing={3} >
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="paymentStatusId">{t(fieldsName + 'paymentStatusId')}</InputLabel>
                            <SelectPaymentStatus
                              label={t(fieldsName + 'paymentStatusId')}
                              defaultValue={row.original.paymentStatusId ?? undefined}
                              id="paymentStatusId"
                              setFieldValue={setFieldValue}
                              error={Boolean(touched.paymentStatusId && errors.paymentStatusId)}
                            />
                            {touched.paymentStatusId && errors.paymentStatusId && (
                              <FormHelperText error id="helper-text-email">
                                {errors.paymentStatusId}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="shippingStatusId">{t(fieldsName + 'shippingStatusId')}</InputLabel>
                            <SelectShippingStatus
                              label={t(fieldsName + 'shippingStatusId')}
                              defaultValue={row.original.shippingStatusId ?? undefined}
                              id="shippingStatusId"
                              setFieldValue={setFieldValue}
                              error={Boolean(touched.shippingStatusId && errors.shippingStatusId)}
                            />
                            {touched.shippingStatusId && errors.shippingStatusId && (
                              <FormHelperText error id="helper-text-email">
                                {errors.shippingStatusId}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="orderStatusId">{t(fieldsName + 'orderStatusId')}</InputLabel>
                            <SelectOrderStatus
                              defaultValue={row.original.orderStatusId ?? undefined}
                              id="orderStatusId"
                              setFieldValue={setFieldValue}
                              label={t(fieldsName + 'orderStatusId')}
                              error={Boolean(touched.orderStatusId && errors.orderStatusId)}
                            />
                            {touched.orderStatusId && errors.orderStatusId && (
                              <FormHelperText error id="helper-text-email">
                                {errors.orderStatusId}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="shippingMethodId">{t(fieldsName + 'shippingMethodId')}</InputLabel>
                            <SelectShippingMethod
                              label={t(fieldsName + 'shippingMethodId')}
                              defaultValue={row.original.shippingMethodId ?? undefined}
                              id="shippingMethodId"
                              setFieldValue={setFieldValue}
                              error={Boolean(touched.shippingMethodId && errors.shippingMethodId)}
                            />
                            {touched.shippingMethodId && errors.shippingMethodId && (
                              <FormHelperText error id="helper-text-email">
                                {errors.shippingMethodId}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                            <Stack spacing={1}>
                              <TextField
                                id="transactionTrackingCode"
                                label={t(fieldsName + 'transactionTrackingCode')}
                                defaultValue={row.original.transactionTrackingCode}
                                disabled
                              />
                            </Stack>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                            <Stack spacing={1}>
                              <TextField
                                id="paymentTrackingCode"
                                label={t(fieldsName + 'paymentTrackingCode')}
                                defaultValue={row.original.paymentTrackingCode}
                                disabled
                              />
                            </Stack>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                            <Stack spacing={1}>
                              <TextField
                                id="trackingNumber"
                                label={t(fieldsName + 'trackingNumber')}
                                defaultValue={row.original.trackingNumber}
                                disabled
                              />
                            </Stack>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                     <Grid container direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <Grid size={12}>
                          <Stack direction="row" spacing={2}>
                            <AnimateButton>
                              <Button
                                disabled={isSubmitting}
                                variant="contained"
                                color="warning"
                                type="submit"
                                startIcon={<Save />}
                              >
                                {t(buttonName + 'save')}
                              </Button>
                            </AnimateButton>
                          </Stack>
                        </Grid>
                      </Grid>
                    </MainCard>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
    </>
  );
}
