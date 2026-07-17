'use client';

import { useState, useMemo } from 'react';
import { Ruler } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ProductVariantDisplayModel from '../../../_types/ProductVariantDisplayModel';
import ProductAttributeDisplayModel from '../../../_types/ProductAttributeDisplayModel';
import AttributeType from '@root/app/types/enums/AttributeType';

interface VariantOption {
  id: number;
  displayName: string;
  key: string;
  imagePreview?: ProductAttributeDisplayModel['imagePreview'];
}

interface VariantSelectorProps {
  variants: ProductVariantDisplayModel[];
  onVariantChange?: (color: VariantOption | null, size: string | null) => void;
}

function getUniqueAttributes(
  variants: ProductVariantDisplayModel[],
  attributeType: AttributeType
): VariantOption[] {
  const seen = new Set<string>();
  const result: VariantOption[] = [];

  for (const variant of variants) {
    for (const attr of variant.productAttributes ?? []) {
      if (attr.attributeType === attributeType && !seen.has(attr.key)) {
        seen.add(attr.key);
        result.push({
          id: attr.id,
          displayName: attr.displayName,
          key: attr.key,
          imagePreview: attr.imagePreview,
        });
      }
    }
  }

  return result.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export default function VariantSelector({ variants, onVariantChange }: VariantSelectorProps) {
  const t = useTranslations();

  const availableColors = useMemo(
    () => getUniqueAttributes(variants, AttributeType.Color),
    [variants]
  );

  const availableSizes = useMemo(
    () => getUniqueAttributes(variants, AttributeType.Size),
    [variants]
  );

  const [selectedColor, setSelectedColor] = useState<VariantOption | null>(
    availableColors[0] ?? null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    availableSizes[0]?.key ?? null
  );

  const handleColorSelect = (color: VariantOption) => {
    setSelectedColor(color);
    onVariantChange?.(color, selectedSize);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    onVariantChange?.(selectedColor, size);
  };

  if (availableColors.length === 0 && availableSizes.length === 0) {
    return null;
  }

  return (
    <>
      {/* Color Variants */}
      {availableColors.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-sm font-medium text-ecommerce-text-primary">
              {t('homepage.quickView.color')}
            </span>
            <span className="text-xs text-ecommerce-text-muted">:</span>
            <span className="text-sm text-ecommerce-text-secondary">
              {selectedColor?.displayName}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {availableColors.map((color) => (
              <button
                key={color.id}
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  selectedColor?.id === color.id
                    ? 'border-ecommerce-red ring-2 ring-ecommerce-red/20 scale-110'
                    : 'border-ecommerce-border hover:border-ecommerce-text-muted'
                }`}
                style={{ backgroundColor: color.key }}
                aria-label={color.displayName}
                title={color.displayName}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Variants */}
      {availableSizes.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-ecommerce-text-primary">
                {t('homepage.quickView.size')}
              </span>
              <span className="text-xs text-ecommerce-text-muted">:</span>
              <span className="text-sm text-ecommerce-text-secondary">
                {selectedSize}
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {availableSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => handleSizeSelect(size.key)}
                className={`h-9 min-w-[36px] px-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  selectedSize === size.key
                    ? 'border-ecommerce-red bg-ecommerce-red/5 text-ecommerce-red'
                    : 'border-ecommerce-border text-ecommerce-text-secondary hover:border-ecommerce-text-muted hover:bg-ecommerce-surface-hover'
                }`}
              >
                {size.displayName}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
