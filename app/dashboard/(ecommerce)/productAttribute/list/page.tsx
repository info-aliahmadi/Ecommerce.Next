'use client';

// material-ui
import { Grid } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import CONFIG from '@root/config';
import { useSession } from 'next-auth/react';
import ProductAttributeDataGrid from '../../_components/ProductAttribute/ProductAttributeDataGrid';

// ===============================|| DASHBOARD - PRODUCT ATTRIBUTE LIST ||=============================== //

export default function ProductAttributeListPage() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.productAttributes') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  const { data: session } = useSession();

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <ProductAttributeDataGrid />
      </Grid>
    </Grid>
  );
} 