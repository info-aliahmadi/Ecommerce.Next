'use client';

import { useTranslations } from 'next-intl';
import { ChevronRight, MapPin, Loader2 } from 'lucide-react';

import { Button } from '@(home)/_components/ui/button';
import { Label } from '@(home)/_components/ui/label';
import { Checkbox } from '@(home)/_components/ui/checkbox';
import { Separator } from '@(home)/_components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@(home)/_components/ui/select';
import AddressModel from '@root/app/dashboard/(ecommerce)/_types/Common/AddressModel';
import { AddressForm } from '@(home)/_components/shared/address-form';
import { FormField } from './form-field';
import { ShippingForm } from './types';

interface ShippingStepProps {
  shipping: ShippingForm;
  errors: Record<string, string>;
  savedAddresses: AddressModel[];
  selectedAddressId: string;
  addrForm: AddressModel;
  isSaving?: boolean;
  onSetShippingField: (field: keyof ShippingForm, value: string | boolean) => void;
  onSetAddrForm: (form: AddressModel) => void;
  onAddressSelect: (value: string) => void;
  onContinue: () => void;
}

export function ShippingStep({
  shipping,
  errors,
  savedAddresses,
  selectedAddressId,
  addrForm,
  isSaving = false,
  onSetShippingField,
  onSetAddrForm,
  onAddressSelect,
  onContinue,
}: ShippingStepProps) {
  const t = useTranslations('homepage.paymentPage');

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <section>
        <h3 className="text-lg font-bold text-ecommerce-text-primary mb-4">{t('contactInfo')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="firstName"
            label={t('firstName')}
            value={shipping.firstName}
            onChange={(v) => onSetShippingField('firstName', v)}
            placeholder="John"
            error={errors.firstName}
          />
          <FormField
            id="lastName"
            label={t('lastName')}
            value={shipping.lastName}
            onChange={(v) => onSetShippingField('lastName', v)}
            placeholder="Doe"
            error={errors.lastName}
          />
          <FormField
            id="email"
            label={t('email')}
            value={shipping.email}
            onChange={(v) => onSetShippingField('email', v)}
            placeholder="john@example.com"
            type="email"
            error={errors.email}
          />
          <FormField
            id="phone"
            label={t('phone')}
            value={shipping.phone}
            onChange={(v) => onSetShippingField('phone', v)}
            placeholder="+1 (234) 567-890"
            type="tel"
            error={errors.phone}
          />
        </div>
      </section>

      <Separator className="bg-ecommerce-border" />

      {/* Delivery Address */}
      <section>
        <h3 className="text-lg font-bold text-ecommerce-text-primary mb-4">{t('deliveryAddress')}</h3>
        <div className="space-y-4">
          {/* Saved Address Selector */}
          {savedAddresses.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-medium text-ecommerce-text-secondary">{t('selectSavedAddress')}</Label>
              <Select value={selectedAddressId} onValueChange={onAddressSelect}>
                <SelectTrigger className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border">
                  <SelectValue placeholder={t('selectSavedAddress')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {t('useNewAddress')}
                    </div>
                  </SelectItem>
                  {savedAddresses.map((addr) => (
                    <SelectItem key={addr.id} value={String(addr.id)}>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        {addr.title} - {addr.address1}, {addr.city}
                        {addr.isDefault && <span className="text-xs text-ecommerce-red">({t('defaultBadge')})</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Address Form */}
          <AddressForm
            value={addrForm}
            onChange={onSetAddrForm}
            showTitle
            showIsDefault={false}
          />

          {/* Save Address Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="saveAddress"
              checked={shipping.saveAddress}
              onCheckedChange={(checked) => onSetShippingField('saveAddress', !!checked)}
              className="border-ecommerce-border data-[state=checked]:bg-ecommerce-red data-[state=checked]:border-ecommerce-red"
            />
            <Label htmlFor="saveAddress" className="text-xs text-ecommerce-text-secondary cursor-pointer select-none">
              {t('saveAddress')}
            </Label>
          </div>
        </div>
      </section>

      {/* Continue Button */}
      <Button
        onClick={onContinue}
        className="w-full h-12 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-[1.01] active:scale-95"
      >
        {t('step2')}
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
