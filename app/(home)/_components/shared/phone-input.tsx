'use client';

import { Phone } from 'lucide-react';
import { Input } from '@(home)/_components/ui/input';
import CONFIG from '@root/config';

interface PhoneInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorText?: string;
  className?: string;
  minLength?: number;
  maxLength?: number;
}

export function PhoneInput({
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  errorText,
  className = '',
  minLength = 10,
  maxLength = 10,
}: PhoneInputProps) {
  return (
    <div className={className}>
      <div className="relative flex">
        <span className="text-ecommerce-text-muted inline-flex items-center px-3 rounded-s-xl border border-r-0 border-ecommerce-border bg-ecommerce-surface text-sm shrink-0">
          {CONFIG.DEFAULT_PHONECOUNTRY}
        </span>
        <Input
          id={id}
          type="tel"
          inputMode="numeric"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 15))}
          className={`h-11 rounded-s-none border-ecommerce-border bg-ecommerce-surface text-ecommerce-text-primary rounded-e-xl ${error ? 'border-red-500' : ''}`}
          autoComplete="tel"
          disabled={disabled}
          dir="ltr"
          minLength={minLength}
          maxLength={maxLength}
        />
        <div className="absolute end-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted pointer-events-none">
          <Phone className="w-4 h-4" />
        </div>
      </div>
      {errorText && <p className="text-red-500 text-xs mt-1">{errorText}</p>}
    </div>
  );
}
