'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import ProductAttributeDisplayModel from '../../../_types/Product/ProductAttributeDisplayModel';
import { getCheapestVariant } from '../../../_types/Product/ProductDisplayModel';
import AttributeType from '@root/app/types/enums/AttributeType';
import { SizeGuideModal } from '@root/app/(home)/_components/ecommerce/size-guide-modal';
import { Ruler } from 'lucide-react';
import ProductVariantDisplayModel from '@root/app/(home)/_types/Product/ProductVariantDisplayModel';
import { getAvailableStock } from '@root/app/(home)/_types/Product/InventoryDisplayModel';

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
  { type: AttributeType.Color, translationKey: 'fields.productAttribute.attributeTypes.Color', style: 'color' },
  { type: AttributeType.Size, translationKey: 'fields.productAttribute.attributeTypes.Size', style: 'button' },
  { type: AttributeType.Weight, translationKey: 'fields.productAttribute.attributeTypes.Weight', style: 'button' },
  { type: AttributeType.Length, translationKey: 'fields.productAttribute.attributeTypes.Length', style: 'button' },
  { type: AttributeType.Width, translationKey: 'fields.productAttribute.attributeTypes.Width', style: 'button' },
  { type: AttributeType.Height, translationKey: 'fields.productAttribute.attributeTypes.Height', style: 'button' },
  { type: AttributeType.Material, translationKey: 'fields.productAttribute.attributeTypes.Material', style: 'button' },
  { type: AttributeType.Pattern, translationKey: 'fields.productAttribute.attributeTypes.Pattern', style: 'button' },
  { type: AttributeType.Brand, translationKey: 'fields.productAttribute.attributeTypes.Brand', style: 'button' },
  { type: AttributeType.Model, translationKey: 'fields.productAttribute.attributeTypes.Model', style: 'button' },
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

function getAvailableKeys(
  variants: ProductVariantDisplayModel[],
  currentSelection: Map<AttributeType, VariantOption | null>,
  orderedTypes: AttributeType[],
  targetType: AttributeType
): Set<string> {
  const available = new Set<string>();
  const targetIndex = orderedTypes.indexOf(targetType);
  const selectedOptions = orderedTypes
    .slice(0, targetIndex)
    .map(type => [type, currentSelection.get(type)] as const)
    .filter((entry): entry is readonly [AttributeType, VariantOption] => entry[1] !== null);

  const inStockVariants = variants.filter(
    v =>
      getAvailableStock(v.productInventory) > 0 &&
      selectedOptions.every(([type, opt]) =>
        v.productAttributes?.some(
          attr => attr.attributeType === type && attr.key === opt.key,
        )
      ),
  );

  for (const v of inStockVariants) {
    for (const attr of v.productAttributes ?? []) {
      if (attr.attributeType === targetType) {
        available.add(attr.key);
      }
    }
  }
  return available;
}

function computeAutoSelection(
  variants: ProductVariantDisplayModel[],
  attributesByType: Map<AttributeType, VariantOption[]>,
  orderedTypes: AttributeType[],
  currentSelection: Map<AttributeType, VariantOption | null>,
  changedType: AttributeType,
  newValue: VariantOption
): Map<AttributeType, VariantOption | null> {
  // Build a partial selection with the changed value
  const partial = new Map<AttributeType, VariantOption | null>();
  for (const [type] of attributesByType) {
    partial.set(type, type === changedType ? newValue : currentSelection.get(type) ?? null);
  }

  // Prefer a variant that keeps the existing compatible selections.
  const selectedOptions = Array.from(partial.entries()).filter(
    ([, opt]) => opt !== null,
  ) as Array<[AttributeType, VariantOption]>;

  const fullyMatchingVariant = variants.find(v =>
    getAvailableStock(v.productInventory) > 0 &&
    selectedOptions.every(([type, opt]) =>
      v.productAttributes?.some(
        attr => attr.attributeType === type && attr.key === opt.key,
      )
    )
  );

  if (fullyMatchingVariant) {
    return partial;
  }

  // Find the first variant that matches the changed type's new value
  const matchingVariant = variants.find(v =>
    getAvailableStock(v.productInventory) > 0 &&
    v.productAttributes?.some(
      attr => attr.attributeType === changedType && attr.key === newValue.key,
    )
  );

  if (matchingVariant) {
    // Use this variant's attributes for all types
    for (const [type, options] of attributesByType) {
      if (type === changedType) continue;
      const matchAttr = matchingVariant.productAttributes?.find(
        attr => attr.attributeType === type
      );
      if (matchAttr) {
        const opt = options.find(o => o.key === matchAttr.key);
        if (opt) partial.set(type, opt);
      }
    }
  } else {
    // No matching variant — try to find compatible options for other types
    for (const [type, options] of attributesByType) {
      if (type === changedType) continue;
      const available = getAvailableKeys(variants, partial, orderedTypes, type);
      const current = partial.get(type);
      if (current && !available.has(current.key)) {
        const firstAvailable = options.find(o => available.has(o.key));
        partial.set(type, firstAvailable ?? null);
      }
    }
  }

  return partial;
}

export default function VariantSelector({ variants, onVariantChange }: Readonly<VariantSelectorProps>) {
  const t = useTranslations();
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
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
    const cheapest = getCheapestVariant(variants);
    for (const [type, options] of attributesByType) {
      const matchAttr = cheapest?.productAttributes?.find(attr => attr.attributeType === type);
      const matchOpt = matchAttr ? options.find(o => o.key === matchAttr.key) : null;
      initial.set(type, matchOpt ?? options[0] ?? null);
    }
    return initial;
  });

  useEffect(() => {
    setSelectedByType(() => {
      const initial = new Map<AttributeType, VariantOption | null>();
      const cheapest = getCheapestVariant(variants);
      for (const [type, options] of attributesByType) {
        const matchAttr = cheapest?.productAttributes?.find(attr => attr.attributeType === type);
        const matchOpt = matchAttr ? options.find(o => o.key === matchAttr.key) : null;
        initial.set(type, matchOpt ?? options[0] ?? null);
      }
      return initial;
    });
  }, [attributesByType, variants]);

  if (attributesByType.size === 0) return null;
  const orderedTypes = ATTRIBUTE_CONFIGS
    .map(config => config.type)
    .filter(type => attributesByType.has(type));

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
                {options.map((opt) => {
                  const available = getAvailableKeys(variants, selectedByType, orderedTypes, config.type);
                  const isAvailable = available.has(opt.key);
                  return (
                    <button
                      type='button'
                      key={opt.id}
                      onClick={() => {
                        if (!isAvailable) return;
                        const next = computeAutoSelection(variants, attributesByType, orderedTypes, selectedByType, config.type, opt);
                        setSelectedByType(next);
                        onVariantChange?.(next);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${!isAvailable
                        ? 'opacity-30 cursor-not-allowed border-ecommerce-border'
                        : selected?.id === opt.id
                          ? 'border-ecommerce-red ring-2 ring-ecommerce-red/20 scale-120 hover:scale-120'
                          : 'border-ecommerce-border hover:border-ecommerce-text-muted hover:scale-120'
                        }`}
                      style={{ backgroundColor: 'var(--' + opt.key + ')' }}
                      aria-label={opt.displayName}
                      title={opt.displayName}
                      disabled={!isAvailable}
                    />
                  );
                })}
              </div>
            </div>
          );
        }

        return (
          <div key={config.type} className="mt-4">
            <div className="flex justify-between gap-2 mb-2.5">
              {/* make seperate between div and button */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-ecommerce-text-primary">{label}</span>
                <span className="text-xs text-ecommerce-text-muted">:</span>
                <span className="text-sm text-ecommerce-text-secondary">{selected?.displayName}</span>
              </div>
              {/* Size Guide Button */}
              {config.type === AttributeType.Size &&
                (
                  <button
                    type='button'
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs text-ecommerce-purple hover:text-ecommerce-purple/80 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Ruler size={12} />
                    {t('homepage.quickView.sizeGuide')}
                  </button>
                )
              }
            </div>
            <div className="flex gap-2 flex-wrap">
              {options.map((opt) => {
                const available = getAvailableKeys(variants, selectedByType, orderedTypes, config.type);
                const isAvailable = available.has(opt.key);
                return (
                  <button
                    type='button'
                    key={opt.id}
                    onClick={() => {
                      if (!isAvailable) return;
                      const next = computeAutoSelection(variants, attributesByType, orderedTypes, selectedByType, config.type, opt);
                      setSelectedByType(next);
                      onVariantChange?.(next);
                    }}
                    className={`h-9 min-w-[36px] px-3 rounded-lg border text-sm font-medium transition-all duration-200 ${!isAvailable
                      ? 'opacity-30 cursor-not-allowed border-ecommerce-border text-ecommerce-text-muted line-through'
                      : selected?.id === opt.id
                        ? 'border-ecommerce-red bg-ecommerce-red/5 text-ecommerce-red'
                        : 'border-ecommerce-border text-ecommerce-text-secondary hover:border-ecommerce-text-muted hover:bg-ecommerce-surface-hover'
                      }`}
                    disabled={!isAvailable}
                  >
                    {opt.displayName}
                  </button>
                );
              })}
            </div>

            <SizeGuideModal open={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
          </div>

        );
      })}

      {/* Selected attributes summary */}
      {selectedEntries.length > 0 && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-ecommerce-surface-hover/60 border border-ecommerce-border/40">
          {selectedEntries.map((entry, i) => (
            <span key={entry.label}>
              {i > 0 && <span className="text-xs text-ecommerce-text-muted mx-1">/</span>}
              <span className="text-sm text-ecommerce-text-muted">{entry.label}: </span>
              <span className="text-sm text-ecommerce-text-secondary font-bold">{entry.value}</span>
            </span>
          ))}
        </div>
      )}
    </>
  );
}
