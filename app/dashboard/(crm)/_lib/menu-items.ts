// assets
import { Message, Email, FollowTheSigns } from '@mui/icons-material';
import {  CRM_ALL_EMAIL_INBOX_MANAGMENT, CRM_ALL_EMAIL_OUTBOX_MANAGMENT, CRM_ALL_MESSAGE_MANAGMENT, CRM_SUBSCRIBE_MANAGMENT } from '../../_lib/Permissions';
// icons
const icons = {
  Message,
  Email,
  FollowTheSigns
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //
const crmMenu = {
  id: 'messaging',
  title: 'Messaging',
  type: 'group',
  icon: icons.Message,
  permission: null,
  children: [
    {
      id: 'messageInbox',
      title: 'Message Inbox',
      type: 'item',
      url: '/dashboard/message/inbox',
      icon: icons.Message,
      breadcrumbs: false,
      permission: CRM_ALL_MESSAGE_MANAGMENT
    },
    {
      id: 'emailInbox',
      title: 'Email Inbox',
      type: 'item',
      url: '/dashboard/email/inbox',
      icon: icons.Email,
      breadcrumbs: false,
      permission: CRM_ALL_EMAIL_INBOX_MANAGMENT
    },
    // {
    //   id: 'emailOutbox',
    //   title: 'Email Outbox',
    //   type: 'item',
    //   url: '/dashboard/email/outbox',
    //   icon: icons.Email,
    //   breadcrumbs: false,
    //   permission: CRM_ALL_EMAIL_OUTBOX_MANAGMENT
    // },
    {
      id: 'subscribe',
      title: 'Subscribes',
      type: 'item',
      url: '/dashboard/subscribe/list',
      icon: icons.FollowTheSigns,
      breadcrumbs: false,
      permission: CRM_SUBSCRIBE_MANAGMENT
    }
  ]
};

export default crmMenu;
