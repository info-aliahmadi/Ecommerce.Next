'use client';
import React, { useEffect, useState } from 'react';
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
import AnimateButton from '@dashboard/_components/@extended/AnimateButton';
import { createProductValidationSchema } from '@dashboard/(ecommerce)/_service/ProductValidationSchema';
import { useTranslations } from 'next-intl';
import Notify from '@dashboard/_components/@extended/Notify';
import MainCard from '@dashboard/_components/MainCard';
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

import ProductModel, { StockType } from '@dashboard/(ecommerce)/_types/Product/ProductModel';
import DeliveryDate from '@root/app/types/enums/DeliveryDateType';
import CONFIG from '@root/config';
import FileImageModel from '@root/app/types/FileImageModel';
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

export default function AddOrEditProduct({ params }: Readonly<{ params: Promise<{ operation: 'edit' | 'add'; id: number }> }>) {
  const t = useTranslations("");
  const [tab, setTab] = useState(0);

  const { id, operation } = React.use(params);

  const { data: session } = useSession();

  const jwt = session?.accessToken;
  let productService = new ProductsService(jwt ?? '');
  const initProduct: ProductModel = {
    id: 0,
    name: '',
    sku: '',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    shortDescription: '',
    fullDescription: '',
    adminComment: '',
    deliveryDateType: DeliveryDate.ThreeDays,
    taxCategoryId: null,
    stockQuantity: 0,
    minStockQuantity: 0,
    stockType: StockType.Total,
    notifyAdminForQuantityBelow: false,
    orderMinimumQuantity: 0,
    orderMaximumQuantity: 0,
    oldSellUnitPrice: 0,
    sellUnitPrice: 0,
    currencyType: CONFIG.DEFAULT_CURRENCY,
    measureType: CONFIG.DEFAULT_MEASURETYPE,
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
    images: [],
    relatedProductIds: [],
    attributeIds: [],
    inventories: [],
    tagIds: [],
    createUserId: 0,
    imagePreviewId: 0,
    deliveryDateName: '',
    taxCategoryName: '',
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
  const buttonName = 'buttons.product.';

  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [product, setProduct] = useState<ProductModel>(initProduct);

  const router = useRouter();

  useEffect(() => {
    if (operation === 'edit' && id > 0) {
      productService.getProductById(id).then((result) => {
        setProduct(result.data ?? product);
      });
    }
  }, [operation, id]);

  const handleTabChange = (event: any, newValue: any) => {
    setTab(newValue);
  };


  // Initialize validation schema with translated messages
  const validationSchema = createProductValidationSchema(t);

  const handleChange = (e: any) => {
    debugger
    const { name, value } = e.target;


    // fill the field in product
    const updatedProduct: ProductModel = {
      ...product,       // Override with existing product data
      [name]: value     // Add the new field value
    };

    setProduct(updatedProduct);

    // Clear error when field is edited
    if (errors && (errors as any)[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };
  const setFieldValue = (field: string, value: any): void => {
    debugger
    // fill the field in product
    const updatedProduct: ProductModel = {
      ...product,       // Override with existing product data
      [field]: value     // Add the new field value
    };

    if (field === 'stockType' && product.stockType !== value) {
      updatedProduct.inventories = []; // Clear inventories if stockType changes
    }

    setProduct(updatedProduct);

    // Clear error when field is edited
    if (errors && (errors as any)[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };
  const handleBlur = async (e: any) => {
    const { name } = e.target;

    try {
      await validationSchema.validateAt(name, product);
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    } catch (error) {
      // setErrors({
      //   ...errors,
      //   [name]: (error as any).message
      // });
    }
  };

  const handleSubmit = async (e: any, isDraft: boolean) => {
    e.preventDefault();
    product.published = !isDraft; // Set published based on isDraft flag
    setIsSubmitting(true);
    try {
      await validationSchema.validate(product, { abortEarly: false });
      setErrors({});

      if (operation == 'add') {
        productService
          .addProduct(product)
          .then(() => {
            setNotify({ open: true });
            // add timer after 4 seconds redirect to product list page
            setTimeout(() => {
              router.push('/dashboard/product');
            }, 4000);
          })
          .catch((error) => {
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
            setNotify({ open: true, type: 'error', description: error });
          });
      }
    } catch (error) {
      const validationErrors: Record<string, string> = {};

      if ((error as any).inner) {
        (error as any).inner.forEach((err: any) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>

      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} spacing={3} >
          <Grid size={12}>
            <Typography variant="h5">{t('pages.cards.product-' + operation)}</Typography>
          </Grid>
          <Grid key={'product-' + product?.id} size={12}>
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
                  setFieldValue={setFieldValue}
                  errors={errors}
                />
              </TabPanel>
              <TabPanel component="div" value={tab} index={1}>
                <ProductSettings
                  operation={operation}
                  values={product}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                  handleBlur={handleBlur}
                  errors={errors}
                />
              </TabPanel>
              <TabPanel component="div" value={tab} index={2}>
                <ProductInventory
                  operation={operation}
                  values={product}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                  handleBlur={handleBlur}
                  errors={errors}
                />
              </TabPanel>
              <TabPanel component="div" value={tab} index={3}>
                <ProductSEO
                  operation={operation}
                  values={product}
                  setFieldValue={setFieldValue}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  errors={errors}
                />
              </TabPanel>
              <Grid container sx={{ pt: 2, pb: 3 }} >
                <Grid sx={{ xl: 7 }}>
                  {Object.keys(errors).length > 0 && <Alert severity="error">
                    <AlertTitle>{t('validation.product.error')}</AlertTitle>
                    {Object.values(errors)?.map((error, index) =>
                      <FormHelperText key={index} error id="helper-text">
                        {typeof error === 'object' ? JSON.stringify(error) : String(error)}
                      </FormHelperText>
                    )}
                  </Alert>}
                </Grid>
              </Grid>
              <Grid container spacing={3} direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }} >
                <Grid size={12}>
                  <Stack direction="row" spacing={2}>

                    <AnimateButton>
                      <Button
                        disabled={isSubmitting}
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={(e) => handleSubmit(e, false)}
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
                        onClick={(e) => handleSubmit(e, true)}
                        startIcon={<Save />}
                      >
                        {t(buttonName + 'draft')}
                      </Button>
                    </AnimateButton>
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
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
      {/* 
      <Grid container>
        <Grid size={5}>
          {JSON.stringify(product)}

        </Grid>
      </Grid> */}

    </>
  );
}
