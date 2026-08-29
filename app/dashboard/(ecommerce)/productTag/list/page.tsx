'use client';

import { Grid } from '@mui/material';
import ProductTagDataGrid from '../../_components/ProductTag/ProductTagDataGrid';

export default function ProductTagListPage() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <ProductTagDataGrid />
      </Grid>
    </Grid>
  );
} 