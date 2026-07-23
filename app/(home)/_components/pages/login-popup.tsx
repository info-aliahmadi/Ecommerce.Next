'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import {
  LogIn,
  Phone,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  Send,
  CheckCircle2,
} from 'lucide-react';
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
import { Checkbox } from '@(home)/_components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@(home)/_components/ui/tabs';
import { useAuthStore, useLocaleStore, RTL_LOCALES } from '@(home)/_lib/store';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function LoginPopup() {
  const router = useRouter();

  // Shared state
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);

  // Email + password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Phone + OTP state
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  const isLoginOpen = useAuthStore((s) => s.isLoginOpen);
  const setLoginOpen = useAuthStore((s) => s.setLoginOpen);
  const setRegisterOpen = useAuthStore((s) => s.setRegisterOpen);
  const locale = useLocaleStore((s) => s.locale);
  const isRTL = RTL_LOCALES.includes(locale);

  const t = useTranslations('auth.login');

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setRememberMe(false);
    setPhone('');
    setOtpCode('');
    setOtpSent(false);
    setOtpSending(false);
    setOtpCountdown(0);
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
    router.push('/login');
  }, [setLoginOpen, resetForm]);

  // ── Email + Password login ──
  const handleEmailLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) {
        toast.error(t('errorEmail'));
        return;
      }
      if (!password || password.length < 4) {
        toast.error(t('errorInvalid'));
        return;
      }

      setIsLoading(true);
      try {
        const result = await signIn('credentials', {
          redirect: false,
          username: email,
          password,
        });

        if (result?.error) {
          toast.error(t('errorInvalid'));
          return;
        }

        toast.success(t('success'));
        setLoginOpen(false);
        resetForm();
      } catch {
        toast.error(t('errorGeneric'));
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, t, setLoginOpen, resetForm],
  );

  // ── Phone OTP: send code ──
  const handleSendOtp = useCallback(async () => {
    if (!phone.trim()) {
      toast.error(t('errorPhone'));
      return;
    }

    setOtpSending(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      
      const data = await response.json();

      if (!data.succeeded) {
        toast.error(data.message || t('errorOtpSend'));
        return;
      }

      setOtpSent(true);
      toast.success(t('otpSent'));

      // Start countdown
      setOtpCountdown(60);
      const interval = setInterval(() => {
        setOtpCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      toast.error(t('errorGeneric'));
    } finally {
      setOtpSending(false);
    }
  }, [phone, t]);

  // ── Phone OTP: verify and login ──
  const handleOtpLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!otpCode.trim() || otpCode.length < 4) {
        toast.error(t('errorOtpInvalid'));
        return;
      }

      setIsLoading(true);
      try {
        const result = await signIn('otp', {
          redirect: false,
          phone,
          code: otpCode,
        });

        if (result?.error) {
          toast.error(t('errorOtpInvalid'));
          return;
        }

        toast.success(t('success'));
        setLoginOpen(false);
        resetForm();
      } catch {
        toast.error(t('errorGeneric'));
      } finally {
        setIsLoading(false);
      }
    },
    [phone, otpCode, t, setLoginOpen, resetForm],
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
          transition={{ duration: 0.35, ease: 'easeOut' as const }}
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

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'email' | 'phone')}>
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="email" className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                {t('tabEmail')}
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                {t('tabPhone')}
              </TabsTrigger>
            </TabsList>

            {/* ── Email + Password Tab ── */}
            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="popup-login-email"
                    className="text-sm font-medium text-ecommerce-text-secondary"
                  >
                    {t('emailLabel')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="popup-login-email"
                      type="email"
                      inputMode="email"
                      placeholder={t('emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 pe-10 border-ecommerce-border bg-ecommerce-surface text-ecommerce-text-primary rounded-md"
                      autoComplete="email"
                      disabled={isLoading}
                      dir="ltr"
                    />
                    <div className="absolute end-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted pointer-events-none">
                      <Mail className="w-4 h-4" />
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
                    <span className="text-ecommerce-text-muted font-normal text-xs">
                      ({t('passwordPlaceholder')})
                    </span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="popup-login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('passwordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pe-10 border-ecommerce-border bg-ecommerce-surface text-ecommerce-text-primary rounded-md"
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
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
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
                    <span className="flex items-center gap-2">{t('submit')}</span>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* ── Phone + OTP Tab ── */}
            <TabsContent value="phone">
              <form
                onSubmit={otpSent ? handleOtpLogin : (e) => { e.preventDefault(); handleSendOtp(); }}
                className="space-y-4"
              >
                {/* Phone */}
                <div className="space-y-2">
                  <Label
                    htmlFor="popup-otp-phone"
                    className="text-sm font-medium text-ecommerce-text-secondary"
                  >
                    {t('phoneLabel')}
                  </Label>
                  <div className="relative flex">
                    <span className="text-ecommerce-text-muted inline-flex items-center px-3 rounded-s-md border border-r-0 border-ecommerce-border bg-ecommerce-surface text-sm shrink-0">
                      +98
                    </span>
                    <Input
                      id="popup-otp-phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder={t('phonePlaceholder')}
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))
                      }
                      className="h-11 rounded-s-none border-ecommerce-border bg-ecommerce-surface text-ecommerce-text-primary rounded-e-md"
                      autoComplete="tel"
                      disabled={isLoading || otpSending || otpSent}
                      dir="ltr"
                      minLength={10}
                      maxLength={10}
                    />
                    <div className="absolute end-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted pointer-events-none">
                      <Phone className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* OTP Code (shown after code is sent) */}
                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="popup-otp-code"
                      className="text-sm font-medium text-ecommerce-text-secondary"
                    >
                      {t('otpCodeLabel')}
                    </Label>
                    <Input
                      id="popup-otp-code"
                      type="text"
                      inputMode="numeric"
                      placeholder={t('otpCodePlaceholder')}
                      value={otpCode}
                      onChange={(e) =>
                        setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                      }
                      className="h-11 border-ecommerce-border bg-ecommerce-surface text-ecommerce-text-primary rounded-md tracking-[0.3em] text-center text-lg"
                      autoComplete="one-time-code"
                      disabled={isLoading}
                      minLength={5}
                      maxLength={5}
                      dir="ltr"
                      autoFocus
                    />

                    {/* Resend countdown */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-ecommerce-text-muted flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        {t('otpSentTo')} {phone}
                      </span>
                      {otpCountdown > 0 ? (
                        <span className="text-ecommerce-text-muted">
                          {t('resendIn')} {otpCountdown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpSending}
                          className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
                        >
                          {t('resendCode')}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading || otpSending || (!otpSent && !phone.trim()) || (otpSent && !otpCode.trim())}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold h-11 rounded-lg transition-all duration-200 shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('loggingIn')}
                    </span>
                  ) : otpSending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('sendingCode')}
                    </span>
                  ) : otpSent ? (
                    <span className="flex items-center gap-2">{t('verifyAndLogin')}</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      {t('sendCode')}
                    </span>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

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
