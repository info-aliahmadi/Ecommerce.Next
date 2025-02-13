
// ==============================|| ROUTE ITEMS ||============================== //

import { CMS_ARTICLE_MANAGEMENT, CMS_LINK_MANAGEMENT, CMS_MENU_MANAGEMENT, CMS_PAGE_MANAGEMENT, CMS_SLIDESHOW_MANAGEMENT, CMS_TOPIC_MANAGEMENT } from "../../_lib/Permissions";

const cmsRoutes = [
  {
    path: '/dashboard/article/list',
    permission: CMS_ARTICLE_MANAGEMENT
  },
  {
    path: '/dashboard/page/list',
    permission: CMS_PAGE_MANAGEMENT
  },
  {
    path: '/dashboard/topic/list',
    permission: CMS_TOPIC_MANAGEMENT
  },
  {
    path: '/dashboard/menu/list',
    permission: CMS_MENU_MANAGEMENT
  },
  {
    path: '/dashboard/slideshow/list',
    permission: CMS_SLIDESHOW_MANAGEMENT
  },
  {
    path: '/dashboard/link/list',
    permission: CMS_LINK_MANAGEMENT
  }
];
export default cmsRoutes
