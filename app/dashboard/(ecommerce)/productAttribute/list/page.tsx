'use client';

// material-ui
import { Grid } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import ProductAttributeDataGrid from '../../_components/ProductAttribute/ProductAttributeDataGrid';

// ===============================|| DASHBOARD - PRODUCT ATTRIBUTE LIST ||=============================== //

export default function ProductAttributeListPage() {
  const t = useTranslations("");
  const { data: session } = useSession();

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <ProductAttributeDataGrid />
      </Grid>
    </Grid>
  );
} 