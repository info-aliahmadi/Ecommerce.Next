'use client';

// material-ui
import { Grid } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import ProductTagDataGrid from '../../_components/ProductTag/ProductTagDataGrid';

// ===============================|| DASHBOARD - PRODUCT TAG LIST ||=============================== //

export default function ProductTagListPage() {
  const t = useTranslations("");
  const { data: session } = useSession();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ProductTagDataGrid />
      </Grid>
    </Grid>
  );
} 