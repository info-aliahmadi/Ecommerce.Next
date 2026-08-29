import CONFIG from '@root/config';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

// ── Dynamic metadata ──────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('homepage.auth.login');
  return {
    title: t("pageTitle") + " | " + CONFIG.APP_HEADER
  };
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}