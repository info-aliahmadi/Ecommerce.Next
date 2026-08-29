import CONFIG from '@root/config';
import type {Metadata} from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ operation: string }>;
}): Promise<Metadata> {
  const { operation } = await params;
  const t = await getTranslations('pages');
  return {
    title: t('cards.product-' + operation) + " | " + CONFIG.APP_HEADER
  };
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}