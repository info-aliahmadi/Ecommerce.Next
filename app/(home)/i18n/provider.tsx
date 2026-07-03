'use client';

import { useEffect, useCallback, useRef } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useLocaleStore, LOCALE_CONFIG, type Locale } from '../_lib/store';

// Inline script to set dir/lang before hydration to prevent flash
const LOCALE_INIT_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('ecommerce-locale');
    if (stored) {
      var data = JSON.parse(stored);
      var locale = data.state && data.state.locale ? data.state.locale : 'en';
      var cfg = { en: { dir: 'ltr' }, fa: { dir: 'rtl' }, ar: { dir: 'rtl' } };
      var dir = cfg[locale] ? cfg[locale].dir : 'ltr';
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', locale);
    }
  } catch(e) {}
})();
`;

export function I18nScript() {
  return <script dangerouslySetInnerHTML={{ __html: LOCALE_INIT_SCRIPT }} />;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { locale, setLocale } = useLocaleStore();
  const mountedRef = useRef(false);

  const config = LOCALE_CONFIG[locale];

  // Update messages when locale changes
  const handleLocaleChange = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
  }, [setLocale]);

  // Set dir and lang on mount and locale change (DOM sync only, no setState)
  useEffect(() => {
    const dir = LOCALE_CONFIG[locale].dir;
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', locale);
    if (locale === 'fa') {
      document.documentElement.style.setProperty('--font-locale', "' Iran Sans, 'Segoe UI', Tahoma, sans-serif");
    } else if (locale === 'ar') {
      document.documentElement.style.setProperty('--font-locale', "'Cairo', 'Segoe UI', Tahoma, sans-serif");
    } else {
      document.documentElement.style.setProperty('--font-locale', 'inherit');
    }
    mountedRef.current = true;
  }, [locale]);

  return (
    <NextIntlClientProvider
      locale={locale}
      // messages={messagesMap[locale]}
      timeZone="Asia/Tehran"
    >
      <I18nContext.Provider value={{ locale, setLocale: handleLocaleChange, dir: config.dir }}>
        {children}
      </I18nContext.Provider>
    </NextIntlClientProvider>
  );
}

import { createContext, useContext } from 'react';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: 'ltr' | 'rtl';
}

export const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  dir: 'ltr',
});

export function useI18n() {
  return useContext(I18nContext);
}