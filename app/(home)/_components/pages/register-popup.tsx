'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUIStore, useAuthStore, useLocaleStore } from '@/lib/store';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import type { Locale } from '@/lib/store';

export default function RegisterPopup() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegisterOpen = useAuthStore((s) => s.isRegisterOpen);
  const setRegisterOpen = useAuthStore((s) => s.setRegisterOpen);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useUIStore((s) => s.navigate);
  const locale = useLocaleStore((s) => s.locale);
  const isRTL = (['fa', 'ar'] as Locale[]).includes(locale);

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

        toast.success(t('success'));
        setUser(data.user);
        setRegisterOpen(false);
        resetForm();
        navigate('profile');
      } catch {
        toast.error(t('errorGeneric'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, phone, validate, t, setUser, setRegisterOpen, resetForm, navigate],
  );

  return (
    <Dialog open={isRegisterOpen} onOpenChange={handleClose}>
      <DialogContent
        className={`sm:max-w-md ${isRTL ? 'rtl' : 'ltr'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Decorative header */}
          <div className="ecommerce-text-center ecommerce-mb-6">
            <div className="ecommerce-mx-auto ecommerce-flex ecommerce-items-center ecommerce-justify-center ecommerce-w-16 ecommerce-h-16 ecommerce-rounded-full ecommerce-bg-gradient-to-br ecommerce-from-purple-500 ecommerce-to-purple-700 ecommerce-mb-4">
              <UserPlus className="ecommerce-w-8 ecommerce-h-8 ecommerce-text-white" />
            </div>

            <DialogHeader>
              <DialogTitle className="ecommerce-text-xl ecommerce-font-bold ecommerce-text-primary ecommerce-text-center">
                {t('title')}
              </DialogTitle>
              <DialogDescription className="ecommerce-text-muted ecommerce-text-center ecommerce-mt-1">
                {t('subtitle')}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="ecommerce-space-y-4">
            {/* Name field */}
            <div className="ecommerce-space-y-2">
              <Label
                htmlFor="register-name"
                className="ecommerce-text-sm ecommerce-font-medium ecommerce-text-primary"
              >
                {t('name')}
              </Label>
              <Input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                className="ecommerce-border ecommerce-border-border ecommerce-bg-surface ecommerce-text-primary ecommerce-rounded-lg"
                autoComplete="name"
                disabled={isSubmitting}
              />
            </div>

            {/* Phone field */}
            <div className="ecommerce-space-y-2">
              <Label
                htmlFor="register-phone"
                className="ecommerce-text-sm ecommerce-font-medium ecommerce-text-primary"
              >
                {t('phone')}
              </Label>
              <Input
                id="register-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phonePlaceholder')}
                className="ecommerce-border ecommerce-border-border ecommerce-bg-surface ecommerce-text-primary ecommerce-rounded-lg"
                autoComplete="tel"
                disabled={isSubmitting}
              />
            </div>

            {/* Password note */}
            <p className="ecommerce-text-xs ecommerce-text-muted ecommerce-text-center ecommerce-leading-relaxed ecommerce-px-2">
              {t('passwordNote', {
                defaultValue:
                  "We'll create a default password from your phone number. You can set a real password later.",
              })}
            </p>

            {/* Submit button */}
            <Button
              type="submit"
              className="ecommerce-w-full ecommerce-bg-gradient-to-r ecommerce-from-purple-500 ecommerce-to-purple-700 hover:ecommerce-from-purple-600 hover:ecommerce-to-purple-800 ecommerce-text-white ecommerce-font-semibold ecommerce-rounded-lg ecommerce-py-2.5 ecommerce-transition-all ecommerce-duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="ecommerce-flex ecommerce-items-center ecommerce-gap-2">
                  <svg
                    className="ecommerce-animate-spin ecommerce-h-4 ecommerce-w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="ecommerce-opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="ecommerce-opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {t('registering')}
                </span>
              ) : (
                t('submit')
              )}
            </Button>
          </form>

          {/* Login link */}
          <p className="ecommerce-text-center ecommerce-text-sm ecommerce-text-muted ecommerce-mt-5">
            {t('hasAccount')}{' '}
            <button
              type="button"
              onClick={handleGoToLogin}
              className="ecommerce-text-purple ecommerce-font-semibold hover:ecommerce-text-purple-700 ecommerce-underline ecommerce-underline-offset-2 ecommerce-transition-colors ecommerce-duration-200"
            >
              {t('loginLink')}
            </button>
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}