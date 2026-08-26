'use client';
import { Grid } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import CONFIG from '@root/config';
import ProductAttributeDataGrid from '../../_components/ProductAttribute/ProductAttributeDataGrid';

// ===============================|| DASHBOARD - PRODUCT ATTRIBUTE LIST ||=============================== //

export default function ProductAttributeListPage() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.productAttributes') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <ProductAttributeDataGrid />
      </Grid>
    </Grid>
  );
} 