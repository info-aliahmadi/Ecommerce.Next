"use client";

import { RTL_LOCALES } from "@root/app/(home)/_lib/store";
import { useLocale } from "next-intl";
import { useEffect } from "react";

export default function DirectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const isRTL = RTL_LOCALES.includes(locale as any);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale, isRTL]);

  return <>{children}</>;
} 