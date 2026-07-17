'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Separator } from '../../../_components/ui/separator';
import { Badge } from '../../../_components/ui/badge';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';
import ProductDisplayModel from '../../../_types/ProductDisplayModel';
import ProductVariantDisplayModel from '../../../_types/ProductVariantDisplayModel';
import { getProductPricing } from '../../../_types/ProductDisplayModel';
import AttributeType from '@root/app/types/enums/AttributeType';
import VariantSelector from './VariantSelector';
import QuantitySelector from './QuantitySelector';
import ProductActions from './ProductActions';

interface ProductPurchaseSectionProps {
  product: ProductDisplayModel;
}

export default function ProductPurchaseSection({ product }: ProductPurchaseSectionProps) {
  const t = useTranslations();
  const { cheapestVariant: defaultCheapest } = getProductPricing(product.variants ?? []);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDisplayModel | null>(
    defaultCheapest ?? null
  );

  const activeVariant = selectedVariant ?? defaultCheapest;
  const stock = activeVariant?.productInventory?.stockQuantity ?? 0;

  const discount = activeVariant?.oldSellPrice
    ? Math.round(((activeVariant.oldSellPrice - activeVariant.sellPrice) / activeVariant.oldSellPrice) * 100)
    : 0;
  const savings = activeVariant?.oldSellPrice && activeVariant.oldSellPrice > activeVariant.sellPrice
    ? activeVariant.oldSellPrice - activeVariant.sellPrice
    : 0;

  const handleVariantChange = (options: Map<AttributeType, { id: number; displayName: string; key: string } | null>) => {
    const selectedKeys = Array.from(options.values()).filter(Boolean).map(o => o!.key);

    if (selectedKeys.length === 0) {
      setSelectedVariant(defaultCheapest);
      return;
    }

    const matched = product.variants?.find(v =>
      selectedKeys.every(key =>
        v.productAttributes?.some(attr => attr.key === key)
      )
    ) ?? null;

    setSelectedVariant(matched);
  };

  const isOutOfStock = !activeVariant || stock <= 0;

  return (
    <>
      {/* Price */}
      {product.callForPrice ? (
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-ecommerce-amber">
            {t('homepage.productDetail.callForPrice')}
          </span>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-ecommerce-text-primary">
              {CurrencyViewer(activeVariant?.sellPrice ?? 0, CONFIG.DEFAULT_CURRENCY)}
            </span>
            {activeVariant?.oldSellPrice && activeVariant.oldSellPrice > activeVariant.sellPrice && (
              <span className="text-lg text-ecommerce-text-muted line-through">
                {CurrencyViewer(activeVariant.oldSellPrice, CONFIG.DEFAULT_CURRENCY)}
              </span>
            )}
            {discount > 0 && (
              <Badge className="bg-ecommerce-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                {t('homepage.common.off', { percent: discount })}
              </Badge>
            )}
          </div>
          {savings > 0 && (
            <p className="text-sm font-medium text-ecommerce-emerald">
              {t('homepage.productDetail.youSave', { amount: savings.toFixed(2) })}
            </p>
          )}
        </div>
      )}

      <Separator className="bg-ecommerce-border/50" />

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-ecommerce-red" />
            <span className="text-sm font-medium text-ecommerce-red">
              {activeVariant ? t('homepage.productDetail.outOfStock') : t('homepage.productDetail.variantNotAvailable')}
            </span>
          </>
        ) : (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-ecommerce-emerald animate-pulse" />
            {stock <= 10 ? (
              <span className="text-sm font-medium text-ecommerce-amber">
                {t('homepage.productDetail.onlyLeft', { count: stock })}
              </span>
            ) : (
              <span className="text-sm font-medium text-ecommerce-emerald">
                {t('homepage.productDetail.inStock')}
              </span>
            )}
          </>
        )}
      </div>

      {/* SKU */}
      {activeVariant?.sku && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-ecommerce-text-muted">{t('homepage.productDetail.sku')}:</span>
          <span className="font-mono text-ecommerce-text-primary">{activeVariant.sku}</span>
        </div>
      )}

      {/* Category */}
      <div className="flex items-center gap-2">
        <span>
          <span className="text-sm text-ecommerce-text-muted">{t('homepage.productDetail.category')}: </span>
          <span className="text-sm font-medium text-ecommerce-text-primary">
            {product.categories?.map(category => category.name)}
          </span>
        </span>
      </div>

      {/* Tags */}
      {product.productTags && product.productTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-ecommerce-text-muted">{t('homepage.productDetail.tags')}:</span>
          {product.productTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs border-ecommerce-border text-ecommerce-text-secondary capitalize"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Short Description */}
      {product.shortDescription && (
        <div
          className="text-sm text-ecommerce-text-muted leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.shortDescription }}
        />
      )}

      <Separator className="bg-ecommerce-border/50" />

      {/* Variant Selector */}
      <VariantSelector
        variants={product.variants ?? []}
        onVariantChange={handleVariantChange}
      />

      {/* Quantity Selector */}
      {!product.disableBuyButton && !isOutOfStock && (
        <QuantitySelector
          measureType={product.measureType}
          displayStockQuantity={product.displayStockQuantity}
          maxQuantity={stock}
          allowedQuantities={product.allowedQuantities}
          orderMinimumQuantity={product.orderMinimumQuantity}
          orderMaximumQuantity={product.orderMaximumQuantity}
        />
      )}

      {/* Product Actions */}
      <ProductActions product={product} selectedVariant={activeVariant} isOutOfStock={isOutOfStock} />
    </>
  );
}
