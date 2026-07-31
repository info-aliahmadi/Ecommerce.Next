'use client';

// material-ui
import { Grid } from '@mui/material';

// project import
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import CONFIG from '@root/config';
import { useSession } from 'next-auth/react';
import ProductTagDataGrid from '../../_components/ProductTag/ProductTagDataGrid';

// ===============================|| DASHBOARD - PRODUCT TAG LIST ||=============================== //

export default function ProductTagListPage() {
  const t = useTranslations("");
  useEffect(() => {
    document.title = t('pages.productTags') + " - " + CONFIG.APP_HEADER;
  }, [t]);
  const { data: session } = useSession();

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <ProductTagDataGrid />
      </Grid>
    </Grid>
  );
} 