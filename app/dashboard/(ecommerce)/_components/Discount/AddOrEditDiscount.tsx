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
import { DiscountType } from '@root/app/types/enums/DiscountType';

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
import SelectProduct from '@dashboard/(ecommerce)/_components/Product/SelectProduct';
import SelectCategory from '@dashboard/(ecommerce)/_components/Category/SelectCategory';
import SelectManufacturer from '@dashboard/(ecommerce)/_components/Manufacturer/SelectManufacturer';
import { DiscountLimitationType } from '@root/app/types/enums/DiscountLimitationType';
import CurrencyInput from '@root/app/dashboard/_components/Currency/CurrencyInput';
import CONFIG from '@root/config';
import DateTimeInput from '@root/app/dashboard/_components/DateTime/DateTimeInput';

const AddOrEditDiscount = ({ discountId, isNew, open, setOpen, refetch }: { discountId: number, isNew: boolean, open: boolean, setOpen: (open: boolean) => void, refetch: () => void }) => {
  const t = useTranslations('');
  const [validation, fieldsName, buttonName] = ['validation.discount.', 'fields.discount.', 'buttons.discount.'];
  const dialogName = t('pages.discount');
  const [discount, setDiscount] = useState<DiscountModel | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let discountService = new DiscountService(jwt ?? '');

  const loadDiscount = () => {
    discountService.getDiscountById(discountId).then((result) => {
      if (!result.succeeded) {
        setNotify({ open: true, type: 'error', title: result.message, description: result.errors.map(x => x.description).join('\n') });
        return;
      }
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

  const handleSubmit = async (discount: DiscountModel, setErrors: (errors: any) => void) => {
    try {
      const schema = getValidationSchema(discount);
      await schema.validate(discount, { abortEarly: false });
    } catch (err) {
      if (err && typeof err === 'object' && 'inner' in err) {
        const validationErrors: Record<string, string> = {};
        (err as any).inner.forEach((error: { path?: string; message: string }) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });
        setErrors(validationErrors);
      }
      return;
    }

    if (isNew == true) {
      discountService
        .addDiscount(discount)
        .then((result) => {
          if (!result.succeeded) {
            setNotify({ open: true, type: 'error', title: result.message, description: result.errors.map(x => x.description).join('\n') });
            return;
          }
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
        .then((result) => {
          if (!result.succeeded) {
            setNotify({ open: true, type: 'error', title: result.message, description: result.errors.map(x => x.description).join('\n') });
            return;
          }
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

  const getValidationSchema = (discount: DiscountModel) => {
    const baseSchema: any = {}
    if (discount.discountLimitationId === DiscountLimitationType.NTimesOnly || discount.discountLimitationId === DiscountLimitationType.NTimesPerCustomer) {
      baseSchema.limitationTimes = Yup.number().required(t(validation + 'requiredLimitationTimes'));
    }

    if (discount.usePercentage) {
      baseSchema.discountPercentage = Yup.number().required(t(validation + 'requiredDiscountPercentage'));
    } else {
      baseSchema.discountAmount = Yup.number().required(t(validation + 'requiredDiscountAmount'));
    }

    if (discount.discountTypeId === DiscountType.AssignedToOrderTotal) {
      baseSchema.orderTotal = Yup.number().required(t(validation + 'requiredOrderTotal'));
    }

    if (discount.discountTypeId === DiscountType.AssignedToProducts) {
      baseSchema.productIds = Yup.array().min(1, t(validation + 'requiredProducts'));
    }

    if (discount.discountTypeId === DiscountType.AssignedToCategories) {
      baseSchema.categoryIds = Yup.array().min(1, t(validation + 'requiredCategories'));
    }

    if (discount.discountTypeId === DiscountType.AssignedToManufacturers) {
      baseSchema.manufacturerIds = Yup.array().min(1, t(validation + 'requiredManufacturers'));
    }

    return Yup.object().shape(baseSchema);
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
      <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
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
            requiresCouponCode: discount?.requiresCouponCode ?? true,
            discountLimitationId: discount?.discountLimitationId,
            limitationTimes: discount?.limitationTimes,
            maximumDiscountedQuantity: discount?.maximumDiscountedQuantity,
            isActive: discount?.isActive ?? true,
            orderTotal: discount?.orderTotal,
            productIds: discount?.productIds || [],
            categoryIds: discount?.categoryIds || [],
            manufacturerIds: discount?.manufacturerIds || []
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(70).required(t(validation + 'requiredName')),
            couponCode: Yup.string().max(100, t(validation + 'maxLengthCouponCode')).required(t(validation + 'requiredCouponCode')),
            adminComment: Yup.string().nullable().max(300, t(validation + 'maxLengthAdminComment')),
            maximumDiscountAmount: Yup.number().nullable(),
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
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => {
            return (
              <form noValidate onSubmit={handleSubmit}>
                <DialogTitle>
                  {t('dialog.' + (isNew ? 'add' : 'edit') + '.title', { item: dialogName })}
                  <CloseDialog onClose={onClose} />
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={3}>
                    <Grid size={6} columns={2}>
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

                    <Grid size={6} container>
                      <Grid size={7}>
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
                      <Grid size={5}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="couponCode"> {t(fieldsName + 'requiresCouponCode')}</InputLabel>
                          <FormControlLabel
                            control={<Checkbox checked={values?.requiresCouponCode || false} name="requiresCouponCode" onChange={handleChange} />}
                            label={t(fieldsName + 'requiresCouponCode')}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                    <Grid size={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="discountTypeId">{t(fieldsName + 'discountTypeId')}</InputLabel>
                        <SelectDiscountType
                          defaultValue={values?.discountTypeId}
                          id="discountTypeId"
                          setFieldValue={setFieldValue}
                          error={Boolean(touched.discountTypeId && errors.discountTypeId)}
                        />
                      </Stack>
                    </Grid>
                    {values.discountTypeId === DiscountType.AssignedToOrderTotal && <Grid size={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="orderTotal">{t(fieldsName + 'orderTotal')}</InputLabel>
                        <CurrencyInput
                          id={"orderTotal"}
                          name={"orderTotal"}
                          value={values?.orderTotal || 0}
                          // label={t(fieldsName + 'orderTotal')}
                          fullWidth
                          currencyType={CONFIG.DEFAULT_CURRENCY}
                          onBlur={handleBlur}
                          onChange={(value: number) => setFieldValue('orderTotal', value)}
                          error={Boolean(touched.orderTotal && errors.orderTotal)}
                        />
                        {touched.orderTotal && errors.orderTotal && (
                          <FormHelperText error id="helper-text-orderTotal">
                            {errors.orderTotal}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    }

                    {values.discountTypeId === DiscountType.AssignedToProducts &&
                      <Grid size={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="products">{t(fieldsName + 'products')}</InputLabel>
                          <SelectProduct
                            id="productIds"
                            name="productIds"
                            defaultValues={values?.productIds || []}
                            setFieldValue={setFieldValue}
                            error={Boolean(touched.productIds && errors.productIds)}
                          />
                          {touched.productIds && errors.productIds && (
                            <FormHelperText error id="helper-text-productIds">
                              {errors.productIds}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                    }

                    {values.discountTypeId === DiscountType.AssignedToCategories &&
                      <Grid size={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="categories">{t(fieldsName + 'categories')}</InputLabel>
                          <SelectCategory
                            id="categoryIds"
                            name="categoryIds"
                            defaultValues={values?.categoryIds || []}
                            setFieldValue={setFieldValue}
                            error={Boolean(touched.categoryIds && errors.categoryIds)}
                          />
                          {touched.categoryIds && errors.categoryIds && (
                            <FormHelperText error id="helper-text-categoryIds">
                              {errors.categoryIds}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                    }

                    {values.discountTypeId === DiscountType.AssignedToManufacturers &&
                      <Grid size={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="manufacturers">{t(fieldsName + 'manufacturers')}</InputLabel>
                          <SelectManufacturer
                            id="manufacturerIds"
                            name="manufacturerIds"
                            defaultValues={values?.manufacturerIds || []}
                            setFieldValue={setFieldValue}
                            error={Boolean(touched.manufacturerIds && errors.manufacturerIds)}
                          />
                          {touched.manufacturerIds && errors.manufacturerIds && (
                            <FormHelperText error id="helper-text-manufacturerIds">
                              {errors.manufacturerIds}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                    }


                    <Grid size={12} container >
                      <Grid size={4}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="usePercentage">{t(fieldsName + 'usePercentage')}</InputLabel>
                          <FormControlLabel
                            control={<Checkbox checked={values?.usePercentage || false} name="usePercentage" onChange={handleChange} />}
                            label={t(fieldsName + 'usePercentage')}
                          />
                        </Stack>
                      </Grid>

                      {values?.usePercentage && <Grid size={4}>
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
                      }
                      {!values?.usePercentage &&
                        <Grid size={4}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="discountAmount">{t(fieldsName + 'discountAmount')}</InputLabel>
                            <CurrencyInput
                              currencyType={CONFIG.DEFAULT_CURRENCY}
                              id="discountAmount"
                              value={values?.discountAmount || ''}
                              name="discountAmount"
                              placeholder={t(fieldsName + 'discountAmount')}
                              fullWidth
                              error={Boolean(touched.discountAmount && errors.discountAmount)}
                              onBlur={handleBlur}
                              onChange={(value: number) => setFieldValue('discountAmount', value)}
                            />
                            {touched.discountAmount && errors.discountAmount && (
                              <FormHelperText error id="helper-text-discountAmount">
                                {errors.discountAmount}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                      }

                      <Grid size={4}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="maximumDiscountAmount">{t(fieldsName + 'maximumDiscountAmount')}</InputLabel>
                          <CurrencyInput
                            currencyType={CONFIG.DEFAULT_CURRENCY}
                            id="maximumDiscountAmount"
                            value={values?.maximumDiscountAmount || ''}
                            name="maximumDiscountAmount"
                            placeholder={t(fieldsName + 'maximumDiscountAmount')}
                            fullWidth
                            error={Boolean(touched.maximumDiscountAmount && errors.maximumDiscountAmount)}
                            onBlur={handleBlur}
                            onChange={(value: number) => setFieldValue('maximumDiscountAmount', value)}
                          />
                          {touched.maximumDiscountAmount && errors.maximumDiscountAmount && (
                            <FormHelperText error id="helper-text-maximumDiscountAmount">
                              {errors.maximumDiscountAmount}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                    <Grid size={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="discountLimitationId">{t(fieldsName + 'discountLimitationId')}</InputLabel>
                        <SelectDiscountLimitationType
                          defaultValue={values?.discountLimitationId}
                          id="discountLimitationId"
                          setFieldValue={setFieldValue}
                          error={Boolean(touched.discountLimitationId && errors.discountLimitationId)}
                        />
                      </Stack>
                    </Grid>

                    {(values?.discountLimitationId == DiscountLimitationType.NTimesOnly || values?.discountLimitationId == DiscountLimitationType.NTimesPerCustomer) &&
                      <Grid size={4}>
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
                    }
                    <Grid size={12} container>
                      <Grid size={6}>
                        <Stack>
                          <DateTimeInput
                            name="startDateUtc"
                            label={t(fieldsName + 'startDateUtc')}
                            setFieldValue={setFieldValue}
                            defaultValue={values?.startDateUtc || undefined}
                            error={Boolean(errors.startDateUtc)}
                          />
                          {errors.startDateUtc && (
                            <FormHelperText error>
                              {errors.startDateUtc}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid size={6}>
                        <Stack>
                          <DateTimeInput
                            name="endDateUtc"
                            label={t(fieldsName + 'endDateUtc')}
                            setFieldValue={setFieldValue}
                            defaultValue={values?.endDateUtc || undefined}
                            error={Boolean(errors.endDateUtc)}
                          />
                          {errors.endDateUtc && (
                            <FormHelperText error>
                              {errors.endDateUtc}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
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
                          multiline
                          rows={3}
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
            );
          }}
        </Formik>
      </Dialog >
    </>
  );
};

export default AddOrEditDiscount;
