'use client';

import { useState } from 'react';
import { Button } from '../../../_components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function QuantitySelector({
  maxQuantity,
}: {
  maxQuantity: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const t = useTranslations('');

  return (
    <div>
      <label className="text-sm font-medium text-ecommerce-text-primary mb-2 block">
        {t('homepage.productDetail.quantity')}
      </label>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-lg border-ecommerce-border"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={quantity <= 1}
        >
          <Minus size={16} />
        </Button>
        <div className="h-10 w-14 flex items-center justify-center border border-ecommerce-border rounded-lg text-sm font-medium text-ecommerce-text-primary">
          {quantity}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-lg border-ecommerce-border"
          onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
          disabled={quantity >= maxQuantity}
        >
          <Plus size={16} />
        </Button>
        {maxQuantity > 0 && (
          <span className="ms-2 text-xs text-ecommerce-text-muted">
            {maxQuantity} {t('homepage.common.remaining')}
          </span>
        )}
      </div>
    </div>
  );
}
