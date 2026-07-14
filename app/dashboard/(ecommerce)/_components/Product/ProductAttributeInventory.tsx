import { Grid, TextField, Stack, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import SelectProductAttribute from '../ProductAttribute/SelectProductAttribute';
import ProductModel from '../../_types/Product/ProductModel';
import ProductVariantModel from '../../_types/Product/ProductVariantModel';
import { memo } from 'react';

// This component is kept for backward compatibility but the variant card now handles attributes directly
export default function ProductAttributeInventory({ values, setFieldValue }: Readonly<{ values: ProductModel; setFieldValue: (field: string, value: any) => void }>) {
  return null;
}
