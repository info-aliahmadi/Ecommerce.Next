'use client';

import { Input } from '@(home)/_components/ui/input';
import { Label } from '@(home)/_components/ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}

export function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
}: FormFieldProps) {
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
        className={`h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border text-sm ${
          error ? 'border-red-500 focus-visible:ring-red-500/20' : ''
        }`}
      />
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
