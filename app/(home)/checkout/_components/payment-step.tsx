'use client';

import { useTranslations } from 'next-intl';
import { CreditCard, Shield, Truck, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@(home)/_components/ui/button';
import { PaymentForm } from './types';
import { FormField } from './form-field';
import PaymentMethod from '@root/app/types/enums/PaymentMethod';
import CONFIG from '@root/config';

interface PaymentStepProps {
  isRTL: boolean;
  payment: PaymentForm;
  errors: Record<string, string>;
  onSetPaymentField: (field: keyof PaymentForm, value: PaymentMethod) => void;
  onBack: () => void;
  onContinue: () => void;
}

const PAYMENT_META: Record<PaymentMethod, { labelKey: string; icon: typeof CreditCard; descKey?: string }> = {
  [PaymentMethod.CreditCard]: { labelKey: 'creditCard', icon: CreditCard },
  [PaymentMethod.PayPal]: { labelKey: 'paypal', icon: Shield },
  [PaymentMethod.BankTransfer]: { labelKey: 'bankTransfer', icon: CreditCard },
  [PaymentMethod.CashOnDelivery]: { labelKey: 'cashOnDelivery', icon: Truck, descKey: 'codNote' },
};

export function PaymentStep({
  isRTL,
  payment,
  errors,
  onSetPaymentField,
  onBack,
  onContinue,
}: PaymentStepProps) {
  const t = useTranslations('homepage.paymentPage');

  const paymentMethods = CONFIG.DEFAULT_PAYMENT_METHODS.map((method) => ({
    value: method,
    label: t(PAYMENT_META[method].labelKey),
    icon: PAYMENT_META[method].icon,
    desc: PAYMENT_META[method].descKey ? t(PAYMENT_META[method].descKey!) : undefined,
  }));

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

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12 rounded-xl font-semibold text-sm gap-2 border-ecommerce-border text-ecommerce-text-primary hover:bg-ecommerce-surface-hover"
        >
        {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {t('step1')}
        </Button>
        <Button
          onClick={onContinue}
          className="flex-1 h-12 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-[1.01] active:scale-95"
        >
          {t('step3')}
          {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </Button>
      </div>
    </div>
  );
}
