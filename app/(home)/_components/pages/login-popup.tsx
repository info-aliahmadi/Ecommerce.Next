'use client';

import { useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import {
  LogIn,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@(home)/_components/ui/dialog';
import { useAuthStore, useLocaleStore, RTL_LOCALES } from '@(home)/_lib/store';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoginForm from './login-form';
import ForgotPasswordPopup from './forgot-password-popup';
import CONFIG from '@root/config';

export default function LoginPopup() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const isLoginOpen = useAuthStore((s) => s.isLoginOpen);
  const setLoginOpen = useAuthStore((s) => s.setLoginOpen);
  const setRegisterOpen = useAuthStore((s) => s.setRegisterOpen);
  const setForgotPasswordOpen = useAuthStore((s) => s.setForgotPasswordOpen);
  const locale = useLocaleStore((s) => s.locale);
  const isRTL = RTL_LOCALES.includes(locale);

  const t = useTranslations('homepage.auth.login');

  const handleClose = useCallback(
    (open: boolean) => {
      setLoginOpen(open);
    },
    [setLoginOpen],
  );

  const handleGoToRegister = useCallback(() => {
    setLoginOpen(false);
    setRegisterOpen(true);
  }, [setLoginOpen, setRegisterOpen]);

  const handleGoToFullLogin = useCallback(() => {
    setLoginOpen(false);
    router.push('/login');
  }, [setLoginOpen, router]);

  const handleLoginSuccess = useCallback(() => {
    setLoginOpen(false);
  }, [setLoginOpen]);

  const handleForgotPassword = useCallback(() => {
    setLoginOpen(false);
    setForgotPasswordOpen(true);
  }, [setLoginOpen, setForgotPasswordOpen]);

  // Redirect based on role after login
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.roles) {
      const userRoles = session.user.roles;
      debugger
      const hasAdminRole = userRoles.some((role) => CONFIG.ADMIN_ROLES.includes(role));

      if (hasAdminRole) {
        router.push(CONFIG.DASHBOARD_PATH);
      } else {
        router.push('/profile');
      }
    }
  }, [status, session, router]);

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

          {/* Shared Login Form */}
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onForgotPassword={handleForgotPassword}
            idPrefix="popup-login"
          />

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
      <ForgotPasswordPopup />
    </Dialog>
  );
}
