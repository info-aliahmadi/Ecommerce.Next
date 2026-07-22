'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, Pencil, Trash2, Plus, Loader2 } from 'lucide-react';

import { Card, CardContent } from '../../_components/ui/card';
import { Button } from '../../_components/ui/button';
import { Badge } from '../../_components/ui/badge';
import { Input } from '../../_components/ui/input';
import { Label } from '../../_components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../_components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../_components/ui/select';
import AddressModel from '@root/app/dashboard/(ecommerce)/_types/Common/AddressModel';
import CountryModel from '@root/app/dashboard/(ecommerce)/_types/Common/CountryModel';
import StateProvinceModel from '@root/app/dashboard/(ecommerce)/_types/Common/StateProvinceModel';
import { staggerContainer, staggerItem } from './types';

export function AddressesTab({
  t,
  addresses,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
  dialogOpen,
  setDialogOpen,
  editingAddress,
  addrForm,
  setAddrForm,
  onSave,
  loading,
  countries,
  states,
}: Readonly<{
  t: ReturnType<typeof useTranslations>;
  addresses: AddressModel[];
  onAdd: () => void;
  onEdit: (addr: AddressModel) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingAddress: AddressModel | null;
  addrForm: AddressModel | null;
  setAddrForm: (form: AddressModel) => void;
  onSave: () => void;
  loading?: boolean;
  countries: CountryModel[];
  states: StateProvinceModel[];
}>) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!editingAddress && countries.length > 0 && addrForm && addrForm.countryId === 0) {
      const first = countries[0];
      setAddrForm({ ...addrForm, countryId: first.id, countryName: first.name });
    }
  }, [editingAddress, countries, addrForm, setAddrForm]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!addrForm?.title?.trim()) newErrors.title = t('homepage.profile.fieldRequired');
    if (!addrForm?.address1?.trim()) newErrors.address1 = t('homepage.profile.fieldRequired');
    if (!addrForm?.countryId) newErrors.country = t('homepage.profile.fieldRequired');
    if (!addrForm?.stateProvinceId) newErrors.state = t('homepage.profile.fieldRequired');
    if (!addrForm?.city?.trim()) newErrors.city = t('homepage.profile.fieldRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSave = () => {
    if (validate()) {
      onSave();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.myAddresses')}</h2>
        <Button size="sm" className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white" onClick={onAdd}>
          <Plus className="w-4 h-4" />
          <span className="ms-1.5">{t('homepage.profile.addNewAddress')}</span>
        </Button>
      </div>

      {loading ? (
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardContent className="py-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-ecommerce-red animate-spin" />
          </CardContent>
        </Card>
      ) : addresses.length === 0 ? (
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardContent className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-ecommerce-surface-hover flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-ecommerce-text-muted" />
            </div>
            <h3 className="font-semibold text-ecommerce-text-primary">{t('homepage.profile.noAddresses')}</h3>
            <p className="text-sm text-ecommerce-text-muted mt-1 max-w-sm">{t('homepage.profile.noAddressesDesc')}</p>
            <Button className="mt-4 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white" onClick={onAdd}>
              <Plus className="w-4 h-4" />
              <span className="ms-1.5">{t('homepage.profile.addNewAddress')}</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-3 sm:grid-cols-2">
          {addresses.map((addr) => (
            <motion.div key={addr.id} variants={staggerItem}>
              <Card className="bg-ecommerce-surface border-ecommerce-border hover:shadow-md transition-shadow duration-200 h-full">
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-ecommerce-text-primary truncate">{addr.title}</h3>
                        {addr.isDefault && (
                          <Badge className="bg-ecommerce-emerald/10 text-ecommerce-emerald border-0 text-[10px] font-semibold px-1.5 py-0">
                            {t('homepage.profile.defaultBadge')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex-1 text-sm text-ecommerce-text-secondary space-y-1">
                    <p>{addr.address1}</p>
                    <p>
                      {addr.city}, {addr.stateProvinceName} {addr.zipPostalCode}
                    </p>
                    <p>{addr.countryName}</p>
                    {addr.phoneNumber && <p>{addr.phoneNumber}</p>}
                    {addr.geoLocation && <p>{addr.geoLocation}</p>}
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-ecommerce-border">
                    {!addr.isDefault && (
                      <Button variant="ghost" size="sm" className="text-xs text-ecommerce-text-muted hover:text-ecommerce-emerald" onClick={() => onSetDefault(addr.id)}>
                        {t('homepage.profile.setAsDefault')}
                      </Button>
                    )}
                    <div className="ms-auto flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-ecommerce-text-muted hover:text-ecommerce-text-primary" onClick={() => onEdit(addr)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-ecommerce-text-muted hover:text-red-500" onClick={() => onDelete(addr.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Address Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-ecommerce-surface border-ecommerce-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-ecommerce-text-primary">
              {editingAddress ? t('homepage.profile.editAddress') : t('homepage.profile.addNewAddress')}
            </DialogTitle>
            <DialogDescription className="text-ecommerce-text-muted">
              {editingAddress ? t('homepage.profile.editAddress') : t('homepage.profile.addNewAddress')}
            </DialogDescription>
          </DialogHeader>
          {addrForm && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <Label className="text-ecommerce-text-primary text-sm">{t('homepage.profile.addressName')}</Label>
                <Input value={addrForm.title} onChange={(e) => { setAddrForm({ ...addrForm, title: e.target.value }); clearError('title'); }} placeholder={t('homepage.profile.addressNamePlaceHolder')} className={`bg-ecommerce-surface-hover border text-ecommerce-text-primary w-full ${errors.title ? 'border-red-500' : 'border-ecommerce-border'}`} />
                {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-ecommerce-text-primary text-sm">{t('homepage.profile.country')}</Label>
                  <Select value={addrForm.countryId ? String(addrForm.countryId) : ''} onValueChange={(val) => {
                    const country = countries.find((c) => c.id === Number(val));
                    setAddrForm({ ...addrForm, countryId: Number(val), countryName: country?.name ?? '', stateProvinceId: 0, stateProvinceName: '' });
                    clearError('country');
                  }}>
                    <SelectTrigger className={`bg-ecommerce-surface-hover border text-ecommerce-text-primary w-full ${errors.country ? 'border-red-500' : 'border-ecommerce-border'}`}>
                      <SelectValue placeholder={t('homepage.profile.country')} />
                    </SelectTrigger>
                    <SelectContent className="bg-ecommerce-surface border-ecommerce-border">
                      {countries.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)} className="text-ecommerce-text-primary">{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-ecommerce-text-primary text-sm">{t('homepage.profile.state')}</Label>
                  <Select value={addrForm.stateProvinceId ? String(addrForm.stateProvinceId) : ''} onValueChange={(val) => {
                    const state = states.find((s) => s.id === Number(val));
                    setAddrForm({ ...addrForm, stateProvinceId: Number(val), stateProvinceName: state?.name ?? '' });
                  }} disabled={!addrForm.countryId}>
                    <SelectTrigger className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary w-full">
                      <SelectValue placeholder={t('homepage.profile.state')} />
                    </SelectTrigger>
                    <SelectContent className="bg-ecommerce-surface border-ecommerce-border">
                      {states.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)} className="text-ecommerce-text-primary">{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-ecommerce-text-primary text-sm">{t('homepage.profile.city')}</Label>
                  <Input value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
                </div>
              </div>
              <div className="gap-3">
                <div className="space-y-2">
                  <Label className="text-ecommerce-text-primary text-sm">{t('homepage.profile.addressLine1')}</Label>
                  <Input value={addrForm.address1} onChange={(e) => setAddrForm({ ...addrForm, address1: e.target.value })} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-ecommerce-text-primary text-sm">{t('homepage.profile.zipCode')}</Label>
                  <Input value={addrForm.zipPostalCode} onChange={(e) => setAddrForm({ ...addrForm, zipPostalCode: e.target.value })} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="text-ecommerce-text-primary text-sm">{t('homepage.profile.phoneNumber')}</Label>
                  <Input value={addrForm.phoneNumber} onChange={(e) => setAddrForm({ ...addrForm, phoneNumber: e.target.value })} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-ecommerce-text-primary text-sm">{t('homepage.profile.geoLocation')}</Label>
                <Input value={addrForm.geoLocation} onChange={(e) => setAddrForm({ ...addrForm, geoLocation: e.target.value })} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addrForm.isDefault}
                  onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                  className="h-4 w-4 rounded border-ecommerce-border text-ecommerce-red focus:ring-ecommerce-red"
                />
                <Label htmlFor="isDefault" className="text-ecommerce-text-primary text-sm">{t('homepage.profile.setAsDefault')}</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-ecommerce-border text-ecommerce-text-secondary">
              {t('homepage.common.cancel')}
            </Button>
            <Button onClick={onSave} className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white">
              {t('homepage.profile.saveAddress')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
