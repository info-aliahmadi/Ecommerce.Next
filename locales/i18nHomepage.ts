import CONFIG from "@root/config";

export const locales = ['en', 'ar', 'fa'] as const;
export type Locale = typeof locales[number];

export const defaultLocale = CONFIG.DEFAULT_LANGUAGE as Locale;
