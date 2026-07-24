'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, Pencil, Trash2, Plus, Loader2 } from 'lucide-react';

import { Card, CardContent } from '../../_components/ui/card';
import { Button } from '../../_components/ui/button';
import { Badge } from '../../_components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../_components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../_components/ui/alert-dialog';
import AddressModel from '@root/app/dashboard/(ecommerce)/_types/Common/AddressModel';
import { staggerContainer, staggerItem } from './types';
import { AddressForm } from '../../_components/shared/address-form';

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
  saving,
  deletingId,
  settingDefaultId,
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
  saving?: boolean;
  deletingId?: number | null;
  settingDefaultId?: number | null;
}>) {
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        <Button size="sm" className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white" onClick={onAdd} disabled={saving}>
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
            <Button className="mt-4 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white" onClick={onAdd} disabled={saving}>
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
                          <Badge className="bg-ecommerce-emerald text-white text-[10px] font-semibold px-2 py-0.5">
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
                      <Button variant="ghost" size="sm" className="text-xs text-ecommerce-text-muted hover:text-ecommerce-emerald" onClick={() => onSetDefault(addr.id)} disabled={settingDefaultId === addr.id}>
                        {t('homepage.profile.setAsDefault')}
                      </Button>
                    )}
                    <div className="ms-auto flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-ecommerce-text-muted hover:text-ecommerce-text-primary" onClick={() => onEdit(addr)} disabled={deletingId === addr.id || settingDefaultId === addr.id}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-ecommerce-text-muted hover:text-red-500" disabled={deletingId === addr.id || settingDefaultId === addr.id}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-ecommerce-surface border-ecommerce-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-ecommerce-text-primary">{t('homepage.profile.deleteAddress')}</AlertDialogTitle>
                            <AlertDialogDescription className="text-ecommerce-text-muted">
                              {t('homepage.profile.deleteAddressConfirm')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-ecommerce-border text-ecommerce-text-secondary">{t('homepage.common.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(addr.id)} className="bg-red-500 hover:bg-red-600 text-white">
                              {deletingId === addr.id && <Loader2 className="w-4 h-4 me-1.5 animate-spin" />}
                              {t('homepage.common.delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
            <AddressForm
              value={addrForm}
              onChange={setAddrForm}
              errors={errors}
              onClearError={clearError}
              showTitle
              showIsDefault
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-ecommerce-border text-ecommerce-text-secondary">
              {t('homepage.common.cancel')}
            </Button>
            <Button onClick={handleSave} className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 me-1.5 animate-spin" />}
              {t('homepage.profile.saveAddress')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
