import CONFIG from '@root/config';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

// ── Dynamic metadata ──────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('homepage.checkout');
  return {
    title: t("title") + " | " + CONFIG.APP_HEADER
  };
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}