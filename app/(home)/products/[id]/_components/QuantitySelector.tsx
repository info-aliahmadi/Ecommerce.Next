'use client';

import { useState } from 'react';
import { Button } from '../../../_components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import MeasureType from '@root/app/types/enums/MeasureType';
import MeasureTypeViewer from '@root/utils/MeasureTypeViewer';

interface QuantitySelectorProps {
  measureType: MeasureType;
  displayStockQuantity: boolean;
  maxQuantity: number;
  allowedQuantities?: boolean;
  orderMinimumQuantity?: number;
  orderMaximumQuantity?: number;
}

export default function QuantitySelector({
  measureType,
  maxQuantity,
  displayStockQuantity,
  allowedQuantities = false,
  orderMinimumQuantity = 1,
  orderMaximumQuantity = 9999,
}: Readonly<QuantitySelectorProps>) {
  const minQty = allowedQuantities ? Math.max(1, orderMinimumQuantity) : 1;
  const effectiveMax = allowedQuantities
    ? Math.min(maxQuantity, orderMaximumQuantity)
    : maxQuantity;

  const [quantity, setQuantity] = useState(minQty);
  const t = useTranslations('');

  return (
    <div>
      {/* Quantity */}
      <label className="text-sm font-medium text-ecommerce-text-primary mb-2 block">
        {t('homepage.productDetail.quantity')}
      </label>
      <div className="flex items-center border border-ecommerce-border rounded-xl overflow-hidden">
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 flex items-center justify-center hover:bg-ecommerce-surface-hover transition-colors"
          onClick={() => setQuantity((q) => Math.max(minQty, q - 1))}
          disabled={quantity <= minQty}
        >
          <Minus size={16} />
        </Button>
        <span className="w-12 text-center text-sm font-semibold countdown-digit">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 flex items-center justify-center hover:bg-ecommerce-surface-hover transition-colors"
          onClick={() => setQuantity((q) => Math.min(effectiveMax, q + 1))}
          disabled={quantity >= effectiveMax}
        >
          <Plus size={16} />
        </Button>
        {displayStockQuantity && maxQuantity > 0 && (
          <span className="ms-2 text-xs text-ecommerce-text-muted">
            {MeasureTypeViewer(maxQuantity, measureType)} {t('homepage.common.remaining')}
          </span>
        )}
      </div>
      {/* calculate and display total */}
      <span className="text-sm text-ecommerce-text-muted">
        {t('homepage.cart.total')}: <span className="font-bold text-ecommerce-text-primary">{ }</span>
      </span>
    </div>
  );
}
