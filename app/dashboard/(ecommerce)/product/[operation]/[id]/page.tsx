'use client';
import React from 'react';
import { useEffect, useState } from 'react';

// material-ui
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  FormHelperText,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { ArrowBack, Save, Send } from '@mui/icons-material';
// third party
import * as Yup from 'yup';
import { Formik, FormikErrors } from 'formik';

import AnimateButton from '@dashboard/_components/@extended/AnimateButton';

// assets
import { useTranslation } from 'react-i18next';
import Notify from '@dashboard/_components/@extended/Notify';
import MainCard from '@dashboard/_components/MainCard';
import setServerErrors from '@root/utils/setServerErrors';

import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import ProductsService from '@dashboard/(ecommerce)/_service/ProductService';
import StoreIcon from '@mui/icons-material/Store';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import InventoryIcon from '@mui/icons-material/Inventory';
import ProductBaseInfo from '@dashboard/(ecommerce)/_components/Product/ProductBaseInfo';
import ProductSettings from '@dashboard/(ecommerce)/_components/Product/ProductSettings';
import ProductInventory from '@dashboard/(ecommerce)/_components/Product/ProductInventory';
import ProductSEO from '@dashboard/(ecommerce)/_components/Product/ProductSEO';
import { useSession } from 'next-auth/react';

import ProductModel from '@dashboard/(ecommerce)/_types/Product/ProductModel';
function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 4, pb: 4 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

export default function AddOrEditProduct({ params }: { params: Promise<{ operation: 'edit' | 'add'; id: number }> }) {
  const [t, i18n] = useTranslation();
  const [tab, setTab] = useState(0);

  const { id, operation } = React.use(params);

  const { data: session } = useSession();

  const jwt = session?.accessToken;
  let productService = new ProductsService(jwt ?? '');

  const [fieldsName, validation, buttonName] = ['fields.product.', 'validation.product.', 'buttons.product.'];
  const [product, setProduct] = useState<ProductModel>();
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const router = useRouter();

  const loadProduct = () => {
    productService.getProductById(id).then((result) => {
      setProduct(result.data);
    });
  };
  useEffect(() => {
    if (operation == 'edit' && id > 0) loadProduct();
  }, [operation, id]);

  const handleTabChange = (event: any, newValue: any) => {
    setTab(newValue);
  };
  const handleSubmit = async (product: ProductModel, resetForm: any, setErrors: (errors: FormikErrors<ProductModel>) => void, setSubmitting: (open: boolean) => void) => {
    if (operation == 'add') {
      productService
        .addProduct(product)
        .then(() => {
          resetForm(undefined);
          setProduct(undefined);
          setNotify({ open: true });
        })
        .catch((error) => {
          setErrors(setServerErrors(error));
          setNotify({ open: true, type: 'error', description: error });
        });
    } else {
      productService
        .updateProduct(product)
        .then((result) => {
          setProduct(result.data);
          setNotify({ open: true });
        })
        .catch((error) => {
          setErrors(setServerErrors(error));
          setNotify({ open: true, type: 'error', description: error });
        });
    }
  };
  const initialValues : ProductModel = {
    id: product?.id ?? 0,
    name: product?.name ?? '',
    metaTitle: product?.metaTitle ?? '',
    metaKeywords: product?.metaKeywords ?? '',
    metaDescription: product?.metaDescription ?? '',
    shortDescription: product?.shortDescription ?? '',
    fullDescription: product?.fullDescription ?? '',
    adminComment: product?.adminComment ?? '',
    deliveryDateId: product?.deliveryDateId ?? 0,
    taxCategoryId: product?.taxCategoryId ?? 0,
    stockQuantity: product?.stockQuantity ?? 0,
    minStockQuantity: product?.minStockQuantity ?? 0,
    notifyAdminForQuantityBelow: product?.notifyAdminForQuantityBelow ?? false,
    orderMinimumQuantity: product?.orderMinimumQuantity ?? 0,
    orderMaximumQuantity: product?.orderMaximumQuantity ?? 0,
    price: product?.price ?? 0,
    oldPrice: product?.oldPrice ?? 0,
    currencyId: product?.currencyId ?? 0,
    availableStartDateTimeUtc: product?.availableStartDateTimeUtc ?? null,
    availableEndDateTimeUtc: product?.availableEndDateTimeUtc ?? null,
    hasDiscountsApplied: product?.hasDiscountsApplied ?? false,
    markAsNew: product?.markAsNew ?? false,
    markAsNewStartDateTimeUtc: product?.markAsNewStartDateTimeUtc ?? null,
    markAsNewEndDateTimeUtc: product?.markAsNewEndDateTimeUtc ?? null,
    notReturnable: product?.notReturnable ?? false,
    allowedQuantities: product?.allowedQuantities ?? false,
    isTaxExempt: product?.isTaxExempt ?? false,
    showOnHomepage: product?.showOnHomepage ?? false,
    isFreeShipping: product?.isFreeShipping ?? false,
    allowCustomerReviews: product?.allowCustomerReviews ?? false,
    displayStockQuantity: product?.displayStockQuantity ?? false,
    disableBuyButton: product?.disableBuyButton ?? false,
    disableWishlistButton: product?.disableWishlistButton ?? false,
    availableForPreOrder: product?.availableForPreOrder ?? false,
    callForPrice: product?.callForPrice ?? false,
    published: product?.published ?? false,
    createdOnUtc: product?.createdOnUtc ?? new Date(),
    updatedOnUtc: product?.updatedOnUtc ?? new Date(),
    createUser: product?.createUser ?? null,
    updateUser: product?.updateUser ?? null,
    categoryIds: product?.categoryIds ?? [],
    manufacturerIds: product?.manufacturerIds ?? [],
    pictureIds: product?.pictureIds ?? [],
    relatedProductIds: product?.relatedProductIds ?? [],
    attributeIds: product?.attributeIds ?? [],
    inventories: product?.inventories ?? [],
    productTags: product?.productTags ?? [],
    createUserId: product?.createUserId ?? 0,
    previewImageId: product?.previewImageId ?? 0,
    previewImage: product?.previewImage ?? null,
    deliveryDateName: product?.deliveryDateName ?? '',
    taxCategoryName: product?.taxCategoryName ?? '',
    currencyCode: product?.currencyCode ?? '',
    weight: product?.weight ?? 0,
    length: product?.length ?? 0,
    width: product?.width ?? 0,
    height: product?.height ?? 0,
    inventoryStockQuantity: product?.inventoryStockQuantity ?? 0,
    displayOrder: product?.displayOrder ?? 0,
    approvedRatingSum: product?.approvedRatingSum ?? 0,
    notApprovedRatingSum: product?.notApprovedRatingSum ?? 0,
    approvedTotalReviews: product?.approvedTotalReviews ?? 0,
    notApprovedTotalReviews: product?.notApprovedTotalReviews ?? 0,
    deleted: product?.deleted ?? false,
    categoryNames: product?.categoryNames ?? [],
    manufacturerNames: product?.manufacturerNames ?? [],
    attributeNames: product?.attributeNames ?? [],
    reviewIds: product?.reviewIds ?? [],
  }
  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>

      <Grid container justifyContent="center" direction="row" alignItems="flex-start">
        <Grid container item spacing={3} xs={12} sm={12} md={12} lg={12} xl={12} direction="column">
          <Grid item>
            <Typography variant="h5">{t('pages.cards.product-' + operation)}</Typography>
          </Grid>
          <Grid item key={'product-' + product?.id}>
            <MainCard>
              <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={Yup.object().shape({
                  name: Yup.string()
                    .max(250)
                    .required(t(validation + 'requiredName')),
                  fullDescription: Yup.string().required(t(validation + 'requiredFullDescription')),
                  categoryIds: Yup.array()
                    .min(1, t(validation + 'requiredCategoryIds'))
                    .required(t(validation + 'requiredCategoryIds')),
                  deliveryDateId: Yup.number()
                    .required(t(validation + 'requiredDeliveryDateId')),
                  taxCategoryId: Yup.number()
                    .required(t(validation + 'requiredTaxCategoryId')),
                  stockQuantity: Yup.number()
                    .required(t(validation + 'requiredStockQuantity')),
                  minStockQuantity: Yup.number()
                    .required(t(validation + 'requiredMinStockQuantity')),
                  orderMinimumQuantity: Yup.number()
                    .required(t(validation + 'requiredOrderMinimumQuantity')),
                  orderMaximumQuantity: Yup.number()
                    .required(t(validation + 'requiredOrderMaximumQuantity')),
                  price: Yup.number()
                    .required(t(validation + 'requiredPrice')),
                  currencyId: Yup.number()
                    .required(t(validation + 'requiredCurrencyId'))
                })}
                onSubmit={(values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                  try {
                    setSubmitting(true);
                    handleSubmit(values as ProductModel, resetForm, setErrors, setSubmitting);
                  } catch (err) {
                    console.error(err);
                    setStatus({ success: false });

                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, values }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <Tabs
                      value={tab}
                      onChange={handleTabChange}
                      aria-label="Vertical tabs example"
                      // sx={{ ml: '25px' }}
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      <Tab label="Base Info" icon={<StoreIcon />} iconPosition="start" {...a11yProps(0)} />
                      <Tab label="Settings" icon={<SettingsSuggestIcon />} iconPosition="start" {...a11yProps(1)} />
                      <Tab label="Inventory" icon={<InventoryIcon />} iconPosition="start" {...a11yProps(2)} />
                      <Tab label="SEO" icon={<BookmarksIcon />} iconPosition="start" {...a11yProps(3)} />
                    </Tabs>
                    <TabPanel component="div" value={tab} index={0}>
                      <ProductBaseInfo
                        operation={operation}
                        values={values as ProductModel}
                        handleChange={handleChange}
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />
                    </TabPanel>
                    <TabPanel component="div" value={tab} index={1}>
                      <ProductSettings
                        operation={operation}
                        values={values}
                        handleChange={handleChange}
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />

                    </TabPanel>
                    <TabPanel component="div" value={tab} index={2}>
                      <ProductInventory
                        operation={operation}
                        values={values}
                        handleChange={handleChange}
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />
                    </TabPanel>
                    <TabPanel component="div" value={tab} index={3}>
                      <ProductSEO
                        operation={operation}
                        values={values}
                        handleChange={handleChange}
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />
                    </TabPanel>
                    <Grid container pt={2} pb={3}>
                      <Grid item xl={7}>
                        {(values.published || values.published == false) && Object.values(errors).length > 0 && <Alert severity="error">
                          <AlertTitle>Error</AlertTitle>
                          {Object.values(errors)?.map((error, index) =>
                            <FormHelperText key={index} error id="helper-text">
                              {typeof error === 'object' ? JSON.stringify(error) : String(error)}
                            </FormHelperText>
                          )}
                        </Alert>}
                      </Grid>
                    </Grid>
                    <Grid container item spacing={3} direction="row" justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Stack direction="row" spacing={2}>
                          <AnimateButton>
                            <Button
                              size="large"
                              onClick={() => {
                                router.back();
                              }}
                              variant="outlined"
                              color="secondary"
                              startIcon={<ArrowBack />}
                            >
                              {t('buttons.cancel')}
                            </Button>
                          </AnimateButton>
                          <AnimateButton>
                            <Button
                              disabled={isSubmitting}
                              size="large"
                              type="submit"
                              variant="contained"
                              color="primary"
                              onClick={() => setFieldValue('published', true)}
                              startIcon={<Send />}
                            >
                              {operation == 'edit' ? t(buttonName + 'save') : t(buttonName + 'publish')}
                            </Button>
                          </AnimateButton>
                          <AnimateButton>
                            <Button
                              disabled={isSubmitting}
                              size="large"
                              type="submit"
                              variant="contained"
                              color="warning"
                              onClick={() => setFieldValue('published', false)}
                              startIcon={<Save />}
                            >
                              {t(buttonName + 'draft')}
                            </Button>
                          </AnimateButton>
                        </Stack>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Formik>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
