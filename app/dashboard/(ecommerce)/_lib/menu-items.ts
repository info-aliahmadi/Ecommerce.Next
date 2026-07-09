// assets
import   ShoppingCart  from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import {  SALE_BASE_INFORMATION_MANAGEMENT, SALE_CATEGORY_MANAGEMENT, SALE_MANUFACTURER_MANAGEMENT, SALE_BUNDLE_MANAGEMENT, SALE_ORDER_MANAGEMENT, SALE_PRODUCT_ATTRIBUTE_MANAGEMENT, SALE_PRODUCT_MANAGEMENT, SALE_PRODUCT_TAG_MANAGEMENT } from '../../_lib/Permissions';
// icons
const icons = {
  CategoryIcon,
  ShoppingCart,
  LocalOfferIcon
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'sale',
  title: 'Sales',
  type: 'group',
  icon: icons.ShoppingCart,
  permission: SALE_PRODUCT_MANAGEMENT,
  children: [
    {
      id: 'product',
      title: 'Products',
      type: 'item',
      url: '/dashboard/product/list',
      icon: icons.CategoryIcon,
      breadcrumbs: false,
      permission: SALE_PRODUCT_MANAGEMENT
    },{
      id: 'order',
      title: 'Orders',
      type: 'item',
      url: '/dashboard/order/list',
      icon: icons.ShoppingCart,
      breadcrumbs: false,
      permission: SALE_ORDER_MANAGEMENT
    },{
      id: 'manufacturer',
      title: 'Manufacturers',
      type: 'item',
      url: '/dashboard/manufacturer/list',
      icon: icons.ShoppingCart,
      breadcrumbs: false,
      permission: SALE_MANUFACTURER_MANAGEMENT
    },{
      id: 'bundles',
      title: 'Bundles',
      type: 'item',
      url: '/dashboard/bundle/list',
      icon: icons.ShoppingCart,
      breadcrumbs: false,
      permission: SALE_BUNDLE_MANAGEMENT
    },{
      id: 'category',
      title: 'Categories',
      type: 'item',
      url: '/dashboard/category/list',
      icon: icons.ShoppingCart,
      breadcrumbs: false,
      permission: SALE_CATEGORY_MANAGEMENT
    },{
      id: 'product-attribute',
      title: 'Product Attributes',
      type: 'item',
      url: '/dashboard/productAttribute/list',
      icon: icons.ShoppingCart,
      breadcrumbs: false,
      permission: SALE_PRODUCT_ATTRIBUTE_MANAGEMENT
    },{
      id: 'product-tag',
      title: 'Product Tags',
      type: 'item',
      url: '/dashboard/productTag/list',
      icon: icons.LocalOfferIcon,
      breadcrumbs: false,
      permission: SALE_PRODUCT_TAG_MANAGEMENT
    },{
      id: 'common',
      title: 'Common Information',
      type: 'item',
      url: '/dashboard/common/list',
      icon: icons.LocalOfferIcon,
      breadcrumbs: false,
      permission: SALE_BASE_INFORMATION_MANAGEMENT
    }
  ]
};

export default pages;
