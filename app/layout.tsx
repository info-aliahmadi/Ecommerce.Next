
import { NextIntlClientProvider } from 'next-intl';
import DirectionProvider from '@root/i18n/direction-provider';
import { getLocale } from 'next-intl/server';
import CONFIG from '@root/config';
import { RTL_LOCALES } from './(home)/_lib/store';
// import { I18nScript } from './(home)/i18n/provider';
import "@root/public/fonts/IRANSans/iransans.css";
import "@root/public/fonts/Geist/geist.css";
import "@root/public/css/customStyle/homePage.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  // Load messages for the current locale (use client)
  let messages;
  messages = (await import(`@root/public/locales/${locale}/translation.json`)).default;

  const dir = RTL_LOCALES.includes(locale as any) ? "rtl" : "ltr";

  const fontlocaleCssClass = dir === "rtl" ? "farsi-font" : "english-font";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* <I18nScript /> */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`font-sans ${fontlocaleCssClass} antialiased`}
        style={{ fontFamily: 'var(--font-locale, var(--font-geist-sans)), sans-serif' }}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale ?? CONFIG.DEFAULT_LANGUAGE} messages={messages}>
          <DirectionProvider>
            {children}
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
