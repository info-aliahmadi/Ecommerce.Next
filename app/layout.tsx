
import { NextIntlClientProvider } from 'next-intl';
import DirectionProvider from '@root/i18n/direction-provider';
import { getLocale } from 'next-intl/server';
import CONFIG from '@root/config';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  // Load messages for the current locale (use client)
  let messages;
  messages = (await import(`@root/public/locales/${locale}/translation.json`)).default;


  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale ?? CONFIG.DEFAULT_LANGUAGE} messages={messages}>
          <DirectionProvider>
            {children}
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
