import { CRM_ALL_EMAIL_INBOX_MANAGMENT, CRM_ALL_EMAIL_OUTBOX_MANAGMENT, CRM_ALL_MESSAGE_MANAGMENT, CRM_SUBSCRIBE_MANAGMENT } from "../../_lib/Permissions";

// ==============================|| ROUTES ITEMS ||============================== //
const crmRoutes = [
  {
    path: '/dashboard/message/inbox',
    permission: CRM_ALL_MESSAGE_MANAGMENT
  },
  {
    path: '/dashboard/message/outbox',
    permission: CRM_ALL_MESSAGE_MANAGMENT
  },
  {
    path: '/dashboard/email/inbox',
    permission: CRM_ALL_EMAIL_INBOX_MANAGMENT
  },
  {
    path: '/dashboard/email/outbox',
    permission: CRM_ALL_EMAIL_OUTBOX_MANAGMENT
  },
  {
    path: '/dashboard/subscribe/list',
    permission: CRM_SUBSCRIBE_MANAGMENT
  }
]

export default crmRoutes;