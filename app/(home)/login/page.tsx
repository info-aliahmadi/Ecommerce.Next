'use client';

import { useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Lock,
  ShieldCheck,
  Truck,
  Headphones,
  ArrowLeft,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

// project imports
import CONFIG from '@root/config';
import LoginForm from '../_components/pages/login-form';
import ForgotPasswordPopup from '../_components/pages/forgot-password-popup';
import { useAuthStore } from '../_lib/store';


// ============================|| LOGIN ||============================ //

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const t = useTranslations('homepage.auth.login');

  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const setForgotPasswordOpen = useAuthStore((s) => s.setForgotPasswordOpen);

  const handleLoginSuccess = useCallback(() => {
    // Redirect will happen via useEffect based on session
  }, []);

  const handleForgotPassword = useCallback(() => {
    setForgotPasswordOpen(true);
  }, [setForgotPasswordOpen]);

  // Redirect based on role after login
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.roles) {
      const userRoles = session.user.roles;
      const hasAdminRole = userRoles.some((role) => CONFIG.ADMIN_ROLES.includes(role));

      if (callbackUrl !== '/') {
        router.push(callbackUrl);
      } else if (hasAdminRole) {
        router.push(CONFIG.DASHBOARD_PATH);
      } else {
        router.push('/profile');
      }
      router.refresh();
    }
  }, [status, session, callbackUrl, router]);

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
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <img
                src="/images/hydrashop.png"
                alt="Logo"
                width={120}
                height={120}
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
          &copy; {new Date().getFullYear()} HydraShop
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

          {/* Shared Login Form */}
          <motion.div variants={itemVariants}>
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              onForgotPassword={handleForgotPassword}
              showInlineError
              idPrefix="page-login"
            />
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
      <ForgotPasswordPopup />
    </div>
  );
};

export default Login;
