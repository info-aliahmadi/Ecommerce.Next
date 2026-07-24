'use client';

import { useTranslations } from 'next-intl';
import { CreditCard, Shield, Truck, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@(home)/_components/ui/button';
import { PaymentForm, PaymentMethod, formatCardNumber, formatExpiry } from './types';
import { FormField } from './form-field';

interface PaymentStepProps {
  payment: PaymentForm;
  errors: Record<string, string>;
  onSetPaymentField: (field: keyof PaymentForm, value: string | PaymentMethod) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function PaymentStep({
  payment,
  errors,
  onSetPaymentField,
  onBack,
  onContinue,
}: PaymentStepProps) {
  const t = useTranslations('homepage.paymentPage');

  const paymentMethods: { value: PaymentMethod; label: string; icon: typeof CreditCard; desc?: string }[] = [
    { value: 'card', label: t('creditCard'), icon: CreditCard },
    { value: 'paypal', label: t('paypal'), icon: Shield },
    { value: 'cod', label: t('cashOnDelivery'), icon: Truck, desc: t('codNote') },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-bold text-ecommerce-text-primary mb-1">{t('selectPayment')}</h3>
        <p className="text-sm text-ecommerce-text-muted">{t('securePayment')}</p>
      </section>

      {/* Payment method cards */}
      <div className="space-y-3">
        {paymentMethods.map((pm) => (
          <button
            key={pm.value}
            onClick={() => onSetPaymentField('method', pm.value)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-start group ${
              payment.method === pm.value
                ? 'border-ecommerce-red bg-ecommerce-red/5'
                : 'border-ecommerce-border hover:border-ecommerce-red/50 hover:bg-ecommerce-surface-hover'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                payment.method === pm.value
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
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                payment.method === pm.value
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
                label={t('cardholderName')}
                value={payment.cardholderName}
                onChange={(v) => onSetPaymentField('cardholderName', v)}
                placeholder="John Doe"
                error={errors.cardholderName}
              />
              <FormField
                id="cardNumber"
                label={t('cardNumber')}
                value={payment.cardNumber}
                onChange={(v) => onSetPaymentField('cardNumber', formatCardNumber(v))}
                placeholder="4242 4242 4242 4242"
                error={errors.cardNumber}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  id="expiryDate"
                  label={t('expiryDate')}
                  value={payment.expiryDate}
                  onChange={(v) => onSetPaymentField('expiryDate', formatExpiry(v))}
                  placeholder="MM/YY"
                  error={errors.expiryDate}
                />
                <FormField
                  id="cvc"
                  label={t('cvc')}
                  value={payment.cvc}
                  onChange={(v) => onSetPaymentField('cvc', v.replace(/\D/g, '').slice(0, 4))}
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
          onClick={onBack}
          className="flex-1 h-12 rounded-xl font-semibold text-sm gap-2 border-ecommerce-border text-ecommerce-text-primary hover:bg-ecommerce-surface-hover"
        >
          <ChevronLeft size={16} />
          {t('homepage.step1')}
        </Button>
        <Button
          onClick={onContinue}
          className="flex-1 h-12 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-[1.01] active:scale-95"
        >
          {t('step3')}
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
