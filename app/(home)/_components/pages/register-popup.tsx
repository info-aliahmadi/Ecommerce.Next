'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@(home)/_components/ui/dialog';
import { useAuthStore} from '@(home)/_lib/store';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import RegisterForm from './register-form';
import { Locale } from '@root/locales/Language';
import { resolveLocale } from '@root/utils/resolver';

export default function RegisterPopup() {
  const router = useRouter();

  const isRegisterOpen = useAuthStore((s) => s.isRegisterOpen);
  const setRegisterOpen = useAuthStore((s) => s.setRegisterOpen);

    const locale = useLocale() as Locale;
    const isRTL = resolveLocale(locale).direction === 'rtl';

  const t = useTranslations('homepage.auth.register');

  const handleClose = useCallback(
    (open: boolean) => {
      setRegisterOpen(open);
    },
    [setRegisterOpen],
  );

  const handleGoToLogin = useCallback(() => {
    setRegisterOpen(false);
    router.push('/login');
  }, [setRegisterOpen, router]);

  const handleRegisterSuccess = useCallback(() => {
    setRegisterOpen(false);
  }, [setRegisterOpen]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  } as const;

  return (
    <Dialog open={isRegisterOpen} onOpenChange={handleClose}>
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
              <UserPlus className="w-7 h-7 text-white" />
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

          {/* Shared Register Form */}
          <RegisterForm
            onRegisterSuccess={handleRegisterSuccess}
            idPrefix="popup-register"
          />

          {/* Login link */}
          <p className="text-center text-sm text-ecommerce-text-muted mt-5">
            {t('hasAccount')}{' '}
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
