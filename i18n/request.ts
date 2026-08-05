import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import CONFIG from '@root/config';
import LanguageList from '@root/locales/LanguageList';

export default getRequestConfig(async () => {
  // Get locale from cookie or use default
  const store = await cookies();
  const locale = store.get(CONFIG.LANGUAGE_STORAGE_NAME)?.value || LanguageList.find((l) => l.languageType === CONFIG.DEFAULT_LANGUAGE)?.key as string;


  return {
    locale: locale,
    messages: (await import(`../public/locales/${locale}/translation.json`)).default,
    // timeZone: 'UTC',
    // defaultLocale: locale,
    // locales: locales
  };
}); 