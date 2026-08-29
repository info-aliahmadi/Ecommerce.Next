'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
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
import { useAuthStore } from '@(home)/_lib/store';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import AuthenticationService from '@root/app/dashboard/(auth)/_service/AuthenticationService';
import { resolveLocale } from '@root/utils/resolver';
import { Locale } from '@root/locales/Language';
import ForgotPassword from '@root/app/dashboard/(auth)/_types/User/ForgotPassword';
import Result from '@root/app/types/Result';
import Fetch from '@root/utils/Fetch';

export default function ForgotPasswordPopup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isForgotPasswordOpen = useAuthStore((s) => s.isForgotPasswordOpen);
  const setForgotPasswordOpen = useAuthStore((s) => s.setForgotPasswordOpen);
  const setLoginOpen = useAuthStore((s) => s.setLoginOpen);

  const locale = useLocale() as Locale;
  const isRTL = resolveLocale(locale).direction === 'rtl';

  const t = useTranslations('homepage.auth.forgotPassword');

  const resetForm = useCallback(() => {
    setEmail('');
    setIsSubmitting(false);
    setIsSuccess(false);
  }, []);

  const handleClose = useCallback(
    (open: boolean) => {
      setForgotPasswordOpen(open);
      if (!open) resetForm();
    },
    [setForgotPasswordOpen, resetForm],
  );

  const handleGoToLogin = useCallback(() => {
    setForgotPasswordOpen(false);
    resetForm();
    setLoginOpen(true);
  }, [setForgotPasswordOpen, resetForm, setLoginOpen]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email.trim() || !email.includes('@')) {
        toast.error(t('errorEmail'));
        return;
      }

      setIsSubmitting(true);

      try {
        
        let config: RequestInit = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        }
        const response = await Fetch.Post<Result<boolean>>('/api/auth/forgotPassword', { email: email.trim() } as ForgotPassword, config);

        if (response?.succeeded) {
          setIsSuccess(true);
          toast.success(t('success'));
        } else {
          toast.error(response.message || t('errorGeneric'));
        }
      } catch {
        toast.error(t('errorGeneric'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, t],
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  } as const;

  return (
    <Dialog open={isForgotPasswordOpen} onOpenChange={handleClose}>
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
              <KeyRound className="w-7 h-7 text-white" />
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

          {isSuccess ? (
            /* Success state */
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-ecommerce-text-primary font-medium mb-2">
                {t('successMessage')}
              </p>
              <p className="text-ecommerce-text-muted text-sm mb-6">
                {t('checkEmail')}
              </p>
              <Button
                onClick={handleGoToLogin}
                className="w-full bg-ecommerce-purple hover:bg-ecommerce-purple/90 text-white font-semibold h-11 rounded-lg transition-colors"
              >
                {t('backToLogin')}
              </Button>
            </div>
          ) : (
            /* Form state */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div className="space-y-2">
                <Label
                  htmlFor="forgot-password-email"
                  className="text-sm font-medium text-ecommerce-text-secondary"
                >
                  {t('emailLabel')}
                </Label>
                <Input
                  id="forgot-password-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className="rounded-lg"
                  autoComplete="email"
                  disabled={isSubmitting}
                  dir="ltr"
                />
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full bg-ecommerce-purple hover:bg-ecommerce-purple/90 text-white font-semibold h-11 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('sending')}
                  </span>
                ) : (
                  t('submit')
                )}
              </Button>
            </form>
          )}

          {/* Login link */}
          <p className="text-center text-sm text-ecommerce-text-muted mt-5">
            {t('rememberPassword')}{' '}
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
