'use client';

import { useTranslations } from 'next-intl';
import {
  CreditCard, Shield, Truck, Lock, CheckCircle2,
  Edit3, Tag, ChevronLeft, Loader2,
} from 'lucide-react';

import { Button } from '@(home)/_components/ui/button';
import { Input } from '@(home)/_components/ui/input';
import { Separator } from '@(home)/_components/ui/separator';
import CartItem from '@(home)/_types/CartItem';
import { GetImage } from '@(home)/_lib/utils';
import { ShippingForm, PaymentForm, VALID_PROMOS } from './types';

interface ReviewStepProps {
  items: CartItem[];
  shipping: ShippingForm;
  payment: PaymentForm;
  subtotal: number;
  savings: number;
  shippingCost: number;
  tax: number;
  discountAmount: number;
  total: number;
  appliedPromo: string | null;
  showPromoInput: boolean;
  promoInput: string;
  promoError: string;
  isPlacing: boolean;
  onGoToStep: (step: 1 | 2 | 3 | 4, dir?: 1 | -1) => void;
  onApplyPromo: () => void;
  onRemovePromo: () => void;
  onPlaceOrder: () => void;
}

export function ReviewStep({
  items,
  shipping,
  payment,
  subtotal,
  savings,
  shippingCost,
  tax,
  discountAmount,
  total,
  appliedPromo,
  showPromoInput,
  promoInput,
  promoError,
  isPlacing,
  onGoToStep,
  onApplyPromo,
  onRemovePromo,
  onPlaceOrder,
}: ReviewStepProps) {
  const t = useTranslations('homepage.paymentPage');

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <section>
        <h3 className="text-lg font-bold text-ecommerce-text-primary mb-4">{t('orderItems')}</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto pe-1">
          {items.map((item: CartItem) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-ecommerce-surface-hover border border-ecommerce-border"
            >
              <img
                src={GetImage(item.image)}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover border border-ecommerce-border shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ecommerce-text-primary truncate">
                  {item.name}
                </p>
                <p className="text-xs text-ecommerce-text-muted mt-0.5">
                  ${item.variant.sellPrice.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <span className="text-sm font-bold text-ecommerce-text-primary shrink-0">
                ${(item.variant.sellPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Separator className="bg-ecommerce-border" />

      {/* Shipping Address Summary */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-ecommerce-text-primary">{t('deliveryAddress')}</h4>
          <button
            onClick={() => onGoToStep(1, -1)}
            className="text-xs font-medium text-ecommerce-red hover:underline flex items-center gap-1"
          >
            <Edit3 size={12} />
            {t('editShipping')}
          </button>
        </div>
        <div className="p-3 rounded-xl bg-ecommerce-surface-hover border border-ecommerce-border text-sm text-ecommerce-text-secondary space-y-1">
          <p className="font-medium text-ecommerce-text-primary">
            {shipping.fullName}
          </p>
          <p>{shipping.address.address1}</p>
          <p>
            {shipping.address.city}, {shipping.address.stateProvinceName} {shipping.address.zipPostalCode}
          </p>
          <p>{shipping.address.countryName}</p>
          <p>{shipping.email}</p>
          {shipping.note && (
            <p className="text-xs italic mt-2 pt-2 border-t border-ecommerce-border">
              {shipping.note}
            </p>
          )}
        </div>
      </section>

      <Separator className="bg-ecommerce-border" />

      {/* Payment Method Summary */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-ecommerce-text-primary">{t('selectPayment')}</h4>
          <button
            onClick={() => onGoToStep(2, -1)}
            className="text-xs font-medium text-ecommerce-red hover:underline flex items-center gap-1"
          >
            <Edit3 size={12} />
            {t('editPayment')}
          </button>
        </div>
        <div className="p-3 rounded-xl bg-ecommerce-surface-hover border border-ecommerce-border text-sm text-ecommerce-text-secondary">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-ecommerce-red/10 flex items-center justify-center">
              {payment.method === 'card' ? (
                <CreditCard size={16} className="text-ecommerce-red" />
              ) : payment.method === 'paypal' ? (
                <Shield size={16} className="text-ecommerce-red" />
              ) : (
                <Truck size={16} className="text-ecommerce-red" />
              )}
            </div>
            <div>
              <p className="font-medium text-ecommerce-text-primary">
                {payment.method === 'card'
                  ? t('creditCard')
                  : payment.method === 'paypal'
                    ? t('paypal')
                    : t('cashOnDelivery')}
              </p>
              {payment.method === 'card' && payment.cardNumber && (
                <p className="text-xs text-ecommerce-text-muted mt-0.5">
                  **** {payment.cardNumber.replace(/\s/g, '').slice(-4)}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-ecommerce-border" />

      {/* Order Totals */}
      <section className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-ecommerce-text-muted">{t('subtotal')}</span>
          <span className="font-medium text-ecommerce-text-primary">${subtotal.toFixed(2)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between">
            <span className="text-ecommerce-emerald">{t('youSave')}</span>
            <span className="font-medium text-ecommerce-emerald">
              -${savings.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-ecommerce-text-muted">{t('shipping')}</span>
          <span className="font-medium text-ecommerce-text-primary">
            {shippingCost === 0 ? (
              <span className="text-ecommerce-emerald">{t('freeShipping')}</span>
            ) : (
              `$${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-ecommerce-text-muted">{t('tax')} (8%)</span>
          <span className="font-medium text-ecommerce-text-primary">${tax.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-ecommerce-emerald">{t('discount')}</span>
            <span className="font-medium text-ecommerce-emerald">
              -${discountAmount.toFixed(2)}
            </span>
          </div>
        )}
        <Separator className="bg-ecommerce-border" />
        <div className="flex justify-between">
          <span className="text-base font-bold text-ecommerce-text-primary">{t('total')}</span>
          <span className="text-xl font-extrabold text-ecommerce-red">
            ${total.toFixed(2)}
          </span>
        </div>
      </section>

      {/* Promo code in review step */}
      <section>
        {!appliedPromo && !showPromoInput && (
          <button
            onClick={() => onGoToStep(3)}
            className="text-xs font-medium text-ecommerce-red hover:underline flex items-center gap-1"
          >
            <Tag size={12} />
            {t('havePromoCode')}
          </button>
        )}
        {showPromoInput && !appliedPromo && (
          <div className="flex gap-2">
            <Input
              value={promoInput}
              onChange={(e) => { /* handled by parent */ }}
              placeholder={t('enterCode')}
              className="h-10 text-sm rounded-xl bg-ecommerce-surface-hover border-ecommerce-border"
              onKeyDown={(e) => e.key === 'Enter' && onApplyPromo()}
            />
            <Button
              onClick={onApplyPromo}
              className="h-10 px-5 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl text-sm font-medium shrink-0"
            >
              {t('applyCode')}
            </Button>
          </div>
        )}
        {promoError && <p className="text-[11px] text-red-500 mt-1.5">{promoError}</p>}
        {appliedPromo && (
          <div className="flex items-center justify-between bg-ecommerce-emerald/10 border border-ecommerce-emerald/20 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-ecommerce-emerald" />
              <span className="text-xs font-medium text-ecommerce-emerald">
                {t('codeApplied')} ({appliedPromo})
              </span>
            </div>
            <button
              onClick={onRemovePromo}
              className="text-[11px] font-medium text-red-500 hover:underline"
            >
              {t('removeCode')}
            </button>
          </div>
        )}
      </section>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-6 py-2">
        <div className="flex items-center gap-1.5 text-ecommerce-text-muted">
          <Lock size={14} />
          <span className="text-xs font-medium">{t('sslEncrypted')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-ecommerce-text-muted">
          <Shield size={14} />
          <span className="text-xs font-medium">{t('secureBadge')}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        onClick={onPlaceOrder}
        disabled={isPlacing}
        className="w-full h-14 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-bold text-base gap-2.5 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPlacing ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            {t('placingOrder')}
          </>
        ) : (
          <>
            <Lock size={18} />
            {t('placeOrder')} — ${total.toFixed(2)}
          </>
        )}
      </Button>

      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => onGoToStep(2, -1)}
        className="w-full h-10 text-ecommerce-text-muted hover:text-ecommerce-text-primary hover:bg-ecommerce-surface-hover rounded-xl text-sm gap-1"
      >
        <ChevronLeft size={14} />
        {t('step2')}
      </Button>
    </div>
  );
}
