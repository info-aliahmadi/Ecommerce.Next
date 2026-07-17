'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Shield, Truck, Lock, CheckCircle2, Check,
  ShoppingBag, ChevronRight, ChevronLeft, ArrowLeft,
  Package, Edit3, Download, Tag, Loader2,
} from 'lucide-react';

import { Footer } from '../_components/ecommerce/footer';
import { BackToTop } from '../_components/ecommerce/back-to-top';
import { MobileBottomNav } from '../_components/ecommerce/mobile-bottom-nav';
import { useCartStore } from '../_lib/store';

import { Button } from '../_components/ui/button';
import { Input } from '../_components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../_components/ui/card';
import { Separator } from '../_components/ui/separator';
import { Checkbox } from '../_components/ui/checkbox';
import { Label } from '../_components/ui/label';
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '../_components/ui/accordion';
import CartItem from '../_types/CartItem';
import { GetImage } from '../_lib/utils';

/* ──────────────────────────────────────────────────────────────── */

const VALID_PROMOS: Record<string, { type: 'percent'; value: number } | { type: 'fixed'; value: number }> = {
  WELCOME15: { type: 'percent', value: 15 },
  SAVE10: { type: 'fixed', value: 10 },
};

type CheckoutStep = 1 | 2 | 3 | 4;
type PaymentMethod = 'card' | 'paypal' | 'cod';

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  saveAddress: boolean;
}

interface PaymentForm {
  method: PaymentMethod;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

/* ──────────────────────────────────────────────────────────────── */

function formatCardNumber(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function generateOrderNumber() {
  return `SP-${Date.now().toString().slice(-8)}`;
}

/* ── Form field (extracted outside component to avoid re-creation) ── */

function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-ecommerce-text-secondary">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border text-sm ${error ? 'border-red-500 focus-visible:ring-red-500/20' : ''
          }`}
      />
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────── */

export default function CheckoutPage() {
  return (
    <CheckoutPageInner />
  );
}

/* ──────────────────────────────────────────────────────────────── */

function CheckoutPageInner() {
  const t = useTranslations('paymentPage');

  const { items, totalPrice, totalSavings, clearCart, totalItems } = useCartStore();

  // Step management
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPlacing, setIsPlacing] = useState(false);

  // Shipping form
  const [shipping, setShipping] = useState<ShippingForm>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', apartment: '', city: '', state: '', zipCode: '', country: '',
    saveAddress: false,
  });

  // Payment form
  const [payment, setPayment] = useState<PaymentForm>({
    method: 'card', cardholderName: '', cardNumber: '', expiryDate: '', cvc: '',
  });

  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);

  // Order confirmation
  const [orderNumber, setOrderNumber] = useState('');

  // Shipping field setter
  const setShippingField = useCallback(
    (field: keyof ShippingForm, value: string | boolean) =>
      setShipping((prev) => ({ ...prev, [field]: value })),
    [],
  );

  // Payment field setter
  const setPaymentField = useCallback(
    (field: keyof PaymentForm, value: string | PaymentMethod) =>
      setPayment((prev) => ({ ...prev, [field]: value })),
    [],
  );

  /* ── Calculations ─────────────────────────────────────────── */
  const subtotal = totalPrice();
  const savings = totalSavings();
  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;

  const discountAmount = useMemo(() => {
    if (!appliedPromo || !VALID_PROMOS[appliedPromo]) return 0;
    const promo = VALID_PROMOS[appliedPromo];
    if (promo.type === 'percent') return subtotal * (promo.value / 100);
    return promo.value;
  }, [appliedPromo, subtotal]);

  const total = subtotal + shippingCost + tax - discountAmount;

  /* ── Promo Code ───────────────────────────────────────────── */
  const handleApplyPromo = useCallback(() => {
    const code = promoInput.trim().toUpperCase();
    if (!VALID_PROMOS[code]) {
      setPromoError(t('homepage.invalidCode'));
      return;
    }
    setAppliedPromo(code);
    setPromoError('');
    setPromoInput('homepage.');
    setShowPromoInput(false);
  }, [promoInput, t]);

  const handleRemovePromo = useCallback(() => {
    setAppliedPromo(null);
    setPromoInput('homepage.');
  }, []);

  /* ── Validation ───────────────────────────────────────────── */
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateShipping = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!shipping.firstName.trim()) errs.firstName = 'Required';
    if (!shipping.lastName.trim()) errs.lastName = 'Required';
    if (!shipping.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email))
      errs.email = 'Valid email required';
    if (!shipping.phone.trim()) errs.phone = 'Required';
    if (!shipping.address.trim()) errs.address = 'Required';
    if (!shipping.city.trim()) errs.city = 'Required';
    if (!shipping.state.trim()) errs.state = 'Required';
    if (!shipping.zipCode.trim()) errs.zipCode = 'Required';
    if (!shipping.country.trim()) errs.country = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [shipping]);

  const validatePayment = useCallback((): boolean => {
    if (payment.method !== 'card') {
      setErrors({});
      return true;
    }
    const errs: Record<string, string> = {};
    if (!payment.cardholderName.trim()) errs.cardholderName = 'Required';
    const rawCard = payment.cardNumber.replace(/\s/g, '');
    if (!rawCard || rawCard.length < 15) errs.cardNumber = 'Valid card number required';
    if (!payment.expiryDate.trim() || payment.expiryDate.length < 5) errs.expiryDate = 'MM/YY';
    if (!payment.cvc.trim() || payment.cvc.length < 3) errs.cvc = '3+ digits';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [payment]);

  /* ── Step Navigation ──────────────────────────────────────── */
  const goToStep = useCallback((step: CheckoutStep, dir?: 1 | -1) => {
    setDirection(dir ?? (step > currentStep ? 1 : -1));
    setCurrentStep(step);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleContinueShipping = useCallback(() => {
    if (validateShipping()) goToStep(2);
  }, [validateShipping, goToStep]);

  const handleContinuePayment = useCallback(() => {
    if (validatePayment()) goToStep(3);
  }, [validatePayment, goToStep]);

  const handlePlaceOrder = useCallback(() => {
    setIsPlacing(true);
    const num = generateOrderNumber();
    setOrderNumber(num);
    setTimeout(() => {
      setIsPlacing(false);
      clearCart();
      goToStep(4, 1);
    }, 1500);
  }, [clearCart, goToStep]);

  /* ── Render helpers (functions, not components) ───────────── */

  const renderOrderSummarySidebar = useCallback(() => (
    <Card className="border-ecommerce-border bg-white dark:bg-ecommerce-surface overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-ecommerce-text-primary">
          {t('homepage.orderSummary')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Compact items list */}
        <div className="space-y-3 max-h-64 overflow-y-auto pe-1">
          {items.map((item: CartItem) => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={GetImage(item.image)}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover border border-ecommerce-border shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-ecommerce-text-primary truncate">
                  {item.name}
                </p>
                <p className="text-[11px] text-ecommerce-text-muted">
                  Qty {item.quantity}
                </p>
              </div>
              <span className="text-sm font-bold text-ecommerce-text-primary shrink-0">
                ${(item.variant.sellPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <Separator className="bg-ecommerce-border" />

        {/* Promo code */}
        <div>
          {!appliedPromo && !showPromoInput && (
            <button
              onClick={() => setShowPromoInput(true)}
              className="text-xs font-medium text-ecommerce-red hover:underline"
            >
              {t('homepage.havePromoCode')}
            </button>
          )}
          {showPromoInput && !appliedPromo && (
            <div className="flex gap-2">
              <Input
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
                placeholder={t('homepage.enterCode')}
                className="h-9 text-xs rounded-lg bg-ecommerce-surface-hover border-ecommerce-border"
                onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
              />
              <Button
                onClick={handleApplyPromo}
                size="sm"
                className="h-9 px-3 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-lg text-xs shrink-0"
              >
                {t('homepage.applyCode')}
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
                onClick={handleRemovePromo}
                className="text-[11px] font-medium text-red-500 hover:underline"
              >
                {t('homepage.removeCode')}
              </button>
            </div>
          )}
        </div>

        <Separator className="bg-ecommerce-border" />

        {/* Totals */}
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-ecommerce-text-muted">{t('homepage.subtotal')}</span>
            <span className="font-medium text-ecommerce-text-primary">${subtotal.toFixed(2)}</span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between">
              <span className="text-ecommerce-emerald">{t('homepage.youSave')}</span>
              <span className="font-medium text-ecommerce-emerald">
                -${savings.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-ecommerce-text-muted">{t('homepage.shipping')}</span>
            <span className="font-medium text-ecommerce-text-primary">
              {shippingCost === 0 ? (
                <span className="text-ecommerce-emerald">{t('homepage.freeShipping')}</span>
              ) : (
                `$${shippingCost.toFixed(2)}`
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ecommerce-text-muted">{t('homepage.tax')}</span>
            <span className="font-medium text-ecommerce-text-primary">${tax.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-ecommerce-emerald">{t('homepage.discount')}</span>
              <span className="font-medium text-ecommerce-emerald">
                -${discountAmount.toFixed(2)}
              </span>
            </div>
          )}
          <Separator className="bg-ecommerce-border" />
          <div className="flex justify-between">
            <span className="text-base font-bold text-ecommerce-text-primary">{t('homepage.total')}</span>
            <span className="text-xl font-extrabold text-ecommerce-red">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {shippingCost > 0 && subtotal > 0 && (
          <p className="text-[11px] text-ecommerce-text-muted text-center">
            {t('homepage.shippingNote')}
          </p>
        )}

        <Separator className="bg-ecommerce-border" />

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="flex items-center gap-1.5 text-ecommerce-text-muted">
            <Lock size={14} />
            <span className="text-[11px] font-medium">{t('homepage.sslEncrypted')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-ecommerce-text-muted">
            <Shield size={14} />
            <span className="text-[11px] font-medium">{t('homepage.secureBadge')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ), [items, appliedPromo, showPromoInput, promoInput, promoError, handleApplyPromo, handleRemovePromo, t, subtotal, savings, shippingCost, tax, discountAmount, total]);

  const renderMobileOrderSummary = useCallback(() => (
    <Accordion type="single" collapsible defaultValue="summary" className="md:hidden mb-6">
      <AccordionItem value="summary" className="border-ecommerce-border">
        <AccordionTrigger className="text-sm font-bold text-ecommerce-text-primary hover:no-underline py-3">
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} />
            {t('homepage.cartSummary')} ({totalItems()} {t('homepage.itemsCount', { count: totalItems() })})
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {renderOrderSummarySidebar()}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ), [renderOrderSummarySidebar, t, totalItems]);

  const renderStepShipping = useCallback(() => (
    <div className="space-y-6">
      {/* Contact Info */}
      <section>
        <h3 className="text-lg font-bold text-ecommerce-text-primary mb-4">{t('homepage.contactInfo')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="firstName"
            label={t('homepage.firstName')}
            value={shipping.firstName}
            onChange={(v) => setShippingField('firstName', v)}
            placeholder="John"
            error={errors.firstName}
          />
          <FormField
            id="lastName"
            label={t('homepage.lastName')}
            value={shipping.lastName}
            onChange={(v) => setShippingField('lastName', v)}
            placeholder="Doe"
            error={errors.lastName}
          />
          <FormField
            id="email"
            label={t('homepage.email')}
            value={shipping.email}
            onChange={(v) => setShippingField('email', v)}
            placeholder="john@example.com"
            type="email"
            error={errors.email}
          />
          <FormField
            id="phone"
            label={t('homepage.phone')}
            value={shipping.phone}
            onChange={(v) => setShippingField('phone', v)}
            placeholder="+1 (234) 567-890"
            type="tel"
            error={errors.phone}
          />
        </div>
      </section>

      <Separator className="bg-ecommerce-border" />

      {/* Delivery Address */}
      <section>
        <h3 className="text-lg font-bold text-ecommerce-text-primary mb-4">{t('homepage.deliveryAddress')}</h3>
        <div className="space-y-4">
          <FormField
            id="address"
            label={t('homepage.address')}
            value={shipping.address}
            onChange={(v) => setShippingField('address', v)}
            placeholder="123 Main Street"
            error={errors.address}
          />
          <FormField
            id="apartment"
            label={t('homepage.apartment')}
            value={shipping.apartment}
            onChange={(v) => setShippingField('apartment', v)}
            placeholder="Apt 4B"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <FormField
              id="city"
              label={t('homepage.city')}
              value={shipping.city}
              onChange={(v) => setShippingField('city', v)}
              placeholder="New York"
              error={errors.city}
            />
            <FormField
              id="state"
              label={t('homepage.state')}
              value={shipping.state}
              onChange={(v) => setShippingField('state', v)}
              placeholder="NY"
              error={errors.state}
            />
            <FormField
              id="zipCode"
              label={t('homepage.zipCode')}
              value={shipping.zipCode}
              onChange={(v) => setShippingField('zipCode', v)}
              placeholder="10001"
              error={errors.zipCode}
            />
          </div>
          <FormField
            id="country"
            label={t('homepage.country')}
            value={shipping.country}
            onChange={(v) => setShippingField('country', v)}
            placeholder="United States"
            error={errors.country}
          />
          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="saveAddress"
              checked={shipping.saveAddress}
              onCheckedChange={(checked) => setShippingField('saveAddress', !!checked)}
              className="border-ecommerce-border data-[state=checked]:bg-ecommerce-red data-[state=checked]:border-ecommerce-red"
            />
            <Label htmlFor="saveAddress" className="text-xs text-ecommerce-text-secondary cursor-pointer select-none">
              {t('homepage.saveAddress')}
            </Label>
          </div>
        </div>
      </section>

      {/* Continue Button */}
      <Button
        onClick={handleContinueShipping}
        className="w-full h-12 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-[1.01] active:scale-95"
      >
        {t('homepage.step2')}
        <ChevronRight size={16} />
      </Button>
    </div>
  ), [shipping, errors, setShippingField, t, handleContinueShipping]);

  const renderStepPayment = useCallback(() => {
    const paymentMethods: { value: PaymentMethod; label: string; icon: typeof CreditCard; desc?: string }[] = [
      { value: 'card', label: t('homepage.creditCard'), icon: CreditCard },
      { value: 'paypal', label: t('homepage.paypal'), icon: Shield },
      { value: 'cod', label: t('homepage.cashOnDelivery'), icon: Truck, desc: t('homepage.codNote') },
    ];

    return (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-bold text-ecommerce-text-primary mb-1">{t('homepage.selectPayment')}</h3>
          <p className="text-sm text-ecommerce-text-muted">{t('homepage.securePayment')}</p>
        </section>

        {/* Payment method cards */}
        <div className="space-y-3">
          {paymentMethods.map((pm) => (
            <button
              key={pm.value}
              onClick={() => setPaymentField('method', pm.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-start group ${payment.method === pm.value
                  ? 'border-ecommerce-red bg-ecommerce-red/5'
                  : 'border-ecommerce-border hover:border-ecommerce-red/50 hover:bg-ecommerce-surface-hover'
                }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors shrink-0 ${payment.method === pm.value
                    ? 'bg-ecommerce-red/10'
                    : 'bg-ecommerce-surface-hover group-hover:bg-ecommerce-red/5'
                  }`}
              >
                <pm.icon
                  size={20}
                  className={
                    payment.method === pm.value
                      ? 'text-ecommerce-red'
                      : 'text-ecommerce-text-secondary group-hover:text-ecommerce-red'
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ecommerce-text-primary">{pm.label}</p>
                {pm.desc && <p className="text-xs text-ecommerce-text-muted mt-0.5">{pm.desc}</p>}
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${payment.method === pm.value
                    ? 'border-ecommerce-red bg-ecommerce-red'
                    : 'border-ecommerce-border'
                  }`}
              >
                {payment.method === pm.value && <Check size={12} className="text-white" />}
              </div>
            </button>
          ))}
        </div>

        {/* Card form (shown when Credit Card selected) */}
        <AnimatePresence>
          {payment.method === 'card' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-2">
                <FormField
                  id="cardholderName"
                  label={t('homepage.cardholderName')}
                  value={payment.cardholderName}
                  onChange={(v) => setPaymentField('cardholderName', v)}
                  placeholder="John Doe"
                  error={errors.cardholderName}
                />
                <FormField
                  id="cardNumber"
                  label={t('homepage.cardNumber')}
                  value={payment.cardNumber}
                  onChange={(v) => setPaymentField('cardNumber', formatCardNumber(v))}
                  placeholder="4242 4242 4242 4242"
                  error={errors.cardNumber}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    id="expiryDate"
                    label={t('homepage.expiryDate')}
                    value={payment.expiryDate}
                    onChange={(v) => setPaymentField('expiryDate', formatExpiry(v))}
                    placeholder="MM/YY"
                    error={errors.expiryDate}
                  />
                  <FormField
                    id="cvc"
                    label={t('homepage.cvc')}
                    value={payment.cvc}
                    onChange={(v) => setPaymentField('cvc', v.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    error={errors.cvc}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => goToStep(1, -1)}
            className="flex-1 h-12 rounded-xl font-semibold text-sm gap-2 border-ecommerce-border text-ecommerce-text-primary hover:bg-ecommerce-surface-hover"
          >
            <ChevronLeft size={16} />
            {t('homepage.step1')}
          </Button>
          <Button
            onClick={handleContinuePayment}
            className="flex-1 h-12 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-[1.01] active:scale-95"
          >
            {t('homepage.step3')}
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    );
  }, [payment, errors, setPaymentField, t, goToStep, handleContinuePayment]);

  const renderStepReview = useCallback(() => (
    <div className="space-y-6">
      {/* Order Items */}
      <section>
        <h3 className="text-lg font-bold text-ecommerce-text-primary mb-4">{t('homepage.orderItems')}</h3>
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
          <h4 className="text-sm font-bold text-ecommerce-text-primary">{t('homepage.deliveryAddress')}</h4>
          <button
            onClick={() => goToStep(1, -1)}
            className="text-xs font-medium text-ecommerce-red hover:underline flex items-center gap-1"
          >
            <Edit3 size={12} />
            {t('homepage.editShipping')}
          </button>
        </div>
        <div className="p-3 rounded-xl bg-ecommerce-surface-hover border border-ecommerce-border text-sm text-ecommerce-text-secondary space-y-1">
          <p className="font-medium text-ecommerce-text-primary">
            {shipping.firstName} {shipping.lastName}
          </p>
          <p>{shipping.address}{shipping.apartment ? `, ${shipping.apartment}` : ''}</p>
          <p>
            {shipping.city}, {shipping.state} {shipping.zipCode}
          </p>
          <p>{shipping.country}</p>
          <p>{shipping.email}</p>
        </div>
      </section>

      <Separator className="bg-ecommerce-border" />

      {/* Payment Method Summary */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-ecommerce-text-primary">{t('homepage.selectPayment')}</h4>
          <button
            onClick={() => goToStep(2, -1)}
            className="text-xs font-medium text-ecommerce-red hover:underline flex items-center gap-1"
          >
            <Edit3 size={12} />
            {t('homepage.editPayment')}
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
                  ? t('homepage.creditCard')
                  : payment.method === 'paypal'
                    ? t('homepage.paypal')
                    : t('homepage.cashOnDelivery')}
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
          <span className="text-ecommerce-text-muted">{t('homepage.subtotal')}</span>
          <span className="font-medium text-ecommerce-text-primary">${subtotal.toFixed(2)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between">
            <span className="text-ecommerce-emerald">{t('homepage.youSave')}</span>
            <span className="font-medium text-ecommerce-emerald">
              -${savings.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-ecommerce-text-muted">{t('homepage.shipping')}</span>
          <span className="font-medium text-ecommerce-text-primary">
            {shippingCost === 0 ? (
              <span className="text-ecommerce-emerald">{t('homepage.freeShipping')}</span>
            ) : (
              `$${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-ecommerce-text-muted">{t('homepage.tax')} (8%)</span>
          <span className="font-medium text-ecommerce-text-primary">${tax.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-ecommerce-emerald">{t('homepage.discount')}</span>
            <span className="font-medium text-ecommerce-emerald">
              -${discountAmount.toFixed(2)}
            </span>
          </div>
        )}
        <Separator className="bg-ecommerce-border" />
        <div className="flex justify-between">
          <span className="text-base font-bold text-ecommerce-text-primary">{t('homepage.total')}</span>
          <span className="text-xl font-extrabold text-ecommerce-red">
            ${total.toFixed(2)}
          </span>
        </div>
      </section>

      {/* Promo code in review step */}
      <section>
        {!appliedPromo && !showPromoInput && (
          <button
            onClick={() => setShowPromoInput(true)}
            className="text-xs font-medium text-ecommerce-red hover:underline flex items-center gap-1"
          >
            <Tag size={12} />
            {t('homepage.havePromoCode')}
          </button>
        )}
        {showPromoInput && !appliedPromo && (
          <div className="flex gap-2">
            <Input
              value={promoInput}
              onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
              placeholder={t('homepage.enterCode')}
              className="h-10 text-sm rounded-xl bg-ecommerce-surface-hover border-ecommerce-border"
              onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
            />
            <Button
              onClick={handleApplyPromo}
              className="h-10 px-5 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl text-sm font-medium shrink-0"
            >
              {t('homepage.applyCode')}
            </Button>
          </div>
        )}
        {promoError && <p className="text-[11px] text-red-500 mt-1.5">{promoError}</p>}
        {appliedPromo && (
          <div className="flex items-center justify-between bg-ecommerce-emerald/10 border border-ecommerce-emerald/20 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-ecommerce-emerald" />
              <span className="text-xs font-medium text-ecommerce-emerald">
                {t('homepage.codeApplied')} ({appliedPromo})
              </span>
            </div>
            <button
              onClick={handleRemovePromo}
              className="text-[11px] font-medium text-red-500 hover:underline"
            >
              {t('homepage.removeCode')}
            </button>
          </div>
        )}
      </section>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-6 py-2">
        <div className="flex items-center gap-1.5 text-ecommerce-text-muted">
          <Lock size={14} />
          <span className="text-xs font-medium">{t('homepage.sslEncrypted')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-ecommerce-text-muted">
          <Shield size={14} />
          <span className="text-xs font-medium">{t('homepage.secureBadge')}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        onClick={handlePlaceOrder}
        disabled={isPlacing}
        className="w-full h-14 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-bold text-base gap-2.5 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPlacing ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            {t('homepage.placingOrder')}
          </>
        ) : (
          <>
            <Lock size={18} />
            {t('homepage.placeOrder')} — ${total.toFixed(2)}
          </>
        )}
      </Button>

      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => goToStep(2, -1)}
        className="w-full h-10 text-ecommerce-text-muted hover:text-ecommerce-text-primary hover:bg-ecommerce-surface-hover rounded-xl text-sm gap-1"
      >
        <ChevronLeft size={14} />
        {t('homepage.step2')}
      </Button>
    </div>
  ), [items, shipping, payment, subtotal, savings, shippingCost, tax, discountAmount, total, appliedPromo, showPromoInput, promoInput, promoError, isPlacing, t, goToStep, handleApplyPromo, handleRemovePromo, handlePlaceOrder]);

  const renderStepConfirmation = useCallback(() => (
    <div className="flex flex-col items-center text-center py-8 px-4">
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-ecommerce-emerald/15 flex items-center justify-center mb-6"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, delay: 0.3 }}
        >
          <CheckCircle2 size={48} className="text-ecommerce-emerald" />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl sm:text-3xl font-extrabold text-ecommerce-text-primary mb-2"
      >
        {t('homepage.orderPlaced')}
      </motion.h1>

      <motion.p
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-ecommerce-text-muted max-w-md mb-8"
      >
        {t('homepage.orderPlacedDesc')}
      </motion.p>

      {/* Order Number */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-sm p-4 rounded-xl bg-ecommerce-surface-hover border border-ecommerce-border mb-6"
      >
        <p className="text-xs text-ecommerce-text-muted mb-1">{t('homepage.orderNumber', { number: orderNumber }).replace(`Order #${orderNumber}`, '') || 'Order Number'}</p>
        <p className="text-lg font-bold text-ecommerce-text-primary font-mono">{orderNumber}</p>
      </motion.div>

      {/* Estimated delivery */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-3 p-4 rounded-xl bg-ecommerce-emerald/10 border border-ecommerce-emerald/20 mb-6"
      >
        <Package size={20} className="text-ecommerce-emerald shrink-0" />
        <div className="text-start">
          <p className="text-sm font-semibold text-ecommerce-emerald">{t('homepage.estimatedDelivery')}</p>
          <p className="text-xs text-ecommerce-emerald/70">{t('homepage.deliveryDays')}</p>
        </div>
      </motion.div>

      {/* Email confirmation */}
      <motion.p
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-ecommerce-text-muted mb-8"
      >
        {t('homepage.emailConfirmation', { email: shipping.email || 'your email' })}
      </motion.p>

      {/* Action buttons */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
      >
        <Button className="flex-1 h-12 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-105">
          <Truck size={16} />
          {t('homepage.trackOrder')}
        </Button>
        <Link href="/products" className="flex-1">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl font-semibold text-sm gap-2 border-ecommerce-border text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-all hover:scale-105"
          >
            <ShoppingBag size={16} />
            {t('homepage.continueShopping')}
          </Button>
        </Link>
      </motion.div>

      {/* Extra links */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="flex items-center gap-4 mt-8"
      >
        <button className="flex items-center gap-1.5 text-xs text-ecommerce-text-muted hover:text-ecommerce-red transition-colors">
          <Download size={14} />
          {t('homepage.downloadInvoice')}
        </button>
        <Separator orientation="vertical" className="h-4 bg-ecommerce-border" />
        <button className="flex items-center gap-1.5 text-xs text-ecommerce-text-muted hover:text-ecommerce-red transition-colors">
          {t('homepage.needHelp')}?
        </button>
      </motion.div>

      {/* Need help */}
      <motion.p
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="text-[11px] text-ecommerce-text-muted mt-6"
      >
        {t('homepage.contactSupport')}
      </motion.p>
    </div>
  ), [t, orderNumber, shipping.email]);

  /* ── Empty Cart ───────────────────────────────────────────── */
  if (items.length === 0 && currentStep < 4) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-ecommerce-surface">
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-24 h-24 rounded-full bg-ecommerce-surface-hover flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-ecommerce-text-muted" />
            </div>
            <h1 className="text-2xl font-extrabold text-ecommerce-text-primary mb-2">
              {t('homepage.emptyCart')}
            </h1>
            <p className="text-ecommerce-text-muted mb-8">{t('homepage.emptyCartDesc')}</p>
            <Link href="/products">
              <Button className="h-12 px-8 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-105">
                <ShoppingBag size={16} />
                {t('homepage.goShopping')}
              </Button>
            </Link>
          </motion.div>
        </main>
        <div className="mt-auto">
          <Footer />
        </div>
        <BackToTop />
        <MobileBottomNav />
      </div>
    );
  }

  /* ── Step progress data ───────────────────────────────────── */
  const steps = [
    { num: 1 as const, label: t('homepage.step1') },
    { num: 2 as const, label: t('homepage.step2') },
    { num: 3 as const, label: t('homepage.step3') },
    { num: 4 as const, label: t('homepage.step4') },
  ];

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-ecommerce-surface">
      {/* Breadcrumb bar */}
      <div className="border-b border-ecommerce-border bg-ecommerce-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <Link
              href="/products"
              className="text-ecommerce-text-muted hover:text-ecommerce-text-primary transition-colors"
            >
              {t('homepage.breadcrumbHome')}
            </Link>
            <ChevronRight size={14} className="text-ecommerce-text-muted" />
            <span className="text-ecommerce-text-muted">{t('homepage.breadcrumbCart')}</span>
            <ChevronRight size={14} className="text-ecommerce-text-muted" />
            <span className="font-medium text-ecommerce-text-primary">{t('homepage.breadcrumbCheckout')}</span>
          </nav>
        </div>
      </div>

      {/* Page header */}
      <div className="bg-ecommerce-surface border-b border-ecommerce-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-4">
            {currentStep < 4 && (
              <Link href="/products" className="hidden sm:block">
                <button className="w-9 h-9 rounded-lg bg-ecommerce-surface-hover flex items-center justify-center hover:bg-ecommerce-border transition-colors">
                  <ArrowLeft size={16} className="text-ecommerce-text-secondary" />
                </button>
              </Link>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-ecommerce-text-primary">
                {currentStep === 4 ? t('homepage.orderConfirmed') : t('homepage.title')}
              </h1>
              <p className="text-xs text-ecommerce-text-muted mt-0.5 hidden sm:block">
                {t('homepage.itemsInCart', { count: totalItems() })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {currentStep < 4 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Step Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                {steps.map((s, i) => (
                  <div key={s.num} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${currentStep > s.num
                            ? 'bg-ecommerce-emerald text-white'
                            : currentStep === s.num
                              ? 'bg-ecommerce-red text-white shadow-lg shadow-ecommerce-red/25'
                              : 'bg-ecommerce-surface-hover text-ecommerce-text-muted border border-ecommerce-border'
                          }`}
                      >
                        {currentStep > s.num ? <CheckCircle2 size={16} /> : s.num}
                      </div>
                      <span
                        className={`text-[11px] sm:text-xs mt-1.5 font-medium whitespace-nowrap ${currentStep === s.num
                            ? 'text-ecommerce-red'
                            : currentStep > s.num
                              ? 'text-ecommerce-emerald'
                              : 'text-ecommerce-text-muted'
                          }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`w-10 sm:w-20 lg:w-28 h-0.5 mx-2 sm:mx-3 mb-5 transition-colors duration-300 ${currentStep > s.num ? 'bg-ecommerce-emerald' : 'bg-ecommerce-border'
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Order Summary (collapsible accordion) */}
            {renderMobileOrderSummary()}

            {/* Main layout: content + sidebar */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main content (left) */}
              <div className="flex-1 min-w-0">
                <Card className="border-ecommerce-border bg-white dark:bg-ecommerce-surface">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={currentStep}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -40 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        {currentStep === 1 && renderStepShipping()}
                        {currentStep === 2 && renderStepPayment()}
                        {currentStep === 3 && renderStepReview()}
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>

              {/* Sticky sidebar (desktop only) */}
              <div className="hidden md:block w-full lg:w-[380px] xl:w-[400px] shrink-0">
                <div className="lg:sticky lg:top-6">
                  {renderOrderSummarySidebar()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Step - full width */}
        {currentStep === 4 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Card className="border-ecommerce-border bg-white dark:bg-ecommerce-surface">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                {renderStepConfirmation()}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
      <BackToTop />
      <MobileBottomNav />
    </div>
  );
}