'use client';
import { useEffect, useState } from 'react';

// material-ui
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSession } from 'next-auth/react';

// project import
import AnimateButton from '@dashboard/_components/@extended/AnimateButton';
import Notify from '@dashboard/_components/@extended/Notify';
import setServerErrors from '@root/utils/setServerErrors';
import { useTranslations } from 'next-intl';
import ShipmentService from '../../_service/ShipmentService';
import ShipmentModel from '../../_types/Order/ShipmentModel';

const ShipmentDialog = ({
  orderId,
  shipmentId,
  open,
  setOpen,
  refetch
}: {
  orderId: number;
  shipmentId: number | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}) => {
  const t = useTranslations('');
  const [fieldsName] = ['fields.order.', 'validation.order.', 'buttons.order.'];
  const [shipment, setShipment] = useState<ShipmentModel | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const shipmentService = new ShipmentService(jwt ?? '');

  const loadShipment = () => {
    if (shipmentId && shipmentId > 0) {
      shipmentService.getShipmentById(shipmentId).then((result) => {
        setShipment(result.data);
      });
    } else {
      setShipment(undefined);
    }
  };

  useEffect(() => {
    if (!shipmentId || shipmentId <= 0) {
      setShipment(undefined);
    } else {
      loadShipment();
    }
  }, [shipmentId, open]);

  const onClose = () => {
    setOpen(false);
    setShipment(undefined);
  };

  const handleSubmit = (values: ShipmentModel, setErrors: (errors: any) => void) => {
    const submit = shipment?.id && shipment.id > 0 ? shipmentService.updateShipment : shipmentService.addShipment;

    submit(values)
      .then(() => {
        onClose();
        setNotify({ open: true });
        refetch();
      })
      .catch((error) => {
        setErrors(setServerErrors(error));
        setNotify({ open: true, type: 'error', description: error });
      });
  };

  const CloseDialog = ({ onClose }: { onClose: () => void }) => (
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: (theme) => theme.palette.grey[500]
      }}
    >
      <CloseIcon />
    </IconButton>
  );

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <Dialog open={open} fullWidth>
        <Formik
          initialValues={{
            id: shipment?.id ?? 0,
            orderId,
            trackingNumber: shipment?.trackingNumber ?? '',
            shippingAddressSnapshot: shipment?.shippingAddressSnapshot ?? '',
            totalWeight: shipment?.totalWeight ?? 0,
            shippedDateUtc: shipment?.shippedDateUtc ? new Date(shipment.shippedDateUtc) : new Date(),
            deliveryDateUtc: shipment?.deliveryDateUtc ? new Date(shipment.deliveryDateUtc) : new Date(),
            readyForPickupDateUtc: shipment?.readyForPickupDateUtc ? new Date(shipment.readyForPickupDateUtc) : new Date(),
            recipientName: shipment?.recipientName ?? '',
            phoneNumber: shipment?.phoneNumber ?? '',
            email: shipment?.email ?? '',
            adminComment: shipment?.adminComment ?? '',
            createdOnUtc: shipment?.createdOnUtc ? new Date(shipment.createdOnUtc) : new Date()
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            trackingNumber: Yup.string().required(t('validation.requiredField')),
            recipientName: Yup.string().required(t('validation.requiredField')),
            phoneNumber: Yup.string().required(t('validation.requiredField'))
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
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
              <DialogTitle>
                {t('dialog.' + (shipmentId && shipmentId > 0 ? 'edit' : 'add') + '.title', { item: t('fields.order.trackingNumber') })}
                <CloseDialog onClose={onClose} />
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="trackingNumber">{t(fieldsName + 'trackingNumber')}</InputLabel>
                      <OutlinedInput
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
                      <InputLabel htmlFor="recipientName">{t(fieldsName + 'recipientName')}</InputLabel>
                      <OutlinedInput
                        id="recipientName"
                        name="recipientName"
                        value={values.recipientName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(touched.recipientName && errors.recipientName)}
                      />
                      {touched.recipientName && errors.recipientName && <FormHelperText error>{errors.recipientName}</FormHelperText>}
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="phoneNumber">{t(fieldsName + 'phoneNumber')}</InputLabel>
                      <OutlinedInput
                        id="phoneNumber"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                      />
                      {touched.phoneNumber && errors.phoneNumber && <FormHelperText error>{errors.phoneNumber}</FormHelperText>}
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email">{t(fieldsName + 'email')}</InputLabel>
                      <OutlinedInput
                        id="email"
                        name="email"
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="totalWeight">{t(fieldsName + 'totalWeight')}</InputLabel>
                      <OutlinedInput
                        id="totalWeight"
                        name="totalWeight"
                        type="number"
                        value={values.totalWeight}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="shippingAddressSnapshot">{t(fieldsName + 'shippingAddressSnapshot')}</InputLabel>
                      <OutlinedInput
                        id="shippingAddressSnapshot"
                        name="shippingAddressSnapshot"
                        value={values.shippingAddressSnapshot}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="adminComment">{t(fieldsName + 'adminComment')}</InputLabel>
                      <OutlinedInput
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
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: '1.25rem' }}>
                <AnimateButton>
                  <Button onClick={onClose}>
                    {t('buttons.cancel')}
                  </Button>
                </AnimateButton>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {t('buttons.save')}
                  </Button>
                </AnimateButton>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default ShipmentDialog;
