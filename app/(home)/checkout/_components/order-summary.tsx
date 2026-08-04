'use client';

import { useTranslations } from 'next-intl';
import { Lock, Shield, CheckCircle2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@(home)/_components/ui/card';
import { Button } from '@(home)/_components/ui/button';
import { Input } from '@(home)/_components/ui/input';
import { Separator } from '@(home)/_components/ui/separator';
import CartItem from '@root/app/(home)/_types/Order/CartItem';
import { GetImage } from '@(home)/_lib/utils';
import { VALID_PROMOS } from './types';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';
import Link from 'next/link';
import { Badge } from '../../_components/ui/badge';

interface OrderSummaryProps {
  items: CartItem[];
  appliedPromo: string | null;
  showPromoInput: boolean;
  promoInput: string;
  promoError: string;
  subtotal: number;
  savings: number;
  shippingCost: number;
  tax: number;
  discountAmount: number;
  total: number;
  onApplyPromo: () => void;
  onRemovePromo: () => void;
  onPromoInputChange: (value: string) => void;
  onPromoInputClearError: () => void;
  onShowPromoInput: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function OrderSummary({
  items,
  appliedPromo,
  showPromoInput,
  promoInput,
  promoError,
  subtotal,
  savings,
  shippingCost,
  tax,
  discountAmount,
  total,
  onApplyPromo,
  onRemovePromo,
  onPromoInputChange,
  onPromoInputClearError,
  onShowPromoInput,
  onKeyDown,
}: Readonly<OrderSummaryProps>) {
  const t = useTranslations('homepage.paymentPage');

  return (
    <Card className="border-ecommerce-border bg-white dark:bg-ecommerce-surface overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-ecommerce-text-primary">
          {t('orderSummary')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Compact items list */}
        <div className="space-y-3 max-h-64 overflow-y-auto pe-1">
          {items.map((item: CartItem) => (
            <div key={item.variant.id} className="flex items-center gap-3">
              <img
                src={GetImage(item.image)}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover border border-ecommerce-border shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.id}`} className="text-xs font-semibold text-ecommerce-text-primary truncate">
                  {item.name}
                </Link>
                {item.variant.productAttributes?.length > 0 && (
                  <p className="text-[11px] text-ecommerce-text-muted mt-0.5">
                    {item.variant?.productAttributes.map((attribute, index) => (
                      <span key={attribute.id} className={"bg-ecommerce-emerald/5 text-ecommerce-emerald border-0 px-1 rounded-md" + (index > 0 ? " mx-1" : "")}>
                        {attribute.displayName}
                      </span>
                    ))}
                  </p>
                )}
                <p className="text-[12px] text-ecommerce-text-muted font-medium">
                  {t("quantity")} {item.quantity}
                </p>
              </div>
              <span className="text-sm font-bold text-ecommerce-text-primary shrink-0">
                {CurrencyViewer((item.variant.sellPrice * item.quantity), CONFIG.DEFAULT_CURRENCY)}
              </span>
            </div>
          ))}
        </div>

        <Separator className="bg-ecommerce-border" />

        {/* Promo code */}
        <div>
          {!appliedPromo && !showPromoInput && (
            <button
              onClick={onShowPromoInput}
              className="text-xs font-medium text-ecommerce-red hover:underline"
            >
              {t('havePromoCode')}
            </button>
          )}
          {showPromoInput && !appliedPromo && (
            <div className="flex gap-2">
              <Input
                value={promoInput}
                onChange={(e) => { onPromoInputChange(e.target.value); onPromoInputClearError(); }}
                placeholder={t('enterCode')}
                className="h-9 text-xs rounded-lg bg-ecommerce-surface-hover border-ecommerce-border"
                onKeyDown={onKeyDown}
              />
              <Button
                onClick={onApplyPromo}
                size="sm"
                className="h-9 px-3 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-lg text-xs shrink-0"
              >
                {t('applyCode')}
              </Button>
            </div>
          )}
          {promoError && (
            <p className="text-[11px] text-red-500 mt-1">{promoError}</p>
          )}
          {appliedPromo && (
            <div className="flex items-center justify-between bg-ecommerce-emerald/10 border border-ecommerce-emerald/20 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-ecommerce-emerald" />
                <span className="text-xs font-medium text-ecommerce-emerald">
                  {appliedPromo}
                </span>
                {VALID_PROMOS[appliedPromo]?.type === 'percent' && (
                  <span className="text-[10px] text-ecommerce-emerald/70">
                    -{VALID_PROMOS[appliedPromo].value}%
                  </span>
                )}
              </div>
              <button
                onClick={onRemovePromo}
                className="text-[11px] font-medium text-red-500 hover:underline"
              >
                {t('removeCode')}
              </button>
            </div>
          )}
        </div>

        <Separator className="bg-ecommerce-border" />

        {/* Totals */}
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-ecommerce-text-muted">{t('subtotal')}</span>
            <span className="font-medium text-ecommerce-text-primary">{CurrencyViewer(subtotal, CONFIG.DEFAULT_CURRENCY)}</span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between">
              <span className="text-ecommerce-emerald">{t('youSave')}</span>
              <span className="font-medium text-ecommerce-emerald">
                -{CurrencyViewer(savings, CONFIG.DEFAULT_CURRENCY)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-ecommerce-text-muted">{t('shipping')}</span>
            <span className="font-medium text-ecommerce-text-primary">
              {shippingCost === 0 ? (
                <span className="text-ecommerce-emerald">{t('freeShipping')}</span>
              ) : (
                `${CurrencyViewer(shippingCost, CONFIG.DEFAULT_CURRENCY)}`
              )}
            </span>
          </div>
          {tax > 0 && <div className="flex justify-between">
            <span className="text-ecommerce-text-muted">{t('tax')}</span>
            <span className="font-medium text-ecommerce-text-primary">{CurrencyViewer(tax, CONFIG.DEFAULT_CURRENCY)}</span>
          </div>}
          {discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-ecommerce-emerald">{t('discount')}</span>
              <span className="font-medium text-ecommerce-emerald">
                -{CurrencyViewer(discountAmount, CONFIG.DEFAULT_CURRENCY)}
              </span>
            </div>
          )}
          <Separator className="bg-ecommerce-border" />
          <div className="flex justify-between">
            <span className="text-base font-bold text-ecommerce-text-primary">{t('total')}</span>
            <span className="text-xl font-extrabold text-ecommerce-red">
              {CurrencyViewer(total, CONFIG.DEFAULT_CURRENCY)}
            </span>
          </div>
        </div>

        {shippingCost > 0 && subtotal > 0 && (
          <p className="text-[11px] text-ecommerce-text-muted text-center">
            {t('shippingNote')}
          </p>
        )}

        <Separator className="bg-ecommerce-border" />

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="flex items-center gap-1.5 text-ecommerce-text-muted">
            <Lock size={14} />
            <span className="text-[11px] font-medium">{t('sslEncrypted')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-ecommerce-text-muted">
            <Shield size={14} />
            <span className="text-[11px] font-medium">{t('secureBadge')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
