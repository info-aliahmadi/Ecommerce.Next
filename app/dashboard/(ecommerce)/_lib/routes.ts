// ==============================|| ROUTE ITEMS ||============================== //

import { SALE_CATEGORY_MANAGEMENT, SALE_PRODUCT_ATTRIBUTE_MANAGEMENT, SALE_PRODUCT_MANAGEMENT, SALE_PRODUCT_TAG_MANAGEMENT, SALE_TAX_MANAGEMENT } from "../../_lib/Permissions";

import { SALE_MANUFACTURER_MANAGEMENT } from "../../_lib/Permissions";

import { SALE_ORDER_MANAGEMENT } from "../../_lib/Permissions";

const saleRoutes = [
  {
    path: '/dashboard/product/list',
    permission: SALE_PRODUCT_MANAGEMENT
  },
  {
    path: '/dashboard/order/list',
    permission: SALE_ORDER_MANAGEMENT
  },
  {
    path: '/dashboard/manufacturer/list',
    permission: SALE_MANUFACTURER_MANAGEMENT
  },
  {
    path: '/dashboard/product-attribute/list',
    permission: SALE_PRODUCT_ATTRIBUTE_MANAGEMENT
  },
  {
    path: '/dashboard/product-tag/list',
    permission: SALE_PRODUCT_TAG_MANAGEMENT
  },
  {
    path: '/dashboard/category/list',
    permission: SALE_CATEGORY_MANAGEMENT
  },

];
export default saleRoutes;
