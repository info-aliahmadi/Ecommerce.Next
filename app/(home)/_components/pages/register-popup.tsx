'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { UserPlus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@(home)/_components/ui/dialog';
import { Button } from '@(home)/_components/ui/button';
import { Input } from '@(home)/_components/ui/input';
import { Label } from '@(home)/_components/ui/label';
import { useUIStore, useAuthStore, useLocaleStore, RTL_LOCALES } from '@(home)/_lib/store';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function RegisterPopup() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegisterOpen = useAuthStore((s) => s.isRegisterOpen);
  const setRegisterOpen = useAuthStore((s) => s.setRegisterOpen);
  const navigate = useUIStore((s) => s.navigate);
  const locale = useLocaleStore((s) => s.locale);
  const isRTL = RTL_LOCALES.includes(locale);

  const t = useTranslations('auth.register');

  const resetForm = useCallback(() => {
    setName('');
    setPhone('');
    setIsSubmitting(false);
  }, []);

  const handleClose = useCallback(
    (open: boolean) => {
      setRegisterOpen(open);
      if (!open) {
        resetForm();
      }
    },
    [setRegisterOpen, resetForm],
  );

  const handleGoToLogin = useCallback(() => {
    setRegisterOpen(false);
    resetForm();
    navigate('login');
  }, [setRegisterOpen, resetForm, navigate]);

  const validate = useCallback((): boolean => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || trimmedName.length < 2) {
      toast.error(t('errorName'));
      return false;
    }

    if (!trimmedPhone || trimmedPhone.replace(/\D/g, '').length < 10) {
      toast.error(t('errorPhone'));
      return false;
    }

    return true;
  }, [name, phone, t]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validate()) return;

      setIsSubmitting(true);

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.code === 'PHONE_EXISTS') {
            toast.error(t('errorPhoneExists'));
          } else {
            toast.error(t('errorGeneric'));
          }
          return;
        }

        const result = await signIn('credentials', {
          redirect: false,
          username: phone.trim(),
          password: data.defaultPassword || phone.trim(),
        });

        if (result?.error) {
          toast.error(t('successRegistered'));
          setRegisterOpen(false);
          resetForm();
          navigate('login');
          return;
        }

        toast.success(t('success'));
        setRegisterOpen(false);
        resetForm();
      } catch {
        toast.error(t('errorGeneric'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, phone, validate, t, setRegisterOpen, resetForm, navigate],
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  } as const;

  return (
    <Dialog open={isRegisterOpen} onOpenChange={handleClose}>
      <DialogContent
        className={`sm:max-w-md ${isRTL ? 'rtl' : 'ltr'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-ecommerce-purple flex items-center justify-center mb-4">
              <UserPlus className="w-7 h-7 text-white" />
            </div>

            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-bold text-ecommerce-text-primary text-center">
                {t('title')}
              </DialogTitle>
              <DialogDescription className="text-ecommerce-text-muted text-center mt-1">
                {t('subtitle')}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field */}
            <div className="space-y-2">
              <Label
                htmlFor="register-name"
                className="text-sm font-medium text-ecommerce-text-secondary"
              >
                {t('name')}
              </Label>
              <Input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                className="rounded-lg"
                autoComplete="name"
                disabled={isSubmitting}
              />
            </div>

            {/* Phone field */}
            <div className="space-y-2">
              <Label
                htmlFor="register-phone"
                className="text-sm font-medium text-ecommerce-text-secondary"
              >
                {t('phone')}
              </Label>
              <Input
                id="register-phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phonePlaceholder')}
                className="rounded-lg"
                autoComplete="tel"
                dir="ltr"
                disabled={isSubmitting}
              />
            </div>

            {/* Password note */}
            <p className="text-xs text-ecommerce-text-muted text-center leading-relaxed px-2">
              {t('passwordNote', {
                defaultValue:
                  "We'll create a default password from your phone number. You can set a real password later.",
              })}
            </p>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-ecommerce-purple hover:bg-ecommerce-purple/90 text-white font-semibold h-11 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('registering')}
                </span>
              ) : (
                t('submit')
              )}
            </Button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-ecommerce-text-muted mt-5">
            {t('hasAccount')}{' '}
            <button
              type="button"
              onClick={handleGoToLogin}
              className="text-ecommerce-purple font-semibold hover:underline underline-offset-2 transition-colors"
            >
              {t('loginLink')}
            </button>
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
