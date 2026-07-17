'use client';

import { useState } from 'react';
import { Button } from '../../../_components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import MeasureType from '@root/app/types/enums/MeasureType';
import MeasureTypeViewer from '@root/utils/MeasureTypeViewer';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';

interface QuantitySelectorProps {
  measureType: MeasureType;
  displayStockQuantity: boolean;
  maxQuantity: number;
  price?: number;
  allowedQuantities?: boolean;
  orderMinimumQuantity?: number;
  orderMaximumQuantity?: number;
}

export default function QuantitySelector({
  measureType,
  maxQuantity,
  displayStockQuantity,
  price = 0,
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
    <div className="flex items-center gap-4 mt-5">
      <span className="text-sm font-medium text-ecommerce-text-primary"> {t('homepage.productDetail.quantity')}</span>
      <div className="flex items-center border border-ecommerce-border rounded-xl overflow-hidden">
        <button
          className="w-10 h-10 flex items-center justify-center hover:bg-ecommerce-surface-hover transition-colors"
          onClick={() => setQuantity((q) => Math.max(minQty, q - 1))}
          disabled={quantity <= minQty}
        >
          <Minus size={16} />
        </button>
        <span className="w-12 text-center text-sm font-semibold countdown-digit">{quantity}</span>
        <button
          className="w-10 h-10 flex items-center justify-center hover:bg-ecommerce-surface-hover transition-colors"
          onClick={() => setQuantity((q) => Math.min(effectiveMax, q + 1))}
          disabled={quantity >= effectiveMax}
        >
          <Plus size={16} />
        </button>
        {displayStockQuantity && maxQuantity > 0 && (
          <span className="ms-2 text-xs text-ecommerce-text-muted">
            {MeasureTypeViewer(maxQuantity, measureType)} {t('homepage.common.remaining')}
          </span>
        )}
      </div>
      {/* calculate and display total */}
      <span className="text-sm text-ecommerce-text-muted">
        {t('homepage.cart.total')}: <span className="font-bold text-ecommerce-text-primary">{CurrencyViewer(quantity * price, CONFIG.DEFAULT_CURRENCY)}</span>
      </span>
    </div>
  );
}
