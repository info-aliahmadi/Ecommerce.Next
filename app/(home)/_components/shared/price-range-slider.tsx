"use client";

import { Slider } from "../ui/slider";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import PriceInput from "./price-Input";
import CurrencyViewer, { GetCurrencySymbol } from "@root/utils/CurrencyViewer";
import CONFIG from "@root/config";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";

export interface PriceRangeSliderProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  onCommit?: (value: [number, number]) => void;
  min?: number;
  max: number;
  step: number;
  disabled?: boolean;
  minStepsBetweenThumbs?: number;
  showDiscount?: boolean;
  discountChecked?: boolean;
  onDiscountChange?: (checked: boolean) => void;
  discountLabel?: string;
  className?: string;
}

export function PriceRangeSlider({
  value,
  onValueChange,
  onCommit,
  min = 0,
  max,
  step,
  disabled = false,
  minStepsBetweenThumbs,
  showDiscount = false,
  discountChecked = false,
  onDiscountChange,
  discountLabel,
  className,
}: Readonly<PriceRangeSliderProps>) {
  const t = useTranslations();
  const [internalValue, setInternalValue] = useState<[number, number]>(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onCommit?.(internalValue);
    }, 1000);
    return () => clearTimeout(debounceRef.current);
  }, [internalValue, onCommit]);

  const handleSliderChange = (v: number[]) => {
    const next: [number, number] = [v[0], v[1]];
    setInternalValue(next);
    onValueChange(next);
  };

  const handleSliderCommit = (v: number[]) => {
    const next: [number, number] = [v[0], v[1]];
    setInternalValue(next);
    onValueChange(next);
    onCommit?.(next);
  };

  const handleMinChange = (raw: string) => {
    const num = raw === "" ? "" : String(Math.max(0, Number(raw) || 0));
    const numVal = num === "" ? min : Number(num);
    const next: [number, number] = [numVal, internalValue[1]];
    setInternalValue(next);
    onValueChange(next);
  };

  const handleMaxChange = (raw: string) => {
    const num = raw === "" ? "" : String(Math.min(max, Number(raw) || max));
    const numVal = num === "" ? max : Number(num);
    const next: [number, number] = [internalValue[0], numVal];
    setInternalValue(next);
    onValueChange(next);
  };

  return (
    <div className={className + " ltr-direction"}>
      <div className="flex items-center justify-between text-sm pb-2">
        <span className="text-ecommerce-text-primary font-medium">{CurrencyViewer(internalValue[0], CONFIG.DEFAULT_CURRENCY)}</span>
        <span className="text-ecommerce-text-primary font-medium">{CurrencyViewer(internalValue[1], CONFIG.DEFAULT_CURRENCY)}</span>
      </div>
      <Slider
        value={internalValue}
        onValueChange={handleSliderChange}
        onValueCommit={handleSliderCommit}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
        disabled={disabled}
        className="w-full"
      />
      <div className="flex items-center gap-2 pt-3">
        <div className="flex-1">
          <Label className="text-[10px] text-ecommerce-text-muted uppercase tracking-wider mb-1 block">
            {t('homepage.catalog.priceMin')}
          </Label>
          <div className="relative">
            <span className="absolute start-2.5 top-1/2 -translate-y-1/2 text-xs text-ecommerce-text-muted">
              {GetCurrencySymbol(CONFIG.DEFAULT_CURRENCY)}
            </span>
            <PriceInput
              value={internalValue[0]}
              onChange={(value) => handleMinChange(value as any)}
              className="w-full h-9 ps-10 pe-2 rounded-lg bg-ecommerce-surface border border-ecommerce-border text-sm text-ecommerce-text-primary focus:outline-none focus:ring-2 focus:ring-ecommerce-red/30"
              min={min}
              max={max - 1}
            />
          </div>
        </div>
        <span className="text-ecommerce-text-muted mt-4">–</span>
        <div className="flex-1">
          <Label className="text-[10px] text-ecommerce-text-muted uppercase tracking-wider mb-1 block">
            {t('homepage.catalog.priceMax')}
          </Label>
          <div className="relative">
            <span className="absolute start-2.5 top-1/2 -translate-y-1/2 text-xs text-ecommerce-text-muted">
              {GetCurrencySymbol(CONFIG.DEFAULT_CURRENCY)}
            </span>
            <PriceInput
              value={internalValue[1]}
              onChange={(value) => handleMaxChange(value as any)}
              className="w-full h-9 ps-6 pe-2 rounded-lg bg-ecommerce-surface border border-ecommerce-border text-sm text-ecommerce-text-primary focus:outline-none focus:ring-2 focus:ring-ecommerce-red/30"
              min={min}
              max={max}
            />
          </div>
        </div>
      </div>
      {showDiscount && (
        <label className="flex items-center gap-2.5 cursor-pointer group pt-2">
          <Checkbox
            checked={discountChecked}
            onCheckedChange={(checked) => onDiscountChange?.(checked === true)}
            className="rounded-md data-[state=checked]:bg-ecommerce-red data-[state=checked]:border-ecommerce-red"
          />
          <span className="text-sm text-ecommerce-text-secondary group-hover:text-ecommerce-text-primary transition-colors">
            {discountLabel}
          </span>
        </label>
      )}
    </div>
  );
}
