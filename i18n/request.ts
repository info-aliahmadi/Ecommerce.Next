import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import CONFIG from '@root/config';
import languageList from '@root/locales/languageList';

export default getRequestConfig(async () => {
  // Get locale from cookie or use default
  const cookieStore = await cookies();
  
  // Try to get from NEXT_LOCALE cookie first (for next-intl)
  let localeCookie = cookieStore.get('NEXT_LOCALE');
  let locale = localeCookie?.value;

  // Final fallback to default
  locale = locale ?? languageList.find((l) => l.languageType === CONFIG.DEFAULT_LANGUAGE)?.key ?? 'en';
debugger
  return {
    locale: locale,
    messages: (await import(`../public/locales/${locale}/translation.json`)).default,
    // timeZone: 'UTC',
    // defaultLocale: locale,
    // locales: locales
  };
}); 