import { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import ProductService from '../../_service/ProductService';
import { useSession } from 'next-auth/react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Result from '@root/app/types/Result';
import { useTranslations } from 'next-intl';
import { ProductBundleModel } from '../../_types/Product/BundleModel';
import CONFIG from '@root/config';

interface ProductBundleEditorProps {
  products: ProductBundleModel[];
  setFieldValue: (field: string, value: any) => void;
}

export default function ProductBundleEditor({ products, setFieldValue }: Readonly<ProductBundleEditorProps>) {
  const t = useTranslations("");
  const fieldsName = 'fields.bundle.';
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const productService = new ProductService(jwt ?? '');

  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [productNames, setProductNames] = useState<Record<number, string>>({});

  useEffect(() => {
    const ids = products.map(c => c.productId);
    if (ids.length === 0) return;
    const missingIds = ids.filter(id => !productNames[id]);
    if (missingIds.length === 0) return;

    productService.getProductsByIds(missingIds).then((result: Result<any[]>) => {
      if (result.succeeded && result.data) {
        const nameMap: Record<number, string> = {};
        result.data.forEach(p => { nameMap[p.id] = p.name; });
        setProductNames(prev => ({ ...prev, ...nameMap }));
      }
    });
  }, [products]);

  const onInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
    setInputValue(newInputValue);
    if (newInputValue && newInputValue.length >= 2) {
      setLoading(true);
      productService.getProductsByInput(newInputValue).then((result: Result<any[]>) => {
        const existingIds = products.map(c => c.productId);
        const filtered = result.data?.filter(p => !existingIds.includes(p.id)) ?? [];
        setOptions(filtered);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setOptions([]);
    }
  };

  const onAddProduct = (event: any, product: any) => {
    if (!product || !product.id) return;
    const newChild: ProductBundleModel = {
      bundleId: 0,
      productId: product.id,
      displayOrder: products.length
    };
    const updated = [...products, newChild];
    setFieldValue('products', updated);
    setProductNames(prev => ({ ...prev, [product.id]: product.name }));
    setInputValue('');
    setOptions([]);
  };

  const onRemoveProduct = (productId: number) => {
    const updated = products.filter(c => c.productId !== productId);
    setFieldValue('products', updated);
  };

  const onUpdateDisplayOrder = (productId: number, displayOrder: number) => {
    const updated = products.map(c =>
      c.productId === productId ? { ...c, displayOrder } : c
    );
    setFieldValue('products', updated);
  };

  return (
    <Stack spacing={2}>
      <Autocomplete
        freeSolo
        options={options}
        getOptionLabel={(option) => option.name || ''}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onInputChange={onInputChange}
        onChange={onAddProduct}
        inputValue={inputValue}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t(fieldsName + 'addProduct')}
            variant="outlined"
            size="small"
          // InputProps={{
          //   ...params.InputProps,
          //   endAdornment: (
          //     <>
          //       {loading && <CircularProgress color="inherit" size={15} />}
          //       {params.InputProps.endAdornment}
          //     </>
          //   )
          // }}
          />
        )}
      />

      {products.length > 0 && (
        <Stack spacing={1}>
          <Typography variant="subtitle2">{t(fieldsName + 'selectedProducts')}</Typography>
          {products.map((child) => (
            <Box
              key={child.productId}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1
              }}
            >
              <Avatar variant='rounded' src={CONFIG.UNKNOWN_IMAGE_BASEPATH} sx={{ width: '40px', height: '40px' }}></Avatar>
              <Typography variant="body2" sx={{ flex: 1 }}>
                {productNames[child.productId] || `Product #${child.productId}`}
              </Typography>
              <TextField
                size="small"
                type="number"
                label={t(fieldsName + 'displayOrder')}
                value={child.displayOrder}
                onChange={(e) => onUpdateDisplayOrder(child.productId, parseInt(e.target.value) || 0)}
                sx={{ width: 100 }}
              />
              <IconButton size="small" color="error" onClick={() => onRemoveProduct(child.productId)}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
