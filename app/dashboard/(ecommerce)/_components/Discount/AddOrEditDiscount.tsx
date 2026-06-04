import { useEffect, useState } from 'react';

// material-ui
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSession } from 'next-auth/react';

import AnimateButton from '@dashboard/_components/@extended/AnimateButton';

// assets
import { useTranslations } from 'next-intl';
import Notify from '@dashboard/_components/@extended/Notify';
import setServerErrors from '@root/utils/setServerErrors';
import AddIcon from '@mui/icons-material/Add';
import DiscountService from '../../_service/DiscountService';
import DiscountModel from '../../_types/Common/DiscountModel';
import SelectDiscountLimitationType from './SelectDiscountLimitationType';
import SelectDiscountType from './SelectDiscountType';

const AddOrEditDiscount = ({ discountId, isNew, open, setOpen, refetch }: { discountId: number, isNew: boolean, open: boolean, setOpen: (open: boolean) => void, refetch: () => void }) => {
  const t = useTranslations('');
  const [fieldsName, buttonName] = ['fields.discount.', 'buttons.discount.'];
  const dialogName = t('pages.discount');
  const [discount, setDiscount] = useState<DiscountModel | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let discountService = new DiscountService(jwt ?? '');

  const loadDiscount = () => {
    discountService.getDiscountById(discountId).then((result) => {
      setDiscount(result.data);
    });
  };

  useEffect(() => {
    if (isNew == false && discountId > 0) {
      loadDiscount();
    } else {
      setDiscount(undefined);
    }
  }, [discountId, isNew, open]);

  const onClose = () => {
    setOpen(false);
    setDiscount(undefined);
  };

  const handleSubmit = (discount: DiscountModel, setErrors: (errors: any) => void) => {
    if (isNew == true) {
      discountService
        .addDiscount(discount)
        .then(() => {
          onClose();
          setDiscount(undefined);
          setNotify({ open: true });
          refetch();
        })
        .catch((error) => {
          setNotify({ open: true, type: 'error', description: error });
          setErrors(setServerErrors(error));
        });
    } else {
      discountService
        .updateDiscount(discount)
        .then(() => {
          onClose();
          setDiscount(undefined);
          setNotify({ open: true });
          refetch();
        })
        .catch((error) => {
          setErrors(setServerErrors(error));
          setNotify({ open: true, type: 'error', description: error });
        });
    }
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
            id: discount?.id,
            name: discount?.name,
            couponCode: discount?.couponCode,
            adminComment: discount?.adminComment,
            discountTypeId: discount?.discountTypeId,
            usePercentage: discount?.usePercentage ?? false,
            discountPercentage: discount?.discountPercentage,
            discountAmount: discount?.discountAmount,
            maximumDiscountAmount: discount?.maximumDiscountAmount,
            startDateUtc: discount?.startDateUtc,
            endDateUtc: discount?.endDateUtc,
            requiresCouponCode: discount?.requiresCouponCode ?? false,
            discountLimitationId: discount?.discountLimitationId,
            limitationTimes: discount?.limitationTimes,
            maximumDiscountedQuantity: discount?.maximumDiscountedQuantity,
            isActive: discount?.isActive ?? true
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(70).required('Name is required'),
            couponCode: Yup.string().max(100),
            adminComment: Yup.string().max(300),
            discountPercentage: Yup.number().required('DiscountPercentage is required'),
            discountAmount: Yup.number().required('DiscountAmount is required'),
            maximumDiscountAmount: Yup.number().nullable(),
            limitationTimes: Yup.number().required('LimitationTimes is required'),
            maximumDiscountedQuantity: Yup.number().nullable()
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              handleSubmit(values as DiscountModel, setErrors);
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogTitle>
                {t('dialog.' + (isNew == true ? 'add' : 'edit') + '.title', { item: dialogName })}
                <CloseDialog onClose={onClose} />
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name">{t(fieldsName + 'name')}</InputLabel>
                      <OutlinedInput
                        id="name"
                        type="text"
                        value={values?.name || ''}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'name')}
                        fullWidth
                        error={Boolean(touched.name && errors.name)}
                      />
                      {touched.name && errors.name && (
                        <FormHelperText error id="helper-text-name">
                          {errors.name}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="couponCode">{t(fieldsName + 'couponCode')}</InputLabel>
                      <OutlinedInput
                        id="couponCode"
                        type="text"
                        value={values?.couponCode || ''}
                        name="couponCode"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'couponCode')}
                        fullWidth
                        error={Boolean(touched.couponCode && errors.couponCode)}
                      />
                      {touched.couponCode && errors.couponCode && (
                        <FormHelperText error id="helper-text-couponCode">
                          {errors.couponCode}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="adminComment">{t(fieldsName + 'adminComment')}</InputLabel>
                      <OutlinedInput
                        id="adminComment"
                        type="text"
                        value={values?.adminComment || ''}
                        name="adminComment"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'adminComment')}
                        fullWidth
                        error={Boolean(touched.adminComment && errors.adminComment)}
                      />
                      {touched.adminComment && errors.adminComment && (
                        <FormHelperText error id="helper-text-adminComment">
                          {errors.adminComment}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={12}>
                    <SelectDiscountType
                      defaultValue={values?.discountTypeId}
                      id="discountTypeId"
                      setFieldValue={setFieldValue}
                      error={Boolean(touched.discountTypeId && errors.discountTypeId)}
                      label={t(fieldsName + 'discountTypeId')}
                    />
                  </Grid>

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="discountPercentage">{t(fieldsName + 'discountPercentage')}</InputLabel>
                      <OutlinedInput
                        id="discountPercentage"
                        type="number"
                        value={values?.discountPercentage || ''}
                        name="discountPercentage"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'discountPercentage')}
                        fullWidth
                        error={Boolean(touched.discountPercentage && errors.discountPercentage)}
                      />
                      {touched.discountPercentage && errors.discountPercentage && (
                        <FormHelperText error id="helper-text-discountPercentage">
                          {errors.discountPercentage}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="discountAmount">{t(fieldsName + 'discountAmount')}</InputLabel>
                      <OutlinedInput
                        id="discountAmount"
                        type="number"
                        value={values?.discountAmount || ''}
                        name="discountAmount"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'discountAmount')}
                        fullWidth
                        error={Boolean(touched.discountAmount && errors.discountAmount)}
                      />
                      {touched.discountAmount && errors.discountAmount && (
                        <FormHelperText error id="helper-text-discountAmount">
                          {errors.discountAmount}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="maximumDiscountAmount">{t(fieldsName + 'maximumDiscountAmount')}</InputLabel>
                      <OutlinedInput
                        id="maximumDiscountAmount"
                        type="number"
                        value={values?.maximumDiscountAmount || ''}
                        name="maximumDiscountAmount"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'maximumDiscountAmount')}
                        fullWidth
                        error={Boolean(touched.maximumDiscountAmount && errors.maximumDiscountAmount)}
                      />
                      {touched.maximumDiscountAmount && errors.maximumDiscountAmount && (
                        <FormHelperText error id="helper-text-maximumDiscountAmount">
                          {errors.maximumDiscountAmount}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={12}>
                    <SelectDiscountLimitationType
                      defaultValue={values?.discountLimitationId}
                      id="discountLimitationId"
                      setFieldValue={setFieldValue}
                      error={Boolean(touched.discountLimitationId && errors.discountLimitationId)}
                      label={t(fieldsName + 'discountLimitationId')}
                    />
                  </Grid>

                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="limitationTimes">{t(fieldsName + 'limitationTimes')}</InputLabel>
                      <OutlinedInput
                        id="limitationTimes"
                        type="number"
                        value={values?.limitationTimes || ''}
                        name="limitationTimes"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'limitationTimes')}
                        fullWidth
                        error={Boolean(touched.limitationTimes && errors.limitationTimes)}
                      />
                      {touched.limitationTimes && errors.limitationTimes && (
                        <FormHelperText error id="helper-text-limitationTimes">
                          {errors.limitationTimes}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={12}>
                    <FormControlLabel
                      control={<Checkbox checked={values?.usePercentage || false} name="usePercentage" onChange={handleChange} />}
                      label={t(fieldsName + 'usePercentage')}
                    />
                  </Grid>

                  <Grid size={12}>
                    <FormControlLabel
                      control={<Checkbox checked={values?.requiresCouponCode || false} name="requiresCouponCode" onChange={handleChange} />}
                      label={t(fieldsName + 'requiresCouponCode')}
                    />
                  </Grid>

                  <Grid size={12}>
                    <FormControlLabel
                      control={<Checkbox checked={values?.isActive || false} name="isActive" onChange={handleChange} />}
                      label={t(fieldsName + 'isActive')}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: '1.25rem' }}>
                <AnimateButton>
                  <Button onClick={onClose}>{t('buttons.cancel')}</Button>
                </AnimateButton>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                  >
                    {t(buttonName + (isNew == true ? 'add' : 'edit'))}
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

export default AddOrEditDiscount;
