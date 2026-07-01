// Translation map for database category names
// These map category names from the database to their translated versions
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export type CategoryTranslationMap = Record<string, string>;

export function useCategoryTranslations(): CategoryTranslationMap {
  const t = useTranslations();

  return useMemo(() => ({
    'Electronics': t('categories.electronics'),
    'Fashion': t('categories.fashion'),
    'Home & Living': t('categories.homeLiving'),
    'Sports': t('categories.sports'),
    'Beauty': t('categories.beauty'),
    'Books': t('categories.books'),
  }), [t]);
}