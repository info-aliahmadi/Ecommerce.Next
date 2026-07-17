'use client';

import { useState, useEffect } from 'react';
import { useCartStore, useUIStore } from '../../_lib/store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import {
  CreditCard, Truck, CheckCircle2, ChevronRight, ChevronLeft,
  Shield, Lock, MapPin, Package, ArrowLeft, Sparkles, PartyPopper,
  Home, Mail, Phone, Building2, Globe, BadgeCheck, Clock,
  ShoppingCart, CreditCardIcon, Banknote, ChevronDown, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Confetti } from '../ecommerce/confetti';
import { useTranslations } from 'next-intl';
import { useLocaleStore, RTL_LOCALES } from '../../_lib/store';
import { GetImage } from '../../_lib/utils';

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  saveAddress: boolean;
}

interface PaymentForm {
  method: 'card' | 'paypal' | 'cod';
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
}

export function CheckoutPage() {
  const { items, totalPrice, totalSavings, clearCart } = useCartStore();
  const { goHome } = useUIStore();
  const t = useTranslations();
  const { locale } = useLocaleStore();
  const isRTL = RTL_LOCALES.includes(locale);
  const mounted = useMounted();

  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [shipping, setShipping] = useState<ShippingForm>({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', apartment: '', city: '', state: '', zip: '',
    country: 'US', saveAddress: true,
  });

  const [payment, setPayment] = useState<PaymentForm>({
    method: 'card', cardNumber: '', cardName: '', expiry: '', cvc: '',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  const price = totalPrice();
  const savings = totalSavings();
  const shippingCost = shippingMethod === 'express' ? 9.99 : (price >= 50 ? 0 : 5.99);
  const tax = price * 0.08;
  const total = price + shippingCost + tax;

  const steps = [
    { label: t('homepage.checkoutPage.shipping'), icon: MapPin },
    { label: t('homepage.checkoutPage.payment'), icon: CreditCard },
    { label: t('homepage.checkoutPage.review'), icon: CheckCircle2 },
  ];

  const validateShipping = (): boolean => {
    if (!shipping.firstName.trim() || !shipping.lastName.trim()) {
      toast.error(t('homepage.checkoutPage.nameRequired'));
      return false;
    }
    if (!shipping.email.trim() || !shipping.email.includes('@')) {
      toast.error(t('homepage.checkoutPage.emailRequired'));
      return false;
    }
    if (!shipping.street.trim()) {
      toast.error(t('homepage.checkoutPage.addressRequired'));
      return false;
    }
    if (!shipping.city.trim() || !shipping.state.trim() || !shipping.zip.trim()) {
      toast.error(t('homepage.checkoutPage.cityStateZip'));
      return false;
    }
    if (!shipping.phone.trim()) {
      toast.error(t('homepage.checkoutPage.phoneRequired'));
      return false;
    }
    return true;
  };

  const validatePayment = (): boolean => {
    if (payment.method === 'card') {
      if (payment.cardNumber.replace(/\s/g, '').length < 16) {
        toast.error(t('homepage.checkoutPage.cardNumberInvalid'));
        return false;
      }
      if (!payment.cardName.trim()) {
        toast.error(t('homepage.checkoutPage.cardNameRequired'));
        return false;
      }
      if (payment.expiry.length < 5) {
        toast.error(t('homepage.checkoutPage.expiryInvalid'));
        return false;
      }
      if (payment.cvc.length < 3) {
        toast.error(t('homepage.checkoutPage.cvcInvalid'));
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !validateShipping()) return;
    if (step === 1 && !validatePayment()) return;
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsComplete(true);
    setShowConfetti(true);
    setOrderNumber(`SP-${Date.now().toString().slice(-8)}`);
    setTimeout(() => clearCart(), 500);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2);
    return v;
  };

  // Empty cart redirect
  if (mounted && items.length === 0 && !isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-ecommerce-surface-hover flex items-center justify-center mb-6">
          <ShoppingCart size={40} className="text-ecommerce-text-muted" />
        </div>
        <h2 className="text-2xl font-bold text-ecommerce-text-primary mb-2">{t('homepage.checkoutPage.emptyCart')}</h2>
        <p className="text-ecommerce-text-muted mb-8 max-w-sm">{t('homepage.checkoutPage.emptyCartDesc')}</p>
        <Button
          onClick={goHome}
          className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl px-8 h-12 font-semibold text-sm gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles size={16} className={isRTL ? 'order-last' : ''} />
          {t('homepage.checkout.continueShopping')}
        </Button>
      </div>
    );
  }

  // Order success view
  if (isComplete) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Confetti trigger={showConfetti} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-ecommerce-emerald/15 flex items-center justify-center mx-auto mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <PartyPopper size={44} className="text-ecommerce-emerald" />
            </motion.div>
          </motion.div>
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-ecommerce-text-primary mb-3"
          >
            {t('homepage.checkoutPage.orderSuccessTitle')}
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-ecommerce-text-muted mb-8 max-w-sm mx-auto leading-relaxed"
          >
            {t('homepage.checkout.orderSuccessDesc')}
          </motion.p>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-ecommerce-surface-hover rounded-2xl p-5 mb-6 inline-block"
          >
            <p className="text-sm text-ecommerce-text-muted mb-1">{t('homepage.checkoutPage.orderNumber')}</p>
            <p className="text-xl font-extrabold text-ecommerce-text-primary font-mono tracking-wider">{orderNumber}</p>
          </motion.div>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-ecommerce-emerald/8 border border-ecommerce-emerald/15 rounded-xl p-4 mb-8 flex items-center gap-3 justify-center"
          >
            <Package size={20} className="text-ecommerce-emerald shrink-0" />
            <div className="text-start">
              <p className="text-sm font-semibold text-ecommerce-emerald">{t('homepage.checkout.estimatedDelivery')}</p>
              <p className="text-xs text-ecommerce-emerald/70">{t('homepage.checkout.orderConfirmationEmail')}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              onClick={goHome}
              className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl px-8 h-12 font-semibold text-sm gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles size={16} className={isRTL ? 'order-last' : ''} />
              {t('homepage.checkout.continueShopping')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ecommerce-text-muted mb-6">
        <button onClick={goHome} className="hover:text-ecommerce-text-primary transition-colors flex items-center gap-1">
          <Home size={14} />
          {t('homepage.checkoutPage.home')}
        </button>
        <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
        <span className="text-ecommerce-text-primary font-medium">{t('homepage.checkout.title')}</span>
      </nav>

      {/* Step indicator - desktop */}
      <div className="hidden sm:flex items-center justify-center mb-10">
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${i < step ? 'bg-ecommerce-emerald text-white' :
                  i === step ? 'bg-ecommerce-red text-white shadow-lg shadow-ecommerce-red/25' :
                    'bg-ecommerce-surface-hover text-ecommerce-text-muted'
                  }`}>
                  {i < step ? <CheckCircle2 size={18} /> : <s.icon size={18} />}
                </div>
                <span className={`text-xs mt-2 font-medium ${i === step ? 'text-ecommerce-red' : i < step ? 'text-ecommerce-emerald' : 'text-ecommerce-text-muted'
                  }`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-20 sm:w-32 h-0.5 mx-3 mb-5 transition-colors duration-300 rounded-full ${i < step ? 'bg-ecommerce-emerald' : 'bg-ecommerce-border'
                  }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile step indicator */}
      <div className="sm:hidden mb-6">
        <div className="flex items-center justify-between bg-ecommerce-surface-hover rounded-xl p-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${'bg-ecommerce-red text-white'
              }`}>
              {step + 1}
            </div>
            <span className="text-sm font-medium text-ecommerce-text-primary">{steps[step].label}</span>
          </div>
          <span className="text-xs text-ecommerce-text-muted">
            {step + 1} / {steps.length}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Form */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
              transition={{ duration: 0.25 }}
            >
              {/* Step 1: Shipping */}
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-ecommerce-text-primary mb-1">
                      {t('homepage.checkoutPage.shippingInfo')}
                    </h2>
                    <p className="text-sm text-ecommerce-text-muted">{t('homepage.checkout.enterAddress')}</p>
                  </div>

                  {/* Contact info */}
                  <div className="bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5 sm:p-6 space-y-5">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail size={16} className="text-ecommerce-purple" />
                      <h3 className="text-sm font-semibold text-ecommerce-text-primary">{t('homepage.checkoutPage.contactInfo')}</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">
                          {t('homepage.checkout.firstName')} *
                        </Label>
                        <Input
                          value={shipping.firstName}
                          onChange={(e) => setShipping(s => ({ ...s, firstName: e.target.value }))}
                          placeholder="John"
                          className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">
                          {t('homepage.checkout.lastName')} *
                        </Label>
                        <Input
                          value={shipping.lastName}
                          onChange={(e) => setShipping(s => ({ ...s, lastName: e.target.value }))}
                          placeholder="Doe"
                          className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">
                          {t('homepage.checkout.email')} *
                        </Label>
                        <Input
                          type="email"
                          value={shipping.email}
                          onChange={(e) => setShipping(s => ({ ...s, email: e.target.value }))}
                          placeholder="john@example.com"
                          className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">
                          {t('homepage.checkout.phone')} *
                        </Label>
                        <Input
                          type="tel"
                          value={shipping.phone}
                          onChange={(e) => setShipping(s => ({ ...s, phone: e.target.value }))}
                          placeholder="+1 (234) 567-890"
                          className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping address */}
                  <div className="bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5 sm:p-6 space-y-5">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={16} className="text-ecommerce-purple" />
                      <h3 className="text-sm font-semibold text-ecommerce-text-primary">{t('homepage.checkoutPage.shippingAddress')}</h3>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">
                        {t('homepage.checkout.streetAddress')} *
                      </Label>
                      <Input
                        value={shipping.street}
                        onChange={(e) => setShipping(s => ({ ...s, street: e.target.value }))}
                        placeholder="123 Main Street"
                        className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">
                        {t('homepage.checkoutPage.apartment')}
                      </Label>
                      <Input
                        value={shipping.apartment}
                        onChange={(e) => setShipping(s => ({ ...s, apartment: e.target.value }))}
                        placeholder="Apt, suite, unit, etc. (optional)"
                        className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">
                          {t('homepage.checkout.city')} *
                        </Label>
                        <Input
                          value={shipping.city}
                          onChange={(e) => setShipping(s => ({ ...s, city: e.target.value }))}
                          placeholder="New York"
                          className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">
                          {t('homepage.checkout.state')} *
                        </Label>
                        <Input
                          value={shipping.state}
                          onChange={(e) => setShipping(s => ({ ...s, state: e.target.value }))}
                          placeholder="NY"
                          className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <Label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">
                          {t('homepage.checkout.zipCode')} *
                        </Label>
                        <Input
                          value={shipping.zip}
                          onChange={(e) => setShipping(s => ({ ...s, zip: e.target.value }))}
                          placeholder="10001"
                          className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">
                        {t('homepage.checkoutPage.country')}
                      </Label>
                      <div className="relative">
                        <Globe size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted" />
                        <Input
                          value={shipping.country}
                          onChange={(e) => setShipping(s => ({ ...s, country: e.target.value }))}
                          placeholder="US"
                          className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border ps-10"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Checkbox
                        id="saveAddress"
                        checked={shipping.saveAddress}
                        onCheckedChange={(checked) => setShipping(s => ({ ...s, saveAddress: checked === true }))}
                        className="data-[state=checked]:bg-ecommerce-purple data-[state=checked]:border-ecommerce-purple"
                      />
                      <Label htmlFor="saveAddress" className="text-sm text-ecommerce-text-secondary cursor-pointer">
                        {t('homepage.checkoutPage.saveAddress')}
                      </Label>
                    </div>
                  </div>

                  {/* Shipping method */}
                  <div className="bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5 sm:p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck size={16} className="text-ecommerce-purple" />
                      <h3 className="text-sm font-semibold text-ecommerce-text-primary">{t('homepage.checkoutPage.shippingMethod')}</h3>
                    </div>
                    <RadioGroup value={shippingMethod} onValueChange={(v) => setShippingMethod(v as 'standard' | 'express')} className="space-y-3">
                      <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-ecommerce-purple bg-ecommerce-purple/5' : 'border-ecommerce-border hover:border-ecommerce-border'
                        }`}>
                        <RadioGroupItem value="standard" className="data-[state=checked]:border-ecommerce-purple data-[state=checked]:text-ecommerce-purple" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Truck size={16} className="text-ecommerce-text-secondary" />
                            <span className="text-sm font-semibold text-ecommerce-text-primary">{t('homepage.checkoutPage.standardShipping')}</span>
                          </div>
                          <p className="text-xs text-ecommerce-text-muted mt-0.5">{t('homepage.checkoutPage.standardShippingDesc')}</p>
                        </div>
                        <span className="text-sm font-bold text-ecommerce-text-primary">
                          {price >= 50 ? (
                            <span className="text-ecommerce-emerald">{t('homepage.common.free')}</span>
                          ) : '$5.99'}
                        </span>
                      </label>
                      <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-ecommerce-purple bg-ecommerce-purple/5' : 'border-ecommerce-border hover:border-ecommerce-border'
                        }`}>
                        <RadioGroupItem value="express" className="data-[state=checked]:border-ecommerce-purple data-[state=checked]:text-ecommerce-purple" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-ecommerce-text-secondary" />
                            <span className="text-sm font-semibold text-ecommerce-text-primary">{t('homepage.quickView.shippingInfo.express')}</span>
                          </div>
                          <p className="text-xs text-ecommerce-text-muted mt-0.5">{t('homepage.checkoutPage.expressShippingDesc')}</p>
                        </div>
                        <span className="text-sm font-bold text-ecommerce-text-primary">$9.99</span>
                      </label>
                    </RadioGroup>
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="ghost"
                      onClick={goHome}
                      className="text-ecommerce-text-muted hover:text-ecommerce-text-primary gap-1"
                    >
                      <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
                      {t('homepage.checkoutPage.backToShopping')}
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl px-6 h-11 font-semibold text-sm gap-2 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      {t('homepage.checkoutPage.continueToPayment')}
                      <ChevronRight size={16} className={isRTL ? 'rotate-180' : ''} />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setStep(0)} className="p-1.5 rounded-lg hover:bg-ecommerce-surface-hover transition-colors">
                      <ChevronLeft size={18} className={isRTL ? 'rotate-180' : ''} />
                    </button>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-ecommerce-text-primary mb-1">
                        {t('homepage.checkout.paymentStep')}
                      </h2>
                      <p className="text-sm text-ecommerce-text-muted">{t('homepage.checkout.choosePayment')}</p>
                    </div>
                  </div>

                  {/* Payment methods */}
                  <div className="bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5 sm:p-6 space-y-4">
                    <RadioGroup value={payment.method} onValueChange={(v) => setPayment(p => ({ ...p, method: v as PaymentForm['method'] }))} className="space-y-3">
                      <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment.method === 'card' ? 'border-ecommerce-purple bg-ecommerce-purple/5' : 'border-ecommerce-border hover:border-ecommerce-border'
                        }`}>
                        <RadioGroupItem value="card" className="data-[state=checked]:border-ecommerce-purple data-[state=checked]:text-ecommerce-purple" />
                        <div className="w-10 h-10 rounded-xl bg-ecommerce-surface-hover flex items-center justify-center">
                          <CreditCardIcon size={20} className="text-ecommerce-text-secondary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-ecommerce-text-primary">{t('homepage.checkout.creditDebitCard')}</p>
                          <p className="text-xs text-ecommerce-text-muted">{t('homepage.checkout.cardNetworks')}</p>
                        </div>
                        {payment.method === 'card' && (
                          <BadgeCheck size={16} className="text-ecommerce-purple" />
                        )}
                      </label>
                      <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment.method === 'paypal' ? 'border-ecommerce-purple bg-ecommerce-purple/5' : 'border-ecommerce-border hover:border-ecommerce-border'
                        }`}>
                        <RadioGroupItem value="paypal" className="data-[state=checked]:border-ecommerce-purple data-[state=checked]:text-ecommerce-purple" />
                        <div className="w-10 h-10 rounded-xl bg-ecommerce-surface-hover flex items-center justify-center">
                          <Shield size={20} className="text-[#0070ba]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-ecommerce-text-primary">{t('homepage.checkout.paypal')}</p>
                          <p className="text-xs text-ecommerce-text-muted">{t('homepage.checkout.paypalDesc')}</p>
                        </div>
                        {payment.method === 'paypal' && (
                          <BadgeCheck size={16} className="text-ecommerce-purple" />
                        )}
                      </label>
                      <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment.method === 'cod' ? 'border-ecommerce-purple bg-ecommerce-purple/5' : 'border-ecommerce-border hover:border-ecommerce-border'
                        }`}>
                        <RadioGroupItem value="cod" className="data-[state=checked]:border-ecommerce-purple data-[state=checked]:text-ecommerce-purple" />
                        <div className="w-10 h-10 rounded-xl bg-ecommerce-surface-hover flex items-center justify-center">
                          <Banknote size={20} className="text-ecommerce-text-secondary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-ecommerce-text-primary">{t('homepage.checkout.cashOnDelivery')}</p>
                          <p className="text-xs text-ecommerce-text-muted">{t('homepage.checkout.codDesc')}</p>
                        </div>
                        {payment.method === 'cod' && (
                          <BadgeCheck size={16} className="text-ecommerce-purple" />
                        )}
                      </label>
                    </RadioGroup>
                  </div>

                  {/* Card form */}
                  {payment.method === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5 sm:p-6 space-y-5"
                    >
                      <h3 className="text-sm font-semibold text-ecommerce-text-primary flex items-center gap-2">
                        <CreditCard size={16} className="text-ecommerce-purple" />
                        {t('homepage.checkoutPage.cardDetails')}
                      </h3>
                      <div>
                        <Label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">
                          {t('homepage.checkout.cardNumber')} *
                        </Label>
                        <div className="relative">
                          <CreditCardIcon size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted" />
                          <Input
                            value={payment.cardNumber}
                            onChange={(e) => setPayment(p => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                            placeholder="4242 4242 4242 4242"
                            className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border ps-10 font-mono tracking-wider"
                            maxLength={19}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">
                          {t('homepage.checkoutPage.cardholderName')} *
                        </Label>
                        <Input
                          value={payment.cardName}
                          onChange={(e) => setPayment(p => ({ ...p, cardName: e.target.value }))}
                          placeholder="John Doe"
                          className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">
                            {t('homepage.checkout.expiryDate')} *
                          </Label>
                          <Input
                            value={payment.expiry}
                            onChange={(e) => setPayment(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                            placeholder="MM/YY"
                            className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border font-mono"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">
                            {t('homepage.checkout.cvc')} *
                          </Label>
                          <Input
                            value={payment.cvc}
                            onChange={(e) => setPayment(p => ({ ...p, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                            placeholder="123"
                            className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border font-mono"
                            maxLength={4}
                            type="password"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {payment.method === 'paypal' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-[#0070ba]/5 border border-[#0070ba]/15 rounded-2xl p-5 sm:p-6 text-center"
                    >
                      <Shield size={32} className="mx-auto mb-3 text-[#0070ba]" />
                      <p className="text-sm font-semibold text-ecommerce-text-primary mb-1">{t('homepage.checkoutPage.paypalRedirect')}</p>
                      <p className="text-xs text-ecommerce-text-muted">{t('homepage.checkoutPage.paypalRedirectDesc')}</p>
                    </motion.div>
                  )}

                  {payment.method === 'cod' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-ecommerce-amber/5 border border-ecommerce-amber/15 rounded-2xl p-5 sm:p-6 text-center"
                    >
                      <Banknote size={32} className="mx-auto mb-3 text-ecommerce-amber" />
                      <p className="text-sm font-semibold text-ecommerce-text-primary mb-1">{t('homepage.checkoutPage.codNote')}</p>
                      <p className="text-xs text-ecommerce-text-muted">{t('homepage.checkoutPage.codNoteDesc')}</p>
                    </motion.div>
                  )}

                  {/* Security note */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-ecommerce-surface-hover">
                    <Lock size={16} className="text-ecommerce-emerald mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-ecommerce-text-primary">{t('homepage.checkoutPage.secureCheckout')}</p>
                      <p className="text-[11px] text-ecommerce-text-muted mt-0.5">{t('homepage.checkoutPage.secureCheckoutDesc')}</p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(0)}
                      className="text-ecommerce-text-muted hover:text-ecommerce-text-primary gap-1"
                    >
                      <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
                      {t('homepage.checkoutPage.backToShipping')}
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl px-6 h-11 font-semibold text-sm gap-2 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      {t('homepage.checkoutPage.reviewOrder')}
                      <ChevronRight size={16} className={isRTL ? 'rotate-180' : ''} />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setStep(1)} className="p-1.5 rounded-lg hover:bg-ecommerce-surface-hover transition-colors">
                      <ChevronLeft size={18} className={isRTL ? 'rotate-180' : ''} />
                    </button>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-ecommerce-text-primary mb-1">
                        {t('homepage.checkoutPage.reviewOrderTitle')}
                      </h2>
                      <p className="text-sm text-ecommerce-text-muted">{t('homepage.checkout.confirmDetails')}</p>
                    </div>
                  </div>

                  {/* Shipping summary */}
                  <div className="bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-ecommerce-text-primary flex items-center gap-2">
                        <MapPin size={16} className="text-ecommerce-purple" />
                        {t('homepage.checkoutPage.shippingInfo')}
                      </h3>
                      <button
                        onClick={() => setStep(0)}
                        className="text-xs text-ecommerce-purple hover:text-ecommerce-purple/80 font-medium"
                      >
                        {t('homepage.common.edit')}
                      </button>
                    </div>
                    <div className="text-sm text-ecommerce-text-secondary space-y-1">
                      <p className="font-medium text-ecommerce-text-primary">{shipping.firstName} {shipping.lastName}</p>
                      <p>{shipping.street}{shipping.apartment ? `, ${shipping.apartment}` : ''}</p>
                      <p>{shipping.city}, {shipping.state} {shipping.zip}</p>
                      <p>{shipping.email} &middot; {shipping.phone}</p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <Truck size={13} className="text-ecommerce-text-muted" />
                        <span className="text-xs font-medium">
                          {shippingMethod === 'express' ? t('homepage.quickView.shippingInfo.express') : t('homepage.checkoutPage.standardShipping')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment summary */}
                  <div className="bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-ecommerce-text-primary flex items-center gap-2">
                        <CreditCard size={16} className="text-ecommerce-purple" />
                        {t('homepage.checkoutPage.paymentInfo')}
                      </h3>
                      <button
                        onClick={() => setStep(1)}
                        className="text-xs text-ecommerce-purple hover:text-ecommerce-purple/80 font-medium"
                      >
                        {t('homepage.common.edit')}
                      </button>
                    </div>
                    <div className="text-sm text-ecommerce-text-secondary">
                      {payment.method === 'card' && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-7 rounded-md bg-ecommerce-surface-hover flex items-center justify-center">
                            <CreditCardIcon size={16} className="text-ecommerce-text-muted" />
                          </div>
                          <div>
                            <p className="font-medium text-ecommerce-text-primary">{t('homepage.checkout.creditDebitCard')}</p>
                            <p className="text-xs text-ecommerce-text-muted font-mono">
                              **** **** **** {payment.cardNumber.replace(/\s/g, '').slice(-4) || '****'}
                            </p>
                          </div>
                        </div>
                      )}
                      {payment.method === 'paypal' && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-7 rounded-md bg-[#0070ba]/10 flex items-center justify-center">
                            <Shield size={16} className="text-[#0070ba]" />
                          </div>
                          <p className="font-medium text-ecommerce-text-primary">{t('homepage.checkout.paypal')}</p>
                        </div>
                      )}
                      {payment.method === 'cod' && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-7 rounded-md bg-ecommerce-amber/10 flex items-center justify-center">
                            <Banknote size={16} className="text-ecommerce-amber" />
                          </div>
                          <p className="font-medium text-ecommerce-text-primary">{t('homepage.checkout.cashOnDelivery')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5 sm:p-6">
                    <h3 className="text-sm font-semibold text-ecommerce-text-primary mb-4 flex items-center gap-2">
                      <ShoppingCart size={16} className="text-ecommerce-purple" />
                      {t('homepage.cart.orderSummary')} ({items.length} {t('homepage.common.products').toLowerCase()})
                    </h3>
                    <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-thin pe-1">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-ecommerce-surface-hover">
                          <img src={GetImage(item.image)} alt={item.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ecommerce-text-primary truncate">{item.name}</p>
                            <p className="text-xs text-ecommerce-text-muted">{item.categories.map(x => x + ",")} &middot; {t('homepage.cart.quantity')}: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-bold text-ecommerce-text-primary shrink-0">
                            ${(item.variant.sellPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="text-ecommerce-text-muted hover:text-ecommerce-text-primary gap-1"
                    >
                      <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
                      {t('homepage.checkoutPage.backToPayment')}
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl px-8 h-12 font-semibold text-sm gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t('homepage.checkoutPage.processing')}
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          {t('homepage.checkoutPage.placeOrder')} — ${total.toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right column - Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5 sm:p-6">
              <h3 className="text-base font-bold text-ecommerce-text-primary mb-4 flex items-center gap-2">
                <ShoppingCart size={16} className="text-ecommerce-red" />
                {t('homepage.cart.orderSummary')}
              </h3>

              {/* Items preview */}
              <div className="space-y-3 mb-4 pb-4 border-b border-ecommerce-border">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative">
                      <img src={GetImage(item.image)} alt={item.name} className="w-11 h-11 rounded-lg object-cover" />
                      <span className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-ecommerce-purple text-white text-[10px] font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-ecommerce-text-primary truncate">{item.name}</p>
                    </div>
                    <span className="text-xs font-semibold text-ecommerce-text-primary shrink-0">
                      ${(item.variant.sellPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-ecommerce-text-secondary">{t('homepage.cart.subtotal')}</span>
                  <span className="font-medium">${price.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-ecommerce-emerald">{t('homepage.cart.savings')}</span>
                    <span className="font-medium text-ecommerce-emerald">-${savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-ecommerce-text-secondary">{t('homepage.cart.shipping')}</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-ecommerce-emerald">{t('homepage.common.free')}</span>
                    ) : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ecommerce-text-secondary">{t('homepage.checkout.estimatedTax')}</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-ecommerce-text-primary">{t('homepage.cart.total')}</span>
                  <span className="text-xl font-extrabold text-ecommerce-red">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery estimate */}
              <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-ecommerce-emerald/8 border border-ecommerce-emerald/15">
                <Package size={16} className="text-ecommerce-emerald shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-ecommerce-emerald">
                    {shippingMethod === 'express' ? t('homepage.checkoutPage.expressDelivery') : t('homepage.checkout.estimatedDelivery')}
                  </p>
                  <p className="text-[10px] text-ecommerce-emerald/70">{t('homepage.checkout.orderConfirmationEmail')}</p>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-ecommerce-surface-hover">
                <Shield size={14} className="text-ecommerce-emerald shrink-0" />
                <span className="text-[11px] text-ecommerce-text-muted font-medium">{t('homepage.checkout.sslEncrypted')}</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-ecommerce-surface-hover">
                <Lock size={14} className="text-ecommerce-emerald shrink-0" />
                <span className="text-[11px] text-ecommerce-text-muted font-medium">{t('homepage.hero.securePayment')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}