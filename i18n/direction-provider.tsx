"use client";

import { Locale } from "@root/locales/Language";
import { resolveLocale } from "@root/utils/resolver";
import { useLocale } from "next-intl";
import { useEffect } from "react";

export default function DirectionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = useLocale() as Locale;
  const isRTL = resolveLocale(locale).direction === 'rtl';

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale, isRTL]);

  return <>{children}</>;
} 