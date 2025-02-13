// project import
import dashboard from './dashboard';
import authMenu from '@dashboard/(auth)/_lib/menu-items';
import cmsMenu from '@dashboard/(cms)/_lib/menu-items';
// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, authMenu, cmsMenu]
};
export default menuItems;
