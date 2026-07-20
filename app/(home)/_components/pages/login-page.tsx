'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, ShieldCheck, Truck, Headphones, ArrowRight, Loader2, User, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { useUIStore, useAuthStore, useLocaleStore, RTL_LOCALES } from '../../_lib/store';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('auth.login');
  const { locale } = useLocaleStore();
  const { navigate, goHome, currentPage } = useUIStore();
  const { user, setUser, isAuthenticated, setRegisterOpen } = useAuthStore();

  const isRTL = RTL_LOCALES.includes(locale);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('profile');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = useCallback((): boolean => {
    const newErrors: { phone?: string; password?: string } = {};

    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned || cleaned.length < 7) {
      newErrors.phone = t('errorPhone');
    }

    if (password && password.length < 4) {
      newErrors.password = t('errorInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [phone, password, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

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
      goHome();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errorGeneric');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 15);
    setPhone(raw);
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info('Coming soon');
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setRegisterOpen(true);
  };

  const handleGuestBrowse = (e: React.MouseEvent) => {
    e.preventDefault();
    goHome();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const panelVariants = {
    hidden: { opacity: 0, x: isRTL ? 60 : -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen flex bg-ecommerce-surface"
    >
      {/* ── Left decorative panel (hidden on mobile) ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={panelVariants}
        className="hidden lg:flex lg:w-[480px] xl:w-[520px] relative overflow-hidden flex-col justify-between p-12"
        style={{
          background:
            'linear-gradient(160deg, #7c3aed 0%, #6d28d9 30%, #5b21b6 60%, #4c1d95 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-16 right-0 w-96 h-96 rounded-full bg-purple-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" />

        {/* Top section – Logo & tagline */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">
              ShopSphere
            </span>
          </div>

          <h1 className="text-white text-3xl font-bold leading-tight mb-3">
            {t('title')}
          </h1>
          <p className="text-purple-200/80 text-lg leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Feature bullets */}
        <div className="relative z-10 space-y-5">
          {[
            { icon: ShieldCheck, label: 'Secure Checkout' },
            { icon: Truck, label: 'Fast Delivery' },
            { icon: Headphones, label: '24/7 Support' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/90 text-sm font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom attribution */}
        <p className="relative z-10 text-purple-300/40 text-xs">
          &copy; {new Date().getFullYear()} ShopSphere. All rights reserved.
        </p>
      </motion.div>

      {/* ── Right side – Login form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md"
        >
          {/* Mobile logo (shown only on small screens) */}
          <motion.div variants={itemVariants} className="lg:hidden flex items-center gap-2 mb-4 justify-center">
            <div className="w-9 h-9 rounded-lg bg-ecommerce-purple flex items-center justify-center">
              <span className="text-white font-bold text-base">S</span>
            </div>
            <span className="ecommerce-text-primary text-xl font-bold">
              ShopSphere
            </span>
          </motion.div>

          {/* Back button */}
          <motion.div variants={itemVariants} className="mb-6">
            <button
              type="button"
              onClick={goHome}
              className="inline-flex items-center gap-2 text-sm text-ecommerce-text-muted hover:text-ecommerce-text-primary transition-colors group"
            >
              <ArrowLeft className={`w-4 h-4 transition-transform ${isRTL ? 'group-hover:translate-x-1 rtl:-scale-x-100' : 'group-hover:-translate-x-1'}`} />
              <span>{t('backToHome')}</span>
            </button>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="ecommerce-text-primary text-2xl font-bold mb-2">
              {t('welcomeBack')}
            </h2>
            <p className="ecommerce-text-muted text-sm">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="login-phone" className="ecommerce-text-secondary text-sm font-medium">
                {t('phone')}
              </Label>
              <div className="relative flex">
                <span className="ecommerce-text-muted inline-flex items-center px-3 rounded-s-md border border-r-0 border-ecommerce-border bg-ecommerce-surface text-sm shrink-0">
                  +1
                </span>
                <Input
                  id="login-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder={t('phonePlaceholder')}
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`rounded-s-none ${
                    errors.phone ? 'border-ecommerce-red focus-visible:ring-ecommerce-red' : ''
                  }`}
                  autoComplete="tel"
                  dir="ltr"
                />
                <div className="absolute end-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted pointer-events-none">
                  <Phone className="w-4 h-4" />
                </div>
              </div>
              <AnimatePresence>
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-ecommerce-red text-xs"
                  >
                    {errors.phone}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="login-password" className="ecommerce-text-secondary text-sm font-medium">
                {t('password')}{' '}
                <span className="ecommerce-text-muted font-normal">({t('passwordPlaceholder')})</span>
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`pe-10 ${
                    errors.password ? 'border-ecommerce-red focus-visible:ring-ecommerce-red' : ''
                  }`}
                  autoComplete="current-password"
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
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-ecommerce-red text-xs"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-ecommerce-border data-[state=checked]:bg-ecommerce-purple data-[state=checked]:border-ecommerce-purple"
                />
                <Label
                  htmlFor="remember-me"
                  className="ecommerce-text-muted text-sm cursor-pointer select-none"
                >
                  {t('rememberMe')}
                </Label>
              </div>
              <a
                href="#"
                onClick={handleForgotPassword}
                className="ecommerce-purple text-sm font-medium hover:underline"
              >
                {t('forgotPassword')}
              </a>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ecommerce-purple hover:bg-ecommerce-purple/90 text-white font-semibold h-11 rounded-lg transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('loggingIn')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t('submit')}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </motion.form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-ecommerce-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-ecommerce-surface px-3 ecommerce-text-muted">
                {t('orContinueWith')}
              </span>
            </div>
          </motion.div>

          {/* Register link */}
          <motion.div variants={itemVariants} className="text-center space-y-2">
            <p className="ecommerce-text-muted text-sm">
              {t('noAccount')}{' '}
              <a
                href="#"
                onClick={handleRegisterClick}
                className="ecommerce-purple font-semibold hover:underline"
              >
                {t('registerLink')}
              </a>
            </p>
            <a
              href="#"
              onClick={handleGuestBrowse}
              className="ecommerce-text-muted text-sm hover:text-ecommerce-text-secondary transition-colors inline-flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              {t('guestBrowse')}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}