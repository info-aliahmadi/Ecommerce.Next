'use client';

import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { Button } from '@(home)/_components/ui/button';
import { Input } from '@(home)/_components/ui/input';
import { Label } from '@(home)/_components/ui/label';
import { PhoneInput } from '@(home)/_components/shared/phone-input';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import Fetch from '@root/utils/Fetch';
import { User } from 'next-auth';
import Result from '@root/app/types/Result';

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
  onError?: (msg: string) => void;
  showInlineError?: boolean;
  idPrefix?: string;
}

export default function RegisterForm({
  onRegisterSuccess,
  onError,
  showInlineError = false,
  idPrefix = 'register',
}: Readonly<RegisterFormProps>) {
  const t = useTranslations('homepage.auth.register');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const resetForm = useCallback(() => {
    setName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setIsSubmitting(false);
    setError(null);
  }, []);

  const validate = useCallback((): boolean => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password;
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName || trimmedName.length < 2) {
      handleError(t('errorName'));
      return false;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      handleError(t('errorEmail', { defaultValue: 'Please enter a valid email' }));
      return false;
    }

    if (!trimmedPassword || trimmedPassword.length < 6) {
      handleError(t('errorPassword', { defaultValue: 'Password must be at least 6 characters' }));
      return false;
    }

    if (!trimmedPhone || trimmedPhone.replace(/\D/g, '').length < 10) {
      handleError(t('errorPhone'));
      return false;
    }

    return true;
  }, [name, email, password, phoneNumber, t, handleError]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validate()) return;

      setIsSubmitting(true);

      try {
        let config: RequestInit = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        }
        let registerModel: RegisterModel = {
          name: name.trim(),
          email: email.trim(),
          password: password,
          phoneNumber: phoneNumber.trim(),
        }
        const response = await Fetch.Post<AccountResult>('/api/auth/register', registerModel, config);

        if (!response.succeeded) {
          handleError(response.message);
          return;
        }

        const result = await signIn('credentials', {
          redirect: false,
          username: phoneNumber.trim(),
          password: password,
        });

        if (result?.error) {
          toast.success(t('successRegistered'));
          resetForm();
          onRegisterSuccess?.();
          return;
        }

        toast.success(t('success'));
        resetForm();
        onRegisterSuccess?.();
      } catch {
        handleError(t('errorGeneric'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, email, password, phoneNumber, validate, t, handleError, resetForm, onRegisterSuccess],
  );

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name field */}
        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-name`}
            className="text-sm font-medium text-ecommerce-text-secondary"
          >
            {t('name')}
          </Label>
          <Input
            id={`${idPrefix}-name`}
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); if (error) setError(null); }}
            placeholder={t('namePlaceholder')}
            className="rounded-lg"
            autoComplete="name"
            disabled={isSubmitting}
          />
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-email`}
            className="text-sm font-medium text-ecommerce-text-secondary"
          >
            {t('email', { defaultValue: 'Email' })}
          </Label>
          <Input
            id={`${idPrefix}-email`}
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }}
            placeholder={t('emailPlaceholder', { defaultValue: 'you@example.com' })}
            className="rounded-lg"
            autoComplete="email"
            disabled={isSubmitting}
          />
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-password`}
            className="text-sm font-medium text-ecommerce-text-secondary"
          >
            {t('password', { defaultValue: 'Password' })}
          </Label>
          <Input
            id={`${idPrefix}-password`}
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (error) setError(null); }}
            placeholder={t('passwordPlaceholder', { defaultValue: 'At least 6 characters' })}
            className="rounded-lg"
            autoComplete="new-password"
            disabled={isSubmitting}
          />
        </div>

        {/* Phone field */}
        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-phone`}
            className="text-sm font-medium text-ecommerce-text-secondary"
          >
            {t('phone')}
          </Label>
          <PhoneInput
            id={`${idPrefix}-phone`}
            value={phoneNumber}
            onChange={(v) => { setPhoneNumber(v); if (error) setError(null); }}
            placeholder={t('phonePlaceholder')}
            disabled={isSubmitting}
          />
        </div>

        {/* Inline Error */}
        {showInlineError && error && (
          <p className="text-ecommerce-red text-sm">{error}</p>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full bg-ecommerce-purple hover:bg-ecommerce-purple/90 text-white font-semibold h-11 rounded-lg transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('registering')}
            </span>
          ) : (
            t('submit')
          )}
        </Button>
      </form>
    </div>
  );
}
