'use client';

import { CheckCircle2 } from 'lucide-react';
import { CheckoutStep } from './types';

interface StepProgressProps {
  currentStep: CheckoutStep;
  steps: { num: CheckoutStep; label: string }[];
}

export function StepProgress({ currentStep, steps }: Readonly<StepProgressProps>) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep > s.num
                    ? 'bg-ecommerce-emerald text-white'
                    : currentStep === s.num
                      ? 'bg-ecommerce-red text-white shadow-lg shadow-ecommerce-red/25'
                      : 'bg-ecommerce-surface-hover text-ecommerce-text-muted border border-ecommerce-border'
                }`}
              >
                {currentStep > s.num ? <CheckCircle2 size={16} /> : s.num}
              </div>
              <span
                className={`text-[11px] sm:text-xs mt-1.5 font-medium whitespace-nowrap ${
                  currentStep === s.num
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
                className={`w-10 sm:w-20 lg:w-28 h-0.5 mx-2 sm:mx-3 mb-5 transition-colors duration-300 ${
                  currentStep > s.num ? 'bg-ecommerce-emerald' : 'bg-ecommerce-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
