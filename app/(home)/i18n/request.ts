import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => ({
  timeZone: 'Asia/Tehran',
  locale : "fa"
}));