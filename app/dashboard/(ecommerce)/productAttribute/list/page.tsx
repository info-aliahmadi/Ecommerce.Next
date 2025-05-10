'use client';

// material-ui
import { Grid } from '@mui/material';

// project import
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import ProductAttributeDataGrid from '../../_components/ProductAttribute/ProductAttributeDataGrid';

// ===============================|| DASHBOARD - PRODUCT ATTRIBUTE LIST ||=============================== //

export default function ProductAttributeListPage() {
  const [t] = useTranslation();
  const { data: session } = useSession();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ProductAttributeDataGrid />
      </Grid>
    </Grid>
  );
} 