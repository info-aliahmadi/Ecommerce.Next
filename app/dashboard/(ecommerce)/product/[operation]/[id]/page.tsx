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

  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});


  const router = useRouter();

  const loadProduct = () => {
    productService.getProductById(id).then((result) => {
      setProduct(result.data ?? product);
    });
  };
  useEffect(() => {
    if (operation == 'edit' && id > 0) loadProduct();
  }, [operation, id]);

  const handleTabChange = (event: any, newValue: any) => {
    setTab(newValue);
  };
  const initProduct: ProductModel = {
    id: 0,
    name: '',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    shortDescription: '',
    fullDescription: '',
    adminComment: '',
    deliveryDateId: 0,
    taxCategoryId: 0,
    stockQuantity: 0,
    minStockQuantity: 0,
    notifyAdminForQuantityBelow: false,
    orderMinimumQuantity: 0,
    orderMaximumQuantity: 0,
    price: 0,
    oldPrice: 0,
    currencyId: 0,
    availableStartDateTimeUtc: null,
    availableEndDateTimeUtc: null,
    hasDiscountsApplied: false,
    markAsNew: false,
    markAsNewStartDateTimeUtc: null,
    markAsNewEndDateTimeUtc: null,
    notReturnable: false,
    allowedQuantities: false,
    isTaxExempt: false,
    showOnHomepage: false,
    isFreeShipping: false,
    allowCustomerReviews: false,
    displayStockQuantity: false,
    disableBuyButton: false,
    disableWishlistButton: false,
    availableForPreOrder: false,
    callForPrice: false,
    published: false,
    createdOnUtc: new Date(),
    updatedOnUtc: new Date(),
    createUser: null,
    updateUser: null,
    categoryIds: [],
    manufacturerIds: [],
    pictureIds: [],
    relatedProductIds: [],
    attributeIds: [],
    inventories: [],
    productTags: [],
    createUserId: 0,
    previewImageId: 0,
    previewImage: null,
    deliveryDateName: '',
    taxCategoryName: '',
    currencyCode: '',
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    inventoryStockQuantity: 0,
    displayOrder: 0,
    approvedRatingSum: 0,
    notApprovedRatingSum: 0,
    approvedTotalReviews: 0,
    notApprovedTotalReviews: 0,
    deleted: false,
    categoryNames: [],
    manufacturerNames: [],
    attributeNames: [],
    reviewIds: [],
  };
  const [product, setProduct] = useState<ProductModel>(initProduct);


  // Define your validation schema with Yup
  const validationSchema = Yup.object().shape({
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
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    // fill the field in product
    const updatedProduct: ProductModel = {
      ...product,       // Override with existing product data
      [name]: value     // Add the new field value
    };

    setProduct(updatedProduct);

    // Clear error when field is edited
    if (errors && (errors as any)[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleBlur = async (e: any) => {
    const { name, value } = e.target;

    try {
      await validationSchema.validateAt(name, product);
      setErrors({
        ...errors,
        [name]: undefined
      });
    } catch (error) {
      setErrors({
        ...errors,
        [name]: (error as any).message
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isValid = await validationSchema.validate(product, { abortEarly: false });

      if (operation == 'add') {
        productService
          .addProduct(product)
          .then(() => {
            setProduct(product);
            setNotify({ open: true });
          })
          .catch((error) => {
            // setErrors(setServerErrors(error));
            setNotify({ open: true, type: 'error', description: error });
          });
      } else {
        productService
          .updateProduct(product)
          .then((result) => {
            setProduct(result.data ?? product);
            setNotify({ open: true });
          })
          .catch((error) => {
            //setErrors(setServerErrors(error));
            setNotify({ open: true, type: 'error', description: error });
          });
      }

    } catch (error) {
      const validationErrors = {};

      // if (error.inner) {
      //   error.inner.forEach(err => {
      //     validationErrors[err.path] = err.message;
      //   });
      // }

    } finally {
      setIsSubmitting(false);
    }
  };

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
                  values={product}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  errors={errors}
                />
              </TabPanel>
              <TabPanel component="div" value={tab} index={1}>
                <ProductSettings
                  operation={operation}
                  values={product}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  errors={errors}
                />

              </TabPanel>
              <TabPanel component="div" value={tab} index={2}>
                <ProductInventory
                  operation={operation}
                  values={product}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  errors={errors}
                />
              </TabPanel>
              <TabPanel component="div" value={tab} index={3}>
                <ProductSEO
                  operation={operation}
                  values={product}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  errors={errors}
                />
              </TabPanel>
              <Grid container pt={2} pb={3}>
                <Grid item xl={7}>
                  {(product.published || product.published == false) && Object.values(errors).length > 0 && <Alert severity="error">
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
                        onClick={handleSubmit}
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
                        onClick={handleSubmit}
                        startIcon={<Save />}
                      >
                        {t(buttonName + 'draft')}
                      </Button>
                    </AnimateButton>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
