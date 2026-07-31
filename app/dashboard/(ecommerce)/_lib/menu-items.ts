// assets
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import Product from '@mui/icons-material/Category';
import { SALE_BASE_INFORMATION_MANAGEMENT, SALE_CATEGORY_MANAGEMENT, SALE_MANUFACTURER_MANAGEMENT, SALE_BUNDLE_MANAGEMENT, SALE_ORDER_MANAGEMENT, SALE_PRODUCT_ATTRIBUTE_MANAGEMENT, SALE_PRODUCT_MANAGEMENT, SALE_PRODUCT_TAG_MANAGEMENT } from '../../_lib/Permissions';
import Factory from '@mui/icons-material/Factory';
import Bundle from '@mui/icons-material/AutoAwesomeMotionRounded';
import Category from '@mui/icons-material/GridViewRounded';
import Attribute from '@mui/icons-material/ListAltRounded';
import Tags from '@mui/icons-material/BookmarksRounded';
import Common from '@mui/icons-material/TuneRounded';

// icons
const icons = {
  Product,
  ShoppingCart,
  Factory,
  Bundle,
  Category,
  Attribute,
  Tags,
  Common
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
      icon: icons.Product,
      breadcrumbs: false,
      permission: SALE_PRODUCT_MANAGEMENT
    }, {
      id: 'order',
      title: 'Orders',
      type: 'item',
      url: '/dashboard/order/list',
      icon: icons.ShoppingCart,
      breadcrumbs: false,
      permission: SALE_ORDER_MANAGEMENT
    }, {
      id: 'manufacturer',
      title: 'Manufacturers',
      type: 'item',
      url: '/dashboard/manufacturer/list',
      icon: icons.Factory,
      breadcrumbs: false,
      permission: SALE_MANUFACTURER_MANAGEMENT
    }, {
      id: 'bundles',
      title: 'Bundles',
      type: 'item',
      url: '/dashboard/bundle/list',
      icon: icons.Bundle,
      breadcrumbs: false,
      permission: SALE_BUNDLE_MANAGEMENT
    }, {
      id: 'category',
      title: 'Categories',
      type: 'item',
      url: '/dashboard/category/list',
      icon: icons.Category,
      breadcrumbs: false,
      permission: SALE_CATEGORY_MANAGEMENT
    }, {
      id: 'product-attribute',
      title: 'Product Attributes',
      type: 'item',
      url: '/dashboard/productAttribute/list',
      icon: icons.Attribute,
      breadcrumbs: false,
      permission: SALE_PRODUCT_ATTRIBUTE_MANAGEMENT
    }, {
      id: 'product-tag',
      title: 'Product Tags',
      type: 'item',
      url: '/dashboard/productTag/list',
      icon: icons.Tags,
      breadcrumbs: false,
      permission: SALE_PRODUCT_TAG_MANAGEMENT
    }, {
      id: 'common',
      title: 'Common Information',
      type: 'item',
      url: '/dashboard/common/list',
      icon: icons.Common,
      breadcrumbs: false,
      permission: SALE_BASE_INFORMATION_MANAGEMENT
    }
  ]
};

export default pages;
