import CONFIG from '@root/config';
import type {Metadata} from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ directory: string }>;
}): Promise<Metadata> {
  const { directory } = await params;
  const t = await getTranslations('pages');
  return {
    title: t('filesList') + " | " + directory + " | " + CONFIG.APP_HEADER
  };
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}