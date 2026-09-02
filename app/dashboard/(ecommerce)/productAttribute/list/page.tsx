'use client';
import { Grid } from '@mui/material';
import ProductAttributeDataGrid from '../../_components/ProductAttribute/ProductAttributeDataGrid';

export default function ProductAttributeListPage() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <ProductAttributeDataGrid />
      </Grid>
    </Grid>
  );
} 