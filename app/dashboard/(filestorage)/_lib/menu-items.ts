// assets
import { Storage } from '@mui/icons-material';
import { FS_GALLEY_VIEW } from '../../_lib/Permissions';
// icons
const icons = {
  Storage
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  permission: FS_GALLEY_VIEW,
  children: [
    {
      id: 'fileStorage',
      title: 'Storage',
      type: 'item',
      url: '/dashboard/filestorage',
      icon: icons.Storage,
      breadcrumbs: false,
      permission: FS_GALLEY_VIEW
    }
  ]
};

export default pages;
