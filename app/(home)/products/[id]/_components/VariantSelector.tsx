'use client';

import { useState, useMemo } from 'react';
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

interface AttributeTypeConfig {
  type: AttributeType;
  translationKey: string;
  style: 'color' | 'button';
}

const ATTRIBUTE_CONFIGS: AttributeTypeConfig[] = [
  { type: AttributeType.Color, translationKey: 'homepage.quickView.color', style: 'color' },
  { type: AttributeType.Size, translationKey: 'homepage.quickView.size', style: 'button' },
  { type: AttributeType.Weight, translationKey: 'homepage.quickView.weight', style: 'button' },
  { type: AttributeType.Length, translationKey: 'homepage.quickView.length', style: 'button' },
  { type: AttributeType.Width, translationKey: 'homepage.quickView.width', style: 'button' },
  { type: AttributeType.Height, translationKey: 'homepage.quickView.height', style: 'button' },
  { type: AttributeType.Material, translationKey: 'homepage.quickView.material', style: 'button' },
  { type: AttributeType.Pattern, translationKey: 'homepage.quickView.pattern', style: 'button' },
  { type: AttributeType.Brand, translationKey: 'homepage.quickView.brand', style: 'button' },
  { type: AttributeType.Model, translationKey: 'homepage.quickView.model', style: 'button' },
];

interface VariantSelectorProps {
  variants: ProductVariantDisplayModel[];
  onVariantChange?: (selectedByType: Map<AttributeType, VariantOption | null>) => void;
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

  const attributesByType = useMemo(() => {
    const map = new Map<AttributeType, VariantOption[]>();
    for (const config of ATTRIBUTE_CONFIGS) {
      const options = getUniqueAttributes(variants, config.type);
      if (options.length > 0) {
        map.set(config.type, options);
      }
    }
    return map;
  }, [variants]);

  const [selectedByType, setSelectedByType] = useState<Map<AttributeType, VariantOption | null>>(() => {
    const initial = new Map<AttributeType, VariantOption | null>();
    for (const [type, options] of attributesByType) {
      initial.set(type, options[0] ?? null);
    }
    return initial;
  });

  if (attributesByType.size === 0) return null;

  const selectedEntries = ATTRIBUTE_CONFIGS
    .filter(config => attributesByType.has(config.type))
    .map(config => ({
      label: t(config.translationKey),
      value: selectedByType.get(config.type)?.displayName ?? null,
    }))
    .filter(e => e.value);

  return (
    <>
      {ATTRIBUTE_CONFIGS.map((config) => {
        const options = attributesByType.get(config.type);
        if (!options || options.length === 0) return null;

        const selected = selectedByType.get(config.type) ?? null;
        const label = t(config.translationKey);

        if (config.style === 'color') {
          return (
            <div key={config.type} className="mt-5">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-sm font-medium text-ecommerce-text-primary">{label}</span>
                <span className="text-xs text-ecommerce-text-muted">:</span>
                <span className="text-sm text-ecommerce-text-secondary">{selected?.displayName}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      const next = new Map(selectedByType).set(config.type, opt);
                      setSelectedByType(next);
                      onVariantChange?.(next);
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                      selected?.id === opt.id
                        ? 'border-ecommerce-red ring-2 ring-ecommerce-red/20 scale-110'
                        : 'border-ecommerce-border hover:border-ecommerce-text-muted'
                    }`}
                    style={{ backgroundColor: opt.key }}
                    aria-label={opt.displayName}
                    title={opt.displayName}
                  />
                ))}
              </div>
            </div>
          );
        }

        return (
          <div key={config.type} className="mt-4">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-sm font-medium text-ecommerce-text-primary">{label}</span>
              <span className="text-xs text-ecommerce-text-muted">:</span>
              <span className="text-sm text-ecommerce-text-secondary">{selected?.displayName}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedByType(prev => new Map(prev).set(config.type, opt))}
                  className={`h-9 min-w-[36px] px-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    selected?.id === opt.id
                      ? 'border-ecommerce-red bg-ecommerce-red/5 text-ecommerce-red'
                      : 'border-ecommerce-border text-ecommerce-text-secondary hover:border-ecommerce-text-muted hover:bg-ecommerce-surface-hover'
                  }`}
                >
                  {opt.displayName}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Selected attributes summary */}
      {selectedEntries.length > 0 && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-ecommerce-surface-hover/60 border border-ecommerce-border/40">
          {selectedEntries.map((entry, i) => (
            <span key={entry.label}>
              {i > 0 && <span className="text-xs text-ecommerce-text-muted mx-1">/</span>}
              <span className="text-xs text-ecommerce-text-muted">{entry.label}: </span>
              <span className="text-xs text-ecommerce-text-secondary font-medium">{entry.value}</span>
            </span>
          ))}
        </div>
      )}
    </>
  );
}
