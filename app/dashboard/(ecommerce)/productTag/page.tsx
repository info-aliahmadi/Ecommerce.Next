'use client';

// material-ui
import { Grid } from '@mui/material';

// project import
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import ProductTagDataGrid from '../_components/ProductTag/ProductTagDataGrid';

// ===============================|| DASHBOARD - PRODUCT TAG ||=============================== //

export default function ProductTagPage() {
  const [t] = useTranslation();
  const { data: session } = useSession();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ProductTagDataGrid />
      </Grid>
    </Grid>
  );
} 