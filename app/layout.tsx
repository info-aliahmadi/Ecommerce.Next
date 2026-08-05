import { NextIntlClientProvider } from 'next-intl';
import DirectionProvider from '@root/i18n/direction-provider';
import { getLocale } from 'next-intl/server';
// import { I18nScript } from './(home)/i18n/provider';
import "@root/public/fonts/IRANSans/iransans.css";
import "@root/public/fonts/Geist/geist.css";
import "@root/public/css/customStyle/homePage.css";
import {  resolveLocale } from '@root/utils/resolver';
import { Locale } from '@root/locales/Language';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale() ;
  const language = resolveLocale(locale as Locale);
  // Load messages for the current locale (use client)
  const dir = language.direction;

  const fontlocaleCssClass = dir === "rtl" ? "farsi-font" : "english-font";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`font-sans ${fontlocaleCssClass} antialiased`}
        style={{ fontFamily: 'var(--font-locale, var(--font-geist-sans)), sans-serif' }}
      >
        <NextIntlClientProvider>
          <DirectionProvider>
            {children}
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
