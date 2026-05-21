"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";
import { rtlLocales } from "@root/locales/i18nHomepage";

export default function DirectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const isRTL = rtlLocales.includes(locale as any);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale, isRTL]);

  return <>{children}</>;
} 