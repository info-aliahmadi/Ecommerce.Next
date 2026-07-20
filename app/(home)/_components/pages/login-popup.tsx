'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useUIStore, useAuthStore, useLocaleStore, RTL_LOCALES } from '@/lib/store';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function LoginPopup() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLoginOpen = useAuthStore((s) => s.isLoginOpen);
  const setLoginOpen = useAuthStore((s) => s.setLoginOpen);
  const setRegisterOpen = useAuthStore((s) => s.setRegisterOpen);
  const setUser = useAuthStore((s) => s.setUser);
  const goHome = useUIStore((s) => s.goHome);
  const navigate = useUIStore((s) => s.navigate);
  const locale = useLocaleStore((s) => s.locale);
  const isRTL = RTL_LOCALES.includes(locale);

  const t = useTranslations('auth.login');

  const resetForm = useCallback(() => {
    setPhone('');
    setPassword('');
    setShowPassword(false);
    setRememberMe(false);
    setIsLoading(false);
  }, []);

  const handleClose = useCallback(
    (open: boolean) => {
      setLoginOpen(open);
      if (!open) resetForm();
    },
    [setLoginOpen, resetForm],
  );

  const handleGoToRegister = useCallback(() => {
    setLoginOpen(false);
    resetForm();
    setRegisterOpen(true);
  }, [setLoginOpen, resetForm, setRegisterOpen]);

  const handleGoToFullLogin = useCallback(() => {
    setLoginOpen(false);
    resetForm();
    navigate('login');
  }, [setLoginOpen, resetForm, navigate]);

  const validate = useCallback((): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned || cleaned.length < 7) {
      toast.error(t('errorPhone'));
      return false;
    }
    if (password && password.length < 4) {
      toast.error(t('errorInvalid'));
      return false;
    }
    return true;
  }, [phone, password, t]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setIsLoading(true);

      try {
        const cleanedPhone = phone.replace(/\D/g, '');
        const finalPassword = password || cleanedPhone.slice(-6);

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: cleanedPhone, password: finalPassword }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || 'Login failed');
        }

        setUser(data.user ?? data);
        toast.success(t('success'));
        setLoginOpen(false);
        resetForm();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : t('errorGeneric');
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [phone, password, validate, t, setUser, setLoginOpen, resetForm],
  );

  return (
    <Dialog open={isLoginOpen} onOpenChange={handleClose}>
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
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 mb-4 shadow-lg shadow-purple-500/25">
              <LogIn className="w-7 h-7 text-white" />
            </div>

            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-ecommerce-text-primary text-center">
                {t('welcomeBack')}
              </DialogTitle>
              <DialogDescription className="text-ecommerce-text-muted text-center mt-1 text-sm">
                {t('subtitle')}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone */}
            <div className="space-y-2">
              <Label
                htmlFor="popup-login-phone"
                className="text-sm font-medium text-ecommerce-text-secondary"
              >
                {t('phone')}
              </Label>
              <div className="relative flex">
                <span className="text-ecommerce-text-muted inline-flex items-center px-3 rounded-s-md border border-r-0 border-ecommerce-border bg-ecommerce-surface text-sm shrink-0">
                  +1
                </span>
                <Input
                  id="popup-login-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder={t('phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
                  className="rounded-s-none border-ecommerce-border bg-ecommerce-surface text-ecommerce-text-primary rounded-e-md"
                  autoComplete="tel"
                  disabled={isLoading}
                  dir="ltr"
                />
                <div className="absolute end-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted pointer-events-none">
                  <Phone className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="popup-login-password"
                className="text-sm font-medium text-ecommerce-text-secondary"
              >
                {t('password')}{' '}
                <span className="text-ecommerce-text-muted font-normal text-xs">({t('passwordPlaceholder')})</span>
              </Label>
              <div className="relative">
                <Input
                  id="popup-login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pe-10 border-ecommerce-border bg-ecommerce-surface text-ecommerce-text-primary rounded-md"
                  autoComplete="current-password"
                  disabled={isLoading}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted hover:text-ecommerce-text-secondary transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="popup-remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-ecommerce-border data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
              />
              <Label
                htmlFor="popup-remember-me"
                className="text-ecommerce-text-muted text-sm cursor-pointer select-none"
              >
                {t('rememberMe')}
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold h-11 rounded-lg transition-all duration-200 shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('loggingIn')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t('submit')}
                </span>
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-5 space-y-3">
            <p className="text-center text-sm text-ecommerce-text-muted">
              {t('noAccount')}{' '}
              <button
                type="button"
                onClick={handleGoToRegister}
                className="text-purple-600 font-semibold hover:text-purple-700 underline underline-offset-2 transition-colors"
              >
                {t('registerLink')}
              </button>
            </p>

            <div className="flex items-center gap-3 text-xs text-ecommerce-text-muted">
              <div className="flex-1 border-t border-ecommerce-border" />
              <span>{t('orContinueWith')}</span>
              <div className="flex-1 border-t border-ecommerce-border" />
            </div>

            <button
              type="button"
              onClick={handleGoToFullLogin}
              className="w-full text-center text-sm text-ecommerce-text-muted hover:text-ecommerce-text-primary transition-colors py-1"
            >
              {t('goToFullLoginPage')}
            </button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}