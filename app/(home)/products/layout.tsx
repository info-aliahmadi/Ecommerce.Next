import CONFIG from '@root/config';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

// ── Dynamic metadata ──────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('homepage.shopPage');
  return {
    title: t("title") + " | " + CONFIG.APP_HEADER
  };
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}