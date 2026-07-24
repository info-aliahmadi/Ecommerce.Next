'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PhoneInput } from './phone-input';
import AddressModel from '@root/app/dashboard/(ecommerce)/_types/Common/AddressModel';
import CountryModel from '@root/app/dashboard/(ecommerce)/_types/Common/CountryModel';
import StateProvinceModel from '@root/app/dashboard/(ecommerce)/_types/Common/StateProvinceModel';
import ProfileService from '../../_services/ProfileService';

export interface AddressFormProps {
  value: AddressModel;
  onChange: (form: AddressModel) => void;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
  showTitle?: boolean;
  showIsDefault?: boolean;
  showSaveButton?: boolean;
  saveLabel?: string;
  onSave?: () => void;
  saving?: boolean;
  loading?: boolean;
  className?: string;
}

export function AddressForm({
  value,
  onChange,
  errors = {},
  onClearError,
  showTitle = true,
  showIsDefault = false,
  showSaveButton = false,
  saveLabel,
  onSave,
  saving = false,
  loading = false,
  className = '',
}: Readonly<AddressFormProps>) {
  const t = useTranslations('homepage.profile');
  const { data: session } = useSession();
  const jwt = session?.user?.accessToken;

  const [countries, setCountries] = useState<CountryModel[]>([]);
  const [states, setStates] = useState<StateProvinceModel[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      if (!jwt) return;
      setLoadingCountries(true);
      try {
        const service = new ProfileService(jwt);
        const res = await service.getCountriesForSelect();
        if (res.succeeded && res.data) {
          setCountries(res.data);
        }
      } catch {
        // Silent fail
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, [jwt]);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!jwt || !value.countryId) {
        setStates([]);
        return;
      }
      try {
        const service = new ProfileService(jwt);
        const res = await service.getStateProvincesForSelect(value.countryId);
        if (res.succeeded && res.data) {
          setStates(res.data);
        } else {
          setStates([]);
        }
      } catch {
        setStates([]);
      }
    };
    fetchStates();
  }, [jwt, value.countryId]);

  // Auto-select first country if none selected
  useEffect(() => {
    if (countries.length > 0 && value.countryId === 0) {
      const first = countries[0];
      onChange({ ...value, countryId: first.id, countryName: first.name });
    }
  }, [countries, value, onChange]);

  const clearError = (field: string) => {
    onClearError?.(field);
  };

  if (loading || loadingCountries) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-ecommerce-red animate-spin" />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title */}
      {showTitle && (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-ecommerce-text-primary">{t('addressName')}</Label>
          <Input
            value={value.title}
            onChange={(e) => { onChange({ ...value, title: e.target.value }); clearError('title'); }}
            placeholder={t('addressNamePlaceHolder')}
            className={`h-11 rounded-xl bg-ecommerce-surface-hover border text-ecommerce-text-primary ${errors.title ? 'border-red-500' : 'border-ecommerce-border'}`}
          />
          {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
        </div>
      )}

      {/* Country, State, City */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5 ">
          <Label className="text-sm font-medium text-ecommerce-text-primary">{t('country')}</Label>
          <Select
            value={value.countryId ? String(value.countryId) : ''}
            onValueChange={(val) => {
              const country = countries.find((c) => c.id === Number(val));
              onChange({ ...value, countryId: Number(val), countryName: country?.name ?? '', stateProvinceId: 0, stateProvinceName: '' });
              clearError('country');
            }}
          >
            <SelectTrigger className={`h-full rounded-xl bg-ecommerce-surface-hover border text-ecommerce-text-primary w-full ${errors.country ? 'border-red-500' : 'border-ecommerce-border'}`}>
              <SelectValue placeholder={t('country')} />
            </SelectTrigger>
            <SelectContent className="bg-ecommerce-surface border-ecommerce-border">
              {countries.map((c) => (
                <SelectItem key={c.id} value={String(c.id)} className="text-ecommerce-text-primary">{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-ecommerce-text-primary">{t('state')}</Label>
          <Select
            value={value.stateProvinceId ? String(value.stateProvinceId) : ''}
            onValueChange={(val) => {
              const state = states.find((s) => s.id === Number(val));
              onChange({ ...value, stateProvinceId: Number(val), stateProvinceName: state?.name ?? '' });
              clearError('state');
            }}
            disabled={!value.countryId}
          >
            <SelectTrigger className={`h-11 rounded-xl bg-ecommerce-surface-hover border text-ecommerce-text-primary w-full ${errors.state ? 'border-red-500' : 'border-ecommerce-border'}`}>
              <SelectValue placeholder={t('state')} />
            </SelectTrigger>
            <SelectContent className="bg-ecommerce-surface border-ecommerce-border">
              {states.map((s) => (
                <SelectItem key={s.id} value={String(s.id)} className="text-ecommerce-text-primary">{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-ecommerce-text-primary">{t('city')}</Label>
          <Input
            value={value.city}
            onChange={(e) => { onChange({ ...value, city: e.target.value }); clearError('city'); }}
            className={`h-11 rounded-xl bg-ecommerce-surface-hover border text-ecommerce-text-primary ${errors.city ? 'border-red-500' : 'border-ecommerce-border'}`}
          />
          {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
        </div>
      </div>

      {/* Address Line */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-ecommerce-text-primary">{t('addressLine1')}</Label>
        <Input
          value={value.address1}
          onChange={(e) => { onChange({ ...value, address1: e.target.value }); clearError('address1'); }}
          className={`h-11 rounded-xl bg-ecommerce-surface-hover border text-ecommerce-text-primary ${errors.address1 ? 'border-red-500' : 'border-ecommerce-border'}`}
        />
        {errors.address1 && <p className="text-red-500 text-xs">{errors.address1}</p>}
      </div>

      {/* Zip, Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-ecommerce-text-primary">{t('zipCode')}</Label>
          <Input
            value={value.zipPostalCode || ''}
            onChange={(e) => onChange({ ...value, zipPostalCode: e.target.value })}
            className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-ecommerce-text-primary">{t('phoneNumber')}</Label>
          <PhoneInput
            value={value.phoneNumber || ''}
            onChange={(v) => onChange({ ...value, phoneNumber: v })}
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Is Default */}
      {showIsDefault && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            checked={value.isDefault}
            onChange={(e) => onChange({ ...value, isDefault: e.target.checked })}
            className="h-4 w-4 rounded border-ecommerce-border text-ecommerce-red focus:ring-ecommerce-red"
          />
          <Label htmlFor="isDefault" className="text-sm text-ecommerce-text-primary cursor-pointer select-none">{t('setAsDefault')}</Label>
        </div>
      )}

      {/* Save Button */}
      {showSaveButton && onSave && (
        <Button onClick={onSave} className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white" disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 me-1.5 animate-spin" />}
          {saveLabel || t('saveAddress')}
        </Button>
      )}
    </div>
  );
}
