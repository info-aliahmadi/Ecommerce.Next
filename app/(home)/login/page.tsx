'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Truck,
  Headphones,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Phone,
  Mail,
  Send,
  CheckCircle2,
} from 'lucide-react';

// shadcn/ui components
import { Button } from '@(home)/_components/ui/button';
import { Input } from '@(home)/_components/ui/input';
import { Label } from '@(home)/_components/ui/label';
import { Checkbox } from '@(home)/_components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@(home)/_components/ui/tabs';
import { toast } from 'sonner';

// project imports
import CONFIG from '@root/config';

// ============================|| LOGIN ||============================ //

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('auth.login');

  const callbackUrl = searchParams.get('callbackUrl') || '/';

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

  // ── Email + Password login ──
  const handleEmailLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!email.trim()) {
        setError(t('errorEmail'));
        return;
      }
      if (!password || password.length < 4) {
        setError(t('errorInvalid'));
        return;
      }

      setLoading(true);
      try {
        const result = await signIn('credentials', {
          redirect: false,
          username: email,
          password,
          callbackUrl,
        });

        if (result?.error) {
          setError(t('errorInvalid'));
          return;
        }

        toast.success(t('success'));
        if (callbackUrl !== '/') {
          router.push(callbackUrl);
        } else {
          router.push(CONFIG.DASHBOARD_PATH);
        }
        router.refresh();
      } catch {
        setError(t('errorGeneric'));
      } finally {
        setLoading(false);
      }
    },
    [email, password, callbackUrl, t, router],
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
        setError(t('errorOtpInvalid'));
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
          setError(t('errorOtpInvalid'));
          return;
        }

        toast.success(t('success'));
        if (callbackUrl !== '/') {
          router.push(callbackUrl);
        } else {
          router.push(CONFIG.DASHBOARD_PATH);
        }
        router.refresh();
      } catch {
        setError(t('errorGeneric'));
      } finally {
        setLoading(false);
      }
    },
    [phone, otpCode, callbackUrl, t, router],
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
  } as const;

  const panelVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
  } as const;

  return (
    <div className="min-h-screen flex bg-ecommerce-surface">
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
              <Image
                src="/images/apple-touch-icon.png"
                alt="Logo"
                width={24}
                height={24}
              />
            </div>
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
              <span className="text-white/90 text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* Bottom attribution */}
        <p className="relative z-10 text-purple-300/40 text-xs">
          &copy; {new Date().getFullYear()} Hydra Cashier System
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
          {/* Back button */}
          <motion.div variants={itemVariants} className="mb-6">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-ecommerce-text-muted hover:text-ecommerce-text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>{t('backToHome')}</span>
            </a>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 mb-4 shadow-lg shadow-purple-500/25">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-ecommerce-text-primary text-2xl font-bold mb-2">
              {t('welcomeBack')}
            </h2>
            <p className="text-ecommerce-text-muted text-sm">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'email' | 'phone')}>
              <TabsList className="w-full grid grid-cols-2 mb-6">
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
                    <Label htmlFor="login-email" className="text-sm font-medium text-ecommerce-text-secondary">
                      {t('emailLabel')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-email"
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
                    <Label htmlFor="login-password" className="text-sm font-medium text-ecommerce-text-secondary">
                      {t('password')}{' '}
                      <span className="text-ecommerce-text-muted font-normal text-xs">
                        ({t('passwordPlaceholder')})
                      </span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
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

                  {/* Remember me */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                      className="border-ecommerce-border data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label htmlFor="remember-me" className="text-ecommerce-text-muted text-sm cursor-pointer select-none">
                      {t('rememberMe')}
                    </Label>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
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
                    className="w-full bg-ecommerce-purple hover:bg-ecommerce-purple/90 text-white font-semibold h-11 rounded-lg transition-colors"
                  >
                    {loading ? (
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
                    <Label htmlFor="login-phone" className="text-sm font-medium text-ecommerce-text-secondary">
                      {t('phoneLabel')}
                    </Label>
                    <div className="relative flex">
                      <span className="text-ecommerce-text-muted inline-flex items-center px-3 rounded-s-md border border-r-0 border-ecommerce-border bg-ecommerce-surface text-sm shrink-0">
                        +98
                      </span>
                      <Input
                        id="login-phone"
                        type="tel"
                        inputMode="numeric"
                        placeholder={t('phonePlaceholder')}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, '').slice(0, 15));
                          if (error) setError(null);
                        }}
                        className="h-11 rounded-s-none border-ecommerce-border bg-ecommerce-surface text-ecommerce-text-primary rounded-e-md"
                        autoComplete="tel"
                        disabled={loading || otpSending || otpSent}
                        dir="ltr"
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
                      <Label htmlFor="login-otp-code" className="text-sm font-medium text-ecommerce-text-secondary">
                        {t('otpCodeLabel')}
                      </Label>
                      <Input
                        id="login-otp-code"
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

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
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
                    className="w-full bg-ecommerce-purple hover:bg-ecommerce-purple/90 text-white font-semibold h-11 rounded-lg transition-colors"
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
                      <span className="flex items-center gap-2">
                        {t('verifyAndLogin')}
                        <ArrowRight className="w-4 h-4" />
                      </span>
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
          </motion.div>

          {/* Register link */}
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-sm text-ecommerce-text-muted">
              {t('noAccount')}{' '}
              <a
                href="/register"
                className="text-purple-600 font-semibold hover:text-purple-700 underline underline-offset-2 transition-colors"
              >
                {t('registerLink')}
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
