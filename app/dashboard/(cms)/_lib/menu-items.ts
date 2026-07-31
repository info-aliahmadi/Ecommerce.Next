// assets
import { Article, Menu, Description, Topic, Link } from '@mui/icons-material';
import { CMS_ARTICLE_MANAGEMENT, CMS_LINK_MANAGEMENT, CMS_MENU_MANAGEMENT, CMS_PAGE_MANAGEMENT, CMS_SLIDESHOW_MANAGEMENT, CMS_TOPIC_MANAGEMENT } from '../../_lib/Permissions';
import Slideshow from '@mui/icons-material/SubscriptionsRounded';

// icons
const icons = {
  Article,
  Description,
  Menu,
  Slideshow,
  Topic,
  Link
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'contents',
  title: 'Contents',
  type: 'group',
  icon: icons.Article,
  permission: null,
  children: [
    {
      id: 'article',
      title: 'Articles',
      type: 'item',
      url: '/dashboard/article/list',
      icon: icons.Article,
      breadcrumbs: false,
      permission: CMS_ARTICLE_MANAGEMENT
    },
    {
      id: 'page',
      title: 'Pages',
      type: 'item',
      url: '/dashboard/page/list',
      icon: icons.Description,
      breadcrumbs: false,
      permission: CMS_PAGE_MANAGEMENT
    },
    {
      id: 'topic',
      title: 'Topics',
      type: 'item',
      url: '/dashboard/topic/list',
      icon: icons.Topic,
      breadcrumbs: false,
      permission: CMS_TOPIC_MANAGEMENT
    },
    {
      id: 'menus',
      title: 'Menus',
      type: 'item',
      url: '/dashboard/menu/list',
      icon: icons.Menu,
      breadcrumbs: false,
      permission: CMS_MENU_MANAGEMENT
    },
    {
      id: 'slideshow',
      title: 'Slideshow',
      type: 'item',
      url: '/dashboard/slideshow/list',
      icon: icons.Slideshow,
      breadcrumbs: false,
      permission: CMS_SLIDESHOW_MANAGEMENT
    },
    {
      id: 'links',
      title: 'Links',
      type: 'item',
      url: '/dashboard/link/list',
      icon: icons.Link,
      breadcrumbs: false,
      permission: CMS_LINK_MANAGEMENT
    }
  ]
};

export default pages;
