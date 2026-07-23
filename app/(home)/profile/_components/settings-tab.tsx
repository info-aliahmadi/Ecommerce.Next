'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Pencil, Check, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../_components/ui/card';
import { Button } from '../../_components/ui/button';
import { Input } from '../../_components/ui/input';
import { Label } from '../../_components/ui/label';
import { Switch } from '../../_components/ui/switch';
import { Separator } from '../../_components/ui/separator';
import { Alert, AlertDescription } from '../../_components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../_components/ui/alert-dialog';
import AccountService from '@root/app/dashboard/(auth)/_service/AccountService';

export function SettingsTab({
  t,
  isEditing,
  editName,
  editEmail,
  setEditName,
  setEditEmail,
  onEdit,
  onSave,
  onCancel,
  notifs,
  setNotifs,
}: Readonly<{
  t: ReturnType<typeof useTranslations>;
  isEditing: boolean;
  editName: string;
  editEmail: string;
  setEditName: (v: string) => void;
  setEditEmail: (v: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  notifs: { orderUpdates: boolean; promotions: boolean; newsletter: boolean; push: boolean };
  setNotifs: (n: { orderUpdates: boolean; promotions: boolean; newsletter: boolean; push: boolean }) => void;
}>) {
  const { data: session } = useSession();
  const jwt = session?.user?.accessToken;

  // Password state
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(true);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Change password form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Add password form
  const [addPasswordEmail, setAddPasswordEmail] = useState(session?.user?.email || '');
  const [addPasswordValue, setAddPasswordValue] = useState('');
  const [addConfirmPassword, setAddConfirmPassword] = useState('');

  // Visibility toggles
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showAddConfirm, setShowAddConfirm] = useState(false);

  useEffect(() => {
    const checkPassword = async () => {
      if (!jwt) return;
      setPasswordLoading(true);
      try {
        const service = new AccountService(jwt);
        const res = await service.hasPassword();
        setHasPassword(res?.data ? res.data : false);
      } catch {
        setHasPassword(false);
      } finally {
        setPasswordLoading(false);
      }
    };
    checkPassword();
  }, [jwt]);

  useEffect(() => {
    if (session?.user?.email) {
      setAddPasswordEmail(session.user.email);
    }
  }, [session]);

  const resetPasswordForm = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setAddPasswordValue('');
    setAddConfirmPassword('');
  };

  const handleChangePassword = async () => {
    if (!jwt) return;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error(t('homepage.profile.fieldRequired'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('homepage.profile.passwordMismatch'));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t('homepage.profile.passwordMinLength'));
      return;
    }

    setPasswordSubmitting(true);
    try {
      const service = new AccountService(jwt);
      const res = await service.changePassword({ oldPassword, newPassword });
      if (res.succeeded) {
        toast.success(t('homepage.profile.passwordUpdated'));
        resetPasswordForm();
      } else {
        toast.error(res.errors?.[0]?.description || res.message || t('homepage.profile.passwordChangeFailed'));
      }
    } catch {
      toast.error(t('homepage.profile.passwordChangeFailed'));
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleAddPassword = async () => {
    if (!jwt || !addPasswordEmail) return;

    if (!addPasswordValue || !addConfirmPassword) {
      toast.error(t('homepage.profile.fieldRequired'));
      return;
    }
    if (addPasswordValue !== addConfirmPassword) {
      toast.error(t('homepage.profile.passwordMismatch'));
      return;
    }
    if (addPasswordValue.length < 6) {
      toast.error(t('homepage.profile.passwordMinLength'));
      return;
    }

    setPasswordSubmitting(true);
    try {
      const service = new AccountService(jwt);
      const res = await service.addPassword({ email: addPasswordEmail, password: addPasswordValue });
      if (res.succeeded) {
        toast.success(t('homepage.profile.passwordAdded'));
        setHasPassword(true);
        resetPasswordForm();
      } else {
        toast.error(res.errors?.[0]?.description || res.message || t('homepage.profile.passwordAddFailed'));
      }
    } catch {
      toast.error(t('homepage.profile.passwordAddFailed'));
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.accountSettings')}</h2>

      {/* Personal Information */}
      <Card className="bg-ecommerce-surface border-ecommerce-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-ecommerce-text-primary">{t('homepage.profile.personalInfo')}</CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" className="border-ecommerce-border text-ecommerce-text-secondary hover:text-ecommerce-red hover:border-ecommerce-red transition-colors" onClick={onEdit}>
                <Pencil className="w-3.5 h-3.5 me-1.5" />
                {t('homepage.profile.editProfile')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {isEditing ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm text-ecommerce-text-primary">{t('homepage.profile.fullName')}</Label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-ecommerce-text-primary">{t('homepage.profile.email')}</Label>
                  <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white" onClick={onSave}>
                  <Check className="w-3.5 h-3.5 me-1.5" />
                  {t('homepage.profile.saveChanges')}
                </Button>
                <Button size="sm" variant="outline" className="border-ecommerce-border text-ecommerce-text-secondary" onClick={onCancel}>
                  {t('homepage.profile.cancelEdit')}
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-ecommerce-text-muted mb-1">{t('homepage.profile.fullName')}</p>
                <p className="text-sm font-medium text-ecommerce-text-primary">{editName}</p>
              </div>
              <div>
                <p className="text-xs text-ecommerce-text-muted mb-1">{t('homepage.profile.email')}</p>
                <p className="text-sm font-medium text-ecommerce-text-primary">{editEmail}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card className="bg-ecommerce-surface border-ecommerce-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-ecommerce-text-primary">
            {hasPassword ? t('homepage.profile.changePassword') : t('homepage.profile.addPassword')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {passwordLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-ecommerce-red animate-spin" />
            </div>
          ) : hasPassword === false ? (
            <>
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
                  {t('homepage.profile.noPasswordInfo')}
                </AlertDescription>
              </Alert>
              <div className="space-y-2 max-w-sm">
                <Label className="text-sm text-ecommerce-text-primary">{t('homepage.profile.email')}</Label>
                <Input type="email" value={addPasswordEmail} onChange={(e) => setAddPasswordEmail(e.target.value)} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
              </div>
              <div className="space-y-2 max-w-sm">
                <Label className="text-sm text-ecommerce-text-primary">{t('homepage.profile.newPassword')}</Label>
                <div className="relative">
                  <Input type={showAddPassword ? 'text' : 'password'} value={addPasswordValue} onChange={(e) => setAddPasswordValue(e.target.value)} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary pr-10" />
                  <button type="button" onClick={() => setShowAddPassword(!showAddPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted hover:text-ecommerce-text-primary">
                    {showAddPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-w-sm">
                <Label className="text-sm text-ecommerce-text-primary">{t('homepage.profile.confirmPassword')}</Label>
                <div className="relative">
                  <Input type={showAddConfirm ? 'text' : 'password'} value={addConfirmPassword} onChange={(e) => setAddConfirmPassword(e.target.value)} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary pr-10" />
                  <button type="button" onClick={() => setShowAddConfirm(!showAddConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted hover:text-ecommerce-text-primary">
                    {showAddConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button size="sm" className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white" onClick={handleAddPassword} disabled={passwordSubmitting}>
                {passwordSubmitting && <Loader2 className="w-4 h-4 me-1.5 animate-spin" />}
                {t('homepage.profile.addPassword')}
              </Button>
            </>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 max-w-lg">
                <div className="space-y-2">
                  <Label className="text-sm text-ecommerce-text-primary">{t('homepage.profile.currentPassword')}</Label>
                  <div className="relative">
                    <Input type={showOldPassword ? 'text' : 'password'} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary pr-10" />
                    <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted hover:text-ecommerce-text-primary">
                      {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 max-w-lg">
                <div className="space-y-2">
                  <Label className="text-sm text-ecommerce-text-primary">{t('homepage.profile.newPassword')}</Label>
                  <div className="relative">
                    <Input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary pr-10" />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted hover:text-ecommerce-text-primary">
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-ecommerce-text-primary">{t('homepage.profile.confirmPassword')}</Label>
                  <div className="relative">
                    <Input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary pr-10" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ecommerce-text-muted hover:text-ecommerce-text-primary">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <Button size="sm" className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white" onClick={handleChangePassword} disabled={passwordSubmitting}>
                {passwordSubmitting && <Loader2 className="w-4 h-4 me-1.5 animate-spin" />}
                {t('homepage.profile.updatePassword')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-ecommerce-surface border-ecommerce-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-ecommerce-text-primary">{t('homepage.profile.notificationPrefs')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ecommerce-text-primary">{t('homepage.profile.orderUpdates')}</p>
                <p className="text-xs text-ecommerce-text-muted">{t('homepage.profile.emailNotifications')}</p>
              </div>
              <Switch
                checked={notifs.orderUpdates}
                onCheckedChange={(checked) => setNotifs({ ...notifs, orderUpdates: checked })}
              />
            </div>
            <Separator className="bg-ecommerce-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ecommerce-text-primary">{t('homepage.profile.promotions')}</p>
                <p className="text-xs text-ecommerce-text-muted">{t('homepage.profile.emailNotifications')}</p>
              </div>
              <Switch
                checked={notifs.promotions}
                onCheckedChange={(checked) => setNotifs({ ...notifs, promotions: checked })}
              />
            </div>
            <Separator className="bg-ecommerce-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ecommerce-text-primary">{t('homepage.profile.newsletter')}</p>
                <p className="text-xs text-ecommerce-text-muted">{t('homepage.profile.emailNotifications')}</p>
              </div>
              <Switch
                checked={notifs.newsletter}
                onCheckedChange={(checked) => setNotifs({ ...notifs, newsletter: checked })}
              />
            </div>
            <Separator className="bg-ecommerce-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ecommerce-text-primary">{t('homepage.profile.pushNotifications')}</p>
                <p className="text-xs text-ecommerce-text-muted">{t('homepage.profile.pushNotifications')}</p>
              </div>
              <Switch
                checked={notifs.push}
                onCheckedChange={(checked) => setNotifs({ ...notifs, push: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-ecommerce-surface border-red-200 dark:border-red-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-red-500">{t('homepage.profile.deleteAccount')}</CardTitle>
          <CardDescription className="text-ecommerce-text-muted text-sm">
            {t('homepage.profile.deleteAccountDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900/50 dark:hover:bg-red-900/20">
                <Trash2 className="w-4 h-4 me-1.5" />
                {t('homepage.profile.deleteAccount')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-ecommerce-surface border-ecommerce-border">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-ecommerce-text-primary">{t('homepage.profile.deleteAccount')}</AlertDialogTitle>
                <AlertDialogDescription className="text-ecommerce-text-muted">
                  {t('homepage.profile.deleteAccountConfirm')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-ecommerce-border text-ecommerce-text-secondary">
                  {t('homepage.common.cancel')}
                </AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white">
                  {t('homepage.common.delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
