// Translation map for database category names
// These map category names from the database to their translated versions
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export type CategoryTranslationMap = Record<string, string>;

export function useCategoryTranslations(): CategoryTranslationMap {
  const t = useTranslations();

  return useMemo(() => ({
    'Electronics': t('homepage.categories.electronics'),
    'Fashion': t('homepage.categories.fashion'),
    'Home & Living': t('homepage.categories.homeLiving'),
    'Sports': t('homepage.categories.sports'),
    'Beauty': t('homepage.categories.beauty'),
    'Books': t('homepage.categories.books'),
  }), [t]);
}