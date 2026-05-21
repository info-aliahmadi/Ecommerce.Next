import CONFIG from "@root/config";

export const locales = ['en', 'ar', 'fa'] as const;
export type Locale = typeof locales[number];

export const defaultLocale = CONFIG.DEFAULT_LANGUAGE as Locale;

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  fa: 'فارسی'
};

export const rtlLocales: Locale[] = ['ar', 'fa'];
export const persianCalendar: Locale[] = ['fa'];