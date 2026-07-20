'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck, Truck, Headphones, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

// shadcn/ui components
import { Button } from '@(home)/_components/ui/button';
import { Input } from '@(home)/_components/ui/input';
import { Label } from '@(home)/_components/ui/label';

// project imports
import CONFIG from '@root/config';

// ============================|| LOGIN ||============================ //

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('auth.login');

  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
        callbackUrl,
      });

      if (result?.error) {
        setError(t('errorInvalid'));
        return;
      }

      if (callbackUrl != '/') {
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
  };

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
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="login-username" className="ecommerce-text-secondary text-sm font-medium">
                {t('phone')}
              </Label>
              <div className="relative">
                <Input
                  id="login-username"
                  type="text"
                  placeholder={t('phonePlaceholder')}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  className="pe-10"
                  autoComplete="username"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="login-password" className="ecommerce-text-secondary text-sm font-medium">
                {t('password')}
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
                  className="pe-10"
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
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
