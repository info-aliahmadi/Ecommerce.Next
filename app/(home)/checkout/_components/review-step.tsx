'use client';

import { useTranslations } from 'next-intl';
import {
  CreditCard, Shield, Truck, Lock, CheckCircle2,
  Edit3, Tag, ChevronLeft, Loader2, Minus, X,
  ChevronRight, Plus,
} from 'lucide-react';

import { Button } from '@(home)/_components/ui/button';
import { Input } from '@(home)/_components/ui/input';
import { Separator } from '@(home)/_components/ui/separator';
import CartItem from '@root/app/(home)/_types/Order/CartItem';
import { GetImage } from '@(home)/_lib/utils';
import { ShippingForm, PaymentForm, VALID_PROMOS } from './types';
import PaymentMethod from '@root/app/types/enums/PaymentMethod';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';
import { Badge } from '../../_components/ui/badge';
import Link from 'next/link';

interface ReviewStepProps {
  isRTL: boolean;
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
  stockIssues: Array<{
    productId: number;
    variantId: number;
    availableStock: number;
    cartQuantity: number;
  }>;
  onRemoveItem: (variantId: number) => void;
  onUpdateQuantity: (variantId: number, quantity: number) => void;
  placeOrderError: string | null;
  onClearPlaceOrderError: () => void;
}

export function ReviewStep({
  isRTL,
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
  stockIssues,
  onRemoveItem,
  onUpdateQuantity,
  placeOrderError,
  onClearPlaceOrderError,
}: Readonly<ReviewStepProps>) {
  const t = useTranslations('homepage.paymentPage');
  const tRoot = useTranslations();

  const getStockIssue = (variantId: number) => stockIssues.find(i => i.variantId === variantId);

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <section>
        <h3 className="text-lg font-bold text-ecommerce-text-primary mb-4">{t('orderItems')}</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto pe-1">
          {items.map((item: CartItem) => {
            const issue = getStockIssue(item.variant.id);
            const isOutOfStock = issue !== undefined;
            return (
              <div
                key={item.variant.id}
                className={`flex items-center gap-4 p-3 rounded-xl border ${isOutOfStock ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' : 'bg-ecommerce-surface-hover border-ecommerce-border'}`}
              >
                <img
                  src={GetImage(item.image)}
                  alt={item.name}
                  className={`w-16 h-16 rounded-lg object-cover border shrink-0 ${isOutOfStock ? 'border-red-200' : 'border-ecommerce-border'}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/products/${item.variant.productId}`} className="text-sm font-semibold text-ecommerce-text-primary truncate">
                      {item.name}
                    </Link>
                    {isOutOfStock && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 whitespace-nowrap">
                        {t('outOfStock')}
                      </span>
                    )}
                  </div>
                  {item.variant.productAttributes?.length > 0 && (
                    <p className="text-[11px] text-ecommerce-text-muted mt-1">
                      {item.variant?.productAttributes.map((attribute, index) => (
                        <Badge key={attribute.id} className={"bg-ecommerce-emerald/5 text-ecommerce-emerald border-0 text-xs" + (index > 0 ? " mx-1" : "")}>
                          {attribute.displayName}
                        </Badge>
                      ))}
                    </p>
                  )}
                  <p className="text-sm text-ecommerce-text-muted mt-2 font-medium">
                    <span className="text-ecommerce-text-primary"> {CurrencyViewer(item.variant.sellPrice, CONFIG.DEFAULT_CURRENCY)} × {item.quantity}</span>
                    {isOutOfStock && (
                      <span className="text-red-500 mr-1 p-1">
                        ({t('availableStock', { count: issue.availableStock })})
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                      className="w-7 h-7 rounded-md bg-ecommerce-surface-hover hover:bg-ecommerce-border flex items-center justify-center transition-colors cursor-pointer"
                      aria-label={tRoot('homepage.common.previous')}
                    >
                      <Minus size={14} />
                    </button>
                    <button
                      onClick={() => onUpdateQuantity(item.variant.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-md bg-ecommerce-surface-hover hover:bg-ecommerce-border flex items-center justify-center transition-colors cursor-pointer bg-ecommerce-border"
                      aria-label={tRoot('homepage.common.next')}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.variant.id)}
                      className="text-[12px] font-medium px-2 py-0.5 rounded-md bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 whitespace-nowrap cursor-pointer"
                    >
                      {t('removeItem')}
                    </button>
                  </div>
                </div>
                <span className={`text-sm font-bold shrink-0 ${isOutOfStock ? 'text-red-600' : 'text-ecommerce-text-primary'}`}>
                  {CurrencyViewer((item.variant.sellPrice * item.quantity), CONFIG.DEFAULT_CURRENCY)}
                </span>
              </div>
            );
          })}
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
              {payment.method === PaymentMethod.CreditCard ? (
                <CreditCard size={16} className="text-ecommerce-red" />
              ) : payment.method === PaymentMethod.PayPal ? (
                <Shield size={16} className="text-ecommerce-red" />
              ) : (
                <Truck size={16} className="text-ecommerce-red" />
              )}
            </div>
            <div>
              <p className="font-medium text-ecommerce-text-primary">
                {payment.method === PaymentMethod.CreditCard
                  ? t('creditCard')
                  : payment.method === PaymentMethod.PayPal
                    ? t('paypal')
                    : t('cashOnDelivery')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-ecommerce-border" />

      {/* Order Totals */}
      <section className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-ecommerce-text-muted">{t('subtotal')}</span>
          <span className="font-medium text-ecommerce-text-primary">{CurrencyViewer(subtotal, CONFIG.DEFAULT_CURRENCY)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between">
            <span className="text-ecommerce-emerald">{t('youSave')}</span>
            <span className="font-medium text-ecommerce-emerald">
              {CurrencyViewer(savings, CONFIG.DEFAULT_CURRENCY)}
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
        {/* <div className="flex justify-between">
          <span className="text-ecommerce-text-muted">{t('tax')} (8%)</span>
          <span className="font-medium text-ecommerce-text-primary">{CurrencyViewer(tax, CONFIG.DEFAULT_CURRENCY)}</span>
        </div> */}
        {discountAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-ecommerce-emerald">{t('discount')}</span>
            <span className="font-medium text-ecommerce-emerald">
              {CurrencyViewer(discountAmount, CONFIG.DEFAULT_CURRENCY)}
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

      {/* Place order error */}
      {placeOrderError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-2">
            <p className="text-sm font-medium text-red-700 dark:text-red-300">{placeOrderError}</p>
            <button
              onClick={onClearPlaceOrderError}
              className="text-xs text-red-500 hover:text-red-700 underline shrink-0"
            >
              {tRoot('homepage.common.remove')}
            </button>
          </div>
        </div>
      )}

      {/* Stock validation error */}
      {stockIssues.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">
            {t('stockValidationError')}
          </p>
          <ul className="space-y-1">
            {stockIssues.map(issue => (
              <li key={issue.variantId} className="text-xs text-red-600 dark:text-red-400">
                {items.find(i => i.variant.id === issue.variantId)?.name || `Product #${issue.productId}`}: {t('availableStock', { count: issue.availableStock })} {t('outOfStock')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Place Order Button */}
      <Button
        onClick={onPlaceOrder}
        disabled={isPlacing || stockIssues.length > 0}
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
            {t('placeOrder')} — {CurrencyViewer(total, CONFIG.DEFAULT_CURRENCY)}
          </>
        )}
      </Button>

      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => onGoToStep(2, -1)}
        className="w-full h-10 text-ecommerce-text-muted hover:text-ecommerce-text-primary hover:bg-ecommerce-surface-hover rounded-xl text-sm gap-1"
      >
        {isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        {t('step2')}
      </Button>
    </div>
  );
}
