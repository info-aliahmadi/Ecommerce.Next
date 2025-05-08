// assets
import   ShoppingCart  from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import {  SALE_ORDER_MANAGEMENT, SALE_PRODUCT_MANAGEMENT } from '../../_lib/Permissions';
// icons
const icons = {
  CategoryIcon,
  ShoppingCart
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'sale',
  title: 'Sales',
  type: 'group',
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
    }
    
  ]
};

export default pages;
