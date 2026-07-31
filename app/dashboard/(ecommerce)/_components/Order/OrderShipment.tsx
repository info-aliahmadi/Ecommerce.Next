'use client';
import { useEffect, useState } from 'react';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { Button, FormHelperText, Grid, InputLabel, Stack, TextField } from '@mui/material';

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AnimateButton from '@dashboard/_components/@extended/AnimateButton';
import Notify from '@dashboard/_components/@extended/Notify';
import setServerErrors from '@root/utils/setServerErrors';
import DateTimeInput from '@dashboard/_components/DateTime/DateTimeInput';
import ShipmentService from '../../_service/ShipmentService';
import ShipmentModel from '../../_types/Order/ShipmentModel';

const toDate = (val: unknown): Date => {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  const m = val as any;
  if (typeof m.toDate === 'function') return m.toDate();
  return new Date();
};

export default function OrderShipment({ orderId, shipmentId, refetch }: Readonly<{ orderId: number; shipmentId: number | null; refetch: () => void }>) {
  const t = useTranslations('');
  const [fieldsName] = ['fields.order.', 'validation.order.', 'buttons.order.'];
  const [shipment, setShipment] = useState<ShipmentModel | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const shipmentService = new ShipmentService(jwt ?? '');

  useEffect(() => {
    if (shipmentId && shipmentId > 0) {
      shipmentService.getShipmentById(shipmentId).then((result) => {
        setShipment(result.data);
      });
    } else {
      setShipment(undefined);
    }
  }, [shipmentId]);

  const handleSubmit = (values: ShipmentModel, setErrors: (errors: any) => void) => {
    const submit = shipment?.id && shipment.id > 0 ? shipmentService.updateShipment : shipmentService.addShipment;

    const payload: ShipmentModel = {
      ...values,
      shippedDateUtc: toDate(values.shippedDateUtc),
      deliveryDateUtc: toDate(values.deliveryDateUtc),
      readyForPickupDateUtc: toDate(values.readyForPickupDateUtc),
    };

    submit(payload)
      .then(() => {
        setNotify({ open: true });
        refetch();
        if (shipmentId && shipmentId > 0) {
          shipmentService.getShipmentById(shipmentId).then((result) => {
            setShipment(result.data);
          });
        } else {
          setShipment(undefined);
        }
      })
      .catch((error) => {
        setErrors(setServerErrors(error));
        setNotify({ open: true, type: 'error', description: error });
      });
  };

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={12}>
          {/* <MainCard title={t(fieldsName + 'trackingNumber')}> */}
          <Formik
            initialValues={{
              id: shipment?.id ?? 0,
              orderId,
              trackingNumber: shipment?.trackingNumber ?? '',
              totalWeight: shipment?.totalWeight ?? 0,
              readyForPickupDateUtc: shipment?.readyForPickupDateUtc ? new Date(shipment.readyForPickupDateUtc) : null,
              shippedDateUtc: shipment?.shippedDateUtc ? new Date(shipment.shippedDateUtc) : null,
              deliveryDateUtc: shipment?.deliveryDateUtc ? new Date(shipment.deliveryDateUtc) : null
            } as ShipmentModel}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              trackingNumber: Yup.string().max(20).required(t('validation.requiredField')),
              totalWeight: Yup.number().max(10000).nullable(),
              shippedDateUtc: Yup.date().nullable().required(t('validation.requiredField')),
              deliveryDateUtc: Yup.date().nullable().required(t('validation.requiredField')),
              readyForPickupDateUtc: Yup.date().nullable().required(t('validation.requiredField')),
              adminComment: Yup.string().nullable()
            })}
            onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
              try {
                handleSubmit(values, setErrors);
              } catch (err) {
                console.error(err);
                setStatus({ success: false });
                setSubmitting(false);
              }
            }}
          >
            {({ errors, handleBlur, setFieldValue, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="trackingNumber">{t(fieldsName + 'trackingNumber')}</InputLabel>
                      <TextField
                        id="trackingNumber"
                        name="trackingNumber"
                        value={values.trackingNumber}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(touched.trackingNumber && errors.trackingNumber)}
                      />
                      {touched.trackingNumber && errors.trackingNumber && <FormHelperText error>{errors.trackingNumber}</FormHelperText>}
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="totalWeight">{t(fieldsName + 'totalWeight')}</InputLabel>
                      <TextField
                        id="totalWeight"
                        name="totalWeight"
                        type="number"
                        // label={t(fieldsName + 'totalWeight')}
                        value={values.totalWeight}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(touched.totalWeight && errors.totalWeight)}
                      />
                      {touched.totalWeight && errors.totalWeight && <FormHelperText error>{errors.totalWeight}</FormHelperText>}
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="readyForPickupDateUtc">{t(fieldsName + 'readyForPickupDateUtc')}</InputLabel>
                      <DateTimeInput
                        name="readyForPickupDateUtc"
                        // label={t(fieldsName + 'readyForPickupDateUtc')}
                        setFieldValue={setFieldValue}
                        defaultValue={values.readyForPickupDateUtc || undefined}
                        error={Boolean(touched.readyForPickupDateUtc && errors.readyForPickupDateUtc)}
                        showTime={false}
                      />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="shippedDateUtc">{t(fieldsName + 'shippedDateUtc')}</InputLabel>
                      <DateTimeInput
                        name="shippedDateUtc"
                        // label={t(fieldsName + 'shippedDateUtc')}
                        setFieldValue={setFieldValue}
                        defaultValue={values.shippedDateUtc || undefined}
                        error={Boolean(touched.shippedDateUtc && errors.shippedDateUtc)}
                        showTime={false}
                      />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="deliveryDateUtc">{t(fieldsName + 'deliveryDateUtc')}</InputLabel>
                      <DateTimeInput
                        name="deliveryDateUtc"
                        // label={t(fieldsName + 'deliveryDateUtc')}
                        setFieldValue={setFieldValue}
                        defaultValue={values.deliveryDateUtc || undefined}
                        error={Boolean(touched.deliveryDateUtc && errors.deliveryDateUtc)}
                        showTime={false}
                      />
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="adminComment">{t(fieldsName + 'adminComment')}</InputLabel>
                      <TextField
                        id="adminComment"
                        name="adminComment"
                        value={values.adminComment}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                      />
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <Stack direction="row" spacing={2}>
                      <AnimateButton>
                        <Button
                          disabled={isSubmitting}
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          {t('buttons.save')}
                        </Button>
                      </AnimateButton>
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
          {/* </MainCard> */}
        </Grid>
      </Grid>
    </>
  );
}
