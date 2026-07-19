'use client';

import { X, Plus, Minus, ShoppingBag, ShoppingCart, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { useCartStore, useRecentStore } from '../../_lib/store';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';
import { CheckoutSheet } from './checkout-sheet';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { GetImage } from '../../_lib/utils';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';
import { getCheapestVariant } from '../../_types/ProductDisplayModel';
import { Badge } from '../ui/badge';
import AttributeType from '@root/app/types/enums/AttributeType';

const PROMO_CODES: Record<string, { type: 'percentage' | 'freeship'; value: number; label: string }> = {
  WELCOME15: { type: 'percentage', value: 15, label: '15% off' },
  SAVE10: { type: 'percentage', value: 10, label: '10% off' },
  FREESHIP: { type: 'freeship', value: 0, label: 'Free shipping' },
};

function YouMightAlsoLike() {
  const { items } = useCartStore();
  const { items: recentItems } = useRecentStore();
  const t = useTranslations();

  // Get product suggestions based on recent views not already in cart
  const cartIds = new Set(items.map(i => i.id));
  const suggestions = recentItems
    .filter(ri => !cartIds.has(ri.id))
    .slice(0, 3);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-6 pt-4 border-t border-ecommerce-border">
      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles size={12} className="text-ecommerce-amber" />
        <p className="text-xs font-semibold text-ecommerce-text-muted uppercase tracking-wider">{t('homepage.cart.suggestions')}</p>
      </div>
      <div className="space-y-2">
        {suggestions.map((item) => {
          let cheapestVariant = getCheapestVariant(item.variants);
          return <motion.div
            key={cheapestVariant.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-ecommerce-surface-hover/60 hover:bg-ecommerce-surface-hover transition-colors cursor-pointer group"
            onClick={() => {
              useCartStore.getState().addItem({
                id: cheapestVariant.id, name: item.name, variant: cheapestVariant,
                image: item.imagePreview, categories: item.categories,
              });
              toast.success(t('homepage.cart.itemAdded', { name: item.name }));
            }}
          >
            <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-muted">
              <img src={GetImage(item.imagePreview)} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ecommerce-text-primary line-clamp-1">{item.name}</p>
              <p className="text-xs font-bold text-ecommerce-text-primary mt-0.5">{CurrencyViewer(cheapestVariant.sellPrice, CONFIG.DEFAULT_CURRENCY) ?? '0.00'}</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-ecommerce-red/10 text-ecommerce-red flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <ShoppingCart size={12} />
            </div>
          </motion.div>
        })}
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { items, isCartOpen, setCartOpen, updateQuantity, removeItem, totalItems, totalPrice, totalSavings } = useCartStore();
  const t = useTranslations();
  const total = totalItems();
  const price = totalPrice();
  const savings = totalSavings();

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Free shipping progress
  const freeShippingThreshold = 50;
  const progress = Math.min((price / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - price, 0);

  const handleApplyPromo = useCallback(() => {
    const code = promoCode.trim().toUpperCase();
    setPromoError('');

    if (!code) return;

    const promo = PROMO_CODES[code];
    if (!promo) {
      setPromoError(t('homepage.cart.invalidCoupon'));
      return;
    }

    if (promo.type === 'percentage') {
      const discountAmount = parseFloat(((price * promo.value) / 100).toFixed(2));
      setDiscount(discountAmount);
    } else {
      // Free shipping - no monetary discount, just free shipping
      setDiscount(0);
    }

    setAppliedCode(code);
    setIsPromoOpen(false);
    setPromoCode('');
  }, [promoCode, price, t]);

  const handleRemovePromo = useCallback(() => {
    setAppliedCode(null);
    setDiscount(0);
    setPromoError('');
  }, []);

  const handlePromoKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApplyPromo();
    }
  }, [handleApplyPromo]);

  const appliedPromo = appliedCode ? PROMO_CODES[appliedCode] : null;
  const finalPrice = price - discount;

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-white dark:bg-ecommerce-surface">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-ecommerce-border shrink-0">
          <SheetTitle className="flex items-center gap-2 text-ecommerce-text-primary">
            <div className="w-8 h-8 rounded-lg bg-ecommerce-red/10 flex items-center justify-center">
              <ShoppingBag size={16} className="text-ecommerce-red" />
            </div>
            <div className="flex items-center gap-2">
              {t('homepage.cart.title')}
              {total > 0 && (
                <span className="text-xs font-semibold text-white bg-ecommerce-red rounded-full px-2 py-0.5">{total}</span>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-16">
            <div className="w-20 h-20 rounded-full bg-ecommerce-surface-hover dark:bg-[#252836] flex items-center justify-center mb-4">
              <ShoppingBag size={32} className="text-ecommerce-text-muted" />
            </div>
            <h3 className="font-semibold text-ecommerce-text-primary text-lg">{t('homepage.cart.empty')}</h3>
            <p className="text-sm text-ecommerce-text-muted mt-1.5">{t('homepage.cart.emptyDesc')}</p>
            <Button
              className="mt-6 bg-ecommerce-red hover:bg-ecommerce-red/90 rounded-xl px-6 h-11 font-medium transition-all hover:scale-105 active:scale-95"
              onClick={() => setCartOpen(false)}
            >
              {t('homepage.cart.startShopping')}
            </Button>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress */}
            {price < freeShippingThreshold && (
              <div className="px-6 py-3 bg-ecommerce-amber/5 border-b border-ecommerce-border">
                <p className="text-xs text-ecommerce-text-secondary mb-1.5">
                  {t('homepage.cart.awayFromFree', { amount: `${CurrencyViewer(remainingForFreeShipping, CONFIG.DEFAULT_CURRENCY)}` })}
                </p>
                <div className="h-1.5 bg-ecommerce-border/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-ecommerce-amber to-ecommerce-emerald rounded-full"
                  />
                </div>
              </div>
            )}
            {price >= freeShippingThreshold && (
              <div className="px-6 py-2.5 bg-ecommerce-emerald/5 border-b border-ecommerce-border">
                <p className="text-xs text-ecommerce-emerald font-medium text-center">
                  🎉 {t('homepage.cart.freeShippingMsg')}
                </p>
              </div>
            )}

            <ScrollArea className="flex-1 px-6 py-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.variant.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4"
                  >
                    <div className="flex gap-3 bg-ecommerce-surface-hover dark:bg-[#252836] rounded-xl p-3 hover:ring-1 hover:ring-ecommerce-border transition-all">
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                        <img src={GetImage(item.image, true)} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-ecommerce-text-primary line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-ecommerce-text-muted mt-0.5">
                          {item.variant.productAttributes.map(attribute => (
                            <Badge key={attribute.id} className="bg-ecommerce-emerald/10 text-ecommerce-emerald border-0 text-xs font-semibold mx-0.5">
                              {attribute.displayName}
                            </Badge>

                            /*  attribute.attributeType == AttributeType.Color ? <span key={attribute.id}
                                className="inline-block w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-120 border-ecommerce-border hover:border-ecommerce-text-muted"
                                style={{ backgroundColor: 'var(--' + attribute.key + ')' }} />
                                : <Badge key={attribute.id} className="bg-ecommerce-emerald/10 text-ecommerce-emerald border-0 text-xs font-semibold mx-0.5">
                                  {attribute.displayName}
                                </Badge>*/
                          ))}


                        </p>
                        <p className="text-xs text-ecommerce-text-muted mt-0.5">{item.categories.map(x => x.name + ",")}</p>
                        {item.variant.oldSellPrice > 0 && item.variant.oldSellPrice > item.variant.sellPrice && (
                          <p className="text-[10px] text-ecommerce-emerald font-medium mt-0.5">
                            {t('homepage.cart.couponApplied', { amount: `${CurrencyViewer((item.variant.oldSellPrice - item.variant.sellPrice), CONFIG.DEFAULT_CURRENCY)}` })}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 bg-white dark:bg-ecommerce-surface rounded-lg border border-ecommerce-border">
                              <button
                                onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-ecommerce-surface-hover rounded-s-lg transition-colors"
                                aria-label={t('homepage.common.previous')}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-ecommerce-surface-hover rounded-e-lg transition-colors"
                                aria-label={t('homepage.common.next')}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="mx-2 text-sm ">
                              × {CurrencyViewer(item.variant.sellPrice, CONFIG.DEFAULT_CURRENCY)}
                            </span>
                          </div>

                          {/* Price */}
                          <div className="text-end">
                            <span className="text-md font-bold text-ecommerce-text-primary">
                              {CurrencyViewer(item.variant.sellPrice * item.quantity, CONFIG.DEFAULT_CURRENCY)}
                            </span>
                            {item.variant.oldSellPrice > 0 && (
                              <p className="text-[11px] text-ecommerce-text-muted line-through">
                                {CurrencyViewer(item.variant.oldSellPrice * item.quantity, CONFIG.DEFAULT_CURRENCY)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.variant.id)}
                        className="self-start p-1 text-ecommerce-text-muted hover:text-ecommerce-red transition-colors"
                        aria-label={t('homepage.cart.remove')}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Suggestions */}
              <YouMightAlsoLike />

              {/* Promo Code Section */}
              <div className="mt-4 pt-4 border-t border-ecommerce-border">
                {/* Applied code badge */}
                {appliedCode && appliedPromo && (
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ecommerce-emerald/10 text-ecommerce-emerald text-xs font-medium">
                      <span>{appliedCode}</span>
                      <span>·</span>
                      <span>{appliedPromo.label}</span>
                      {appliedPromo.type === 'percentage' && (
                        <>
                          <span>·</span>
                          <span>-{CurrencyViewer(discount, CONFIG.DEFAULT_CURRENCY)}</span>
                        </>
                      )}
                      <button
                        onClick={handleRemovePromo}
                        className="ms-0.5 hover:text-red-500 transition-colors"
                        aria-label={t('homepage.cart.remove')}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  </div>
                )}

                {/* Toggle button */}
                {!appliedCode && (
                  <button
                    onClick={() => {
                      setIsPromoOpen(!isPromoOpen);
                      setPromoError('');
                    }}
                    className="text-xs text-ecommerce-purple hover:text-ecommerce-purple/80 font-medium cursor-pointer flex items-center gap-1"
                  >
                    {t('homepage.cart.promoCode')}
                    {isPromoOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                )}

                {/* Expandable input */}
                <AnimatePresence>
                  {isPromoOpen && !appliedCode && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value);
                            setPromoError('');
                          }}
                          onKeyDown={handlePromoKeyDown}
                          placeholder={t('homepage.cart.promoCode')}
                          className="h-10 rounded-xl bg-ecommerce-surface-hover border border-ecommerce-border text-sm px-3 flex-1 outline-none focus:ring-2 focus:ring-ecommerce-purple/30 placeholder:text-ecommerce-text-muted text-ecommerce-text-primary"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className="h-10 px-4 bg-ecommerce-purple hover:bg-ecommerce-purple/90 text-white rounded-xl text-sm font-medium transition-colors shrink-0"
                        >
                          {t('homepage.cart.applyCode')}
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-xs text-red-500 mt-1.5">{promoError}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Footer */}
            <SheetFooter>
              {items.length > 0 && (
                <div className="border-t border-ecommerce-border px-6 py-4 shrink-0 bg-white dark:bg-ecommerce-surface space-y-3">
                  {savings > 0 && (
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-ecommerce-emerald/10 border border-ecommerce-emerald/10">
                      <span className="text-sm text-ecommerce-emerald font-medium">🎉 {t('homepage.cart.savings')}</span>
                      <span className="text-sm font-bold text-ecommerce-emerald">-{CurrencyViewer(savings, CONFIG.DEFAULT_CURRENCY)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ecommerce-text-secondary">{t('homepage.cart.subtotal')}</span>
                    <span className="text-xl font-bold text-ecommerce-text-primary">{CurrencyViewer(price, CONFIG.DEFAULT_CURRENCY)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ecommerce-emerald font-medium">{t('homepage.cart.savings')}</span>
                      <span className="text-sm font-bold text-ecommerce-emerald">-{CurrencyViewer(discount, CONFIG.DEFAULT_CURRENCY)}dddd</span>
                    </div>
                  )}

                  <p className="text-xs text-ecommerce-text-muted">
                    {(price >= freeShippingThreshold || appliedCode === 'FREESHIP')
                      ? `✅ ${t('homepage.cart.freeShippingMsg')}`
                      : ''}
                  </p>
                </div>
              )}
            </SheetFooter>
          </>
        )}
        <CheckoutSheet />
      </SheetContent>
    </Sheet>
  );
}