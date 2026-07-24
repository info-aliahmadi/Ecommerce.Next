'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import {
  Phone,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@(home)/_components/ui/button';
import { Input } from '@(home)/_components/ui/input';
import { Label } from '@(home)/_components/ui/label';
import { Checkbox } from '@(home)/_components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@(home)/_components/ui/tabs';
import { PhoneInput } from '@(home)/_components/shared/phone-input';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface LoginFormProps {
  onLoginSuccess?: () => void;
  onError?: (msg: string) => void;
  onForgotPassword?: () => void;
  showInlineError?: boolean;
  idPrefix?: string;
}

export default function LoginForm({
  onLoginSuccess,
  onError,
  onForgotPassword,
  showInlineError = false,
  idPrefix = 'login',
}: LoginFormProps) {
  const t = useTranslations('homepage.auth.login');

  // Shared state
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setLoading(false);
    setError(null);
  }, []);

  const handleError = useCallback(
    (msg: string) => {
      if (showInlineError) {
        setError(msg);
      }
      if (onError) {
        onError(msg);
      } else {
        toast.error(msg);
      }
    },
    [showInlineError, onError],
  );

  // ── Email + Password login ──
  const handleEmailLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!email.trim()) {
        handleError(t('errorEmail'));
        return;
      }
      if (!password || password.length < 4) {
        handleError(t('errorInvalid'));
        return;
      }

      setLoading(true);
      try {
        const result = await signIn('credentials', {
          redirect: false,
          username: email,
          password,
        });

        if (result?.error) {
          handleError(t('errorInvalid'));
          return;
        }

        toast.success(t('success'));
        resetForm();
        onLoginSuccess?.();
      } catch {
        handleError(t('errorGeneric'));
      } finally {
        setLoading(false);
      }
    },
    [email, password, t, handleError, onLoginSuccess, resetForm],
  );

  // ── Phone OTP: send code ──
  const handleSendOtp = useCallback(async () => {
    if (!phone.trim()) {
      toast.error(t('errorPhone'));
      return;
    }

    setOtpSending(true);
    setError(null);
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
      setError(null);

      if (!otpCode.trim() || otpCode.length < 4) {
        handleError(t('errorOtpInvalid'));
        return;
      }

      setLoading(true);
      try {
        const result = await signIn('otp', {
          redirect: false,
          phone,
          code: otpCode,
        });

        if (result?.error) {
          handleError(t('errorOtpInvalid'));
          return;
        }

        toast.success(t('success'));
        resetForm();
        onLoginSuccess?.();
      } catch {
        handleError(t('errorGeneric'));
      } finally {
        setLoading(false);
      }
    },
    [phone, otpCode, t, handleError, onLoginSuccess, resetForm],
  );

  return (
    <div>
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
                htmlFor={`${idPrefix}-email`}
                className="text-sm font-medium text-ecommerce-text-secondary"
              >
                {t('emailLabel')}
              </Label>
              <div className="relative">
                <Input
                  id={`${idPrefix}-email`}
                  type="email"
                  inputMode="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  className="h-11 pe-10 border-ecommerce-border bg-ecommerce-surface text-ecommerce-text-primary rounded-md"
                  autoComplete="email"
                  disabled={loading}
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
                htmlFor={`${idPrefix}-password`}
                className="text-sm font-medium text-ecommerce-text-secondary"
              >
                {t('password')}{' '}
                <span className="text-ecommerce-text-muted font-normal text-xs">
                  ({t('passwordPlaceholder')})
                </span>
              </Label>
              <div className="relative">
                <Input
                  id={`${idPrefix}-password`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  className="h-11 pe-10 border-ecommerce-border bg-ecommerce-surface text-ecommerce-text-primary rounded-md"
                  autoComplete="current-password"
                  disabled={loading}
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

            {/* Remember me + Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`${idPrefix}-remember-me`}
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-ecommerce-border data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <Label
                  htmlFor={`${idPrefix}-remember-me`}
                  className="text-ecommerce-text-muted text-sm cursor-pointer select-none"
                >
                  {t('rememberMe')}
                </Label>
              </div>
              {onForgotPassword && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {t('forgotPassword')}
                </button>
              )}
            </div>

            {/* Inline Error */}
            <AnimatePresence>
              {showInlineError && error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-ecommerce-red text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold h-11 rounded-lg transition-all duration-200 shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
            >
              {loading ? (
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
                htmlFor={`${idPrefix}-phone`}
                className="text-sm font-medium text-ecommerce-text-secondary"
              >
                {t('phoneLabel')}
              </Label>
              <PhoneInput
                id={`${idPrefix}-phone`}
                value={phone}
                onChange={(v) => {
                  setPhone(v);
                  if (error) setError(null);
                }}
                placeholder={t('phonePlaceholder')}
                disabled={loading || otpSending || otpSent}
              />
            </div>

            {/* OTP Code (shown after code is sent) */}
            {otpSent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <Label
                  htmlFor={`${idPrefix}-otp-code`}
                  className="text-sm font-medium text-ecommerce-text-secondary"
                >
                  {t('otpCodeLabel')}
                </Label>
                <Input
                  id={`${idPrefix}-otp-code`}
                  type="text"
                  inputMode="numeric"
                  placeholder={t('otpCodePlaceholder')}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    if (error) setError(null);
                  }}
                  className="h-11 border-ecommerce-border bg-ecommerce-surface text-ecommerce-text-primary rounded-md tracking-[0.3em] text-center text-lg"
                  autoComplete="one-time-code"
                  disabled={loading}
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

            {/* Inline Error */}
            <AnimatePresence>
              {showInlineError && error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-ecommerce-red text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || otpSending || (!otpSent && !phone.trim()) || (otpSent && !otpCode.trim())}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold h-11 rounded-lg transition-all duration-200 shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
            >
              {loading ? (
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
    </div>
  );
}
