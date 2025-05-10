// project import
import dashboard from './dashboard';
import authMenu from '@dashboard/(auth)/_lib/menu-items';
import cmsMenu from '@dashboard/(cms)/_lib/menu-items';
import crmMenu from '@dashboard/(crm)/_lib/menu-items';
import ecommerceMenu from '@dashboard/(ecommerce)/_lib/menu-items';
import filestorageMenu from '@dashboard/(filestorage)/_lib/menu-items';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, authMenu, ecommerceMenu, cmsMenu, crmMenu, filestorageMenu]
};
export default menuItems;
