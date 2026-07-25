'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Pencil, Check, Trash2, Loader2, Eye, EyeOff, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { useSession, signOut } from 'next-auth/react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../_components/ui/card';
import { Button } from '../../_components/ui/button';
import { Input } from '../../_components/ui/input';
import { Label } from '../../_components/ui/label';
import { Switch } from '../../_components/ui/switch';
import { Separator } from '../../_components/ui/separator';
import { Alert, AlertDescription } from '../../_components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '../../_components/ui/avatar';
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
import { UserModel } from '@root/app/dashboard/(auth)/_types/User/UserModel';
import CONFIG from '@root/config';
import { PhoneInput } from '@(home)/_components/shared/phone-input';

export function SettingsTab() {
  const t = useTranslations();
  const { data: session, update } = useSession();
  const jwt = session?.user?.accessToken;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User data state
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<string>('');

  // Password state
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(true);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Change password form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Add password form
  const [addPasswordEmail, setAddPasswordEmail] = useState('');
  const [addPasswordValue, setAddPasswordValue] = useState('');
  const [addConfirmPassword, setAddConfirmPassword] = useState('');

  // Visibility toggles
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAddPassword, setShowAddPassword] = useState(false);

  // Delete account state
  const [deleting, setDeleting] = useState(false);
  const [showAddConfirm, setShowAddConfirm] = useState(false);

  // Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!jwt) return;
      setLoading(true);
      try {
        const service = new AccountService(jwt);
        const userData = await service.getCurrentUser();
        setUser(userData);
        setEditName(userData.name || '');
        setEditEmail(userData.email || '');
        setEditPhoneNumber(userData.phoneNumber || '');
        setAddPasswordEmail(userData.email || '');
      } catch {
        toast.error(t('homepage.profile.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [jwt, t]);

  // Check if user has password
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

  const resetPasswordForm = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setAddPasswordValue('');
    setAddConfirmPassword('');
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting the same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(t('homepage.profile.avatarInvalidType'));
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      toast.error(t('homepage.profile.avatarTooLarge', { size: sizeMB, max: '2' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        const result = reader.result as string;
        setAvatarPreview(result);
        setAvatarFile(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async () => {
    if (!jwt || !user) return;

    if (!editName.trim()) {
      toast.error(t('homepage.profile.nameRequired'));
      return;
    }

    setSaving(true);
    try {
      const service = new AccountService(jwt);
      const updatedUser: UserModel = {
        ...user,
        name: editName.trim(),
        email: editEmail.trim(),
        phoneNumber: editPhoneNumber.trim(),
        avatarFile: avatarFile || undefined,
        avatar: avatarFile ? undefined : user.avatar,
      };

      const result = await service.updateCurrentUser(updatedUser);
      if (result.succeeded) {
        toast.success(t('homepage.profile.profileUpdated'));
        setIsEditing(false);
        setAvatarFile('');

        // Refresh user data
        const userData = await service.getCurrentUser();
        setUser(userData);

        // Update session
        update({
          ...session,
          user: {
            ...session?.user,
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
          },
        });
      } else {
        toast.error(result.message || t('homepage.profile.updateError'));
      }
    } catch {
      toast.error(t('homepage.profile.updateError'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setEditPhoneNumber(user?.phoneNumber || '');
    setAvatarPreview(null);
    setAvatarFile('');
    setIsEditing(false);
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

  const handleDeleteAccount = async () => {
    if (!jwt) return;

    setDeleting(true);
    try {
      const service = new AccountService(jwt);
      const result = await service.deleteCurrentUser();
      if (result.succeeded) {
        toast.success(t('homepage.profile.accountDeleted'));
        await signOut({ callbackUrl: '/' });
      } else {
        toast.error(result.message || t('homepage.profile.deleteAccountFailed'));
      }
    } catch {
      toast.error(t('homepage.profile.deleteAccountFailed'));
    } finally {
      setDeleting(false);
    }
  };

  const getAvatarSrc = () => {
    if (avatarPreview) return avatarPreview;
    if (user?.avatar) {
      return user.avatar.startsWith('data:') ? user.avatar : CONFIG.AVATAR_BASEPATH + user.avatar;
    }
    return CONFIG.UNKNOWN_USER_BASEPATH;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-ecommerce-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.accountSettings')}</h2>

      {/* Personal Information */}
      <Card className="bg-ecommerce-surface border-ecommerce-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-ecommerce-text-primary">{t('homepage.profile.personalInfo')}</CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" className="border-ecommerce-border text-ecommerce-text-secondary hover:text-ecommerce-red hover:border-ecommerce-red transition-colors" onClick={() => setIsEditing(true)}>
                <Pencil className="w-3.5 h-3.5 me-1.5" />
                {t('homepage.profile.editProfile')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {isEditing ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Avatar Section */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-ecommerce-surface shadow-lg">
                    <AvatarImage src={getAvatarSrc()} alt={editName} />
                    <AvatarFallback className="bg-ecommerce-red/10 text-ecommerce-red font-bold text-xl">
                      {getInitials(editName || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm text-ecommerce-text-primary">{t('homepage.profile.fullName')}</Label>
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-ecommerce-text-primary">{t('homepage.profile.email')}</Label>
                      <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" dir="ltr" />
                    </div>
                  </div>
                  <PhoneInput
                    value={editPhoneNumber}
                    onChange={setEditPhoneNumber}
                    placeholder={t('homepage.profile.phonePlaceholder')}
                  />

                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white" onClick={handleSaveProfile} disabled={saving}>
                  {saving && <Loader2 className="w-3.5 h-3.5 me-1.5 animate-spin" />}
                  <Check className="w-3.5 h-3.5 me-1.5" />
                  {t('homepage.profile.saveChanges')}
                </Button>
                <Button size="sm" variant="outline" className="border-ecommerce-border text-ecommerce-text-secondary" onClick={handleCancelEdit} disabled={saving}>
                  {t('homepage.profile.cancelEdit')}
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-4 border-ecommerce-surface shadow-lg">
                  <AvatarImage src={getAvatarSrc()} alt={user?.name} />
                  <AvatarFallback className="bg-ecommerce-red/10 text-ecommerce-red font-bold text-xl">
                    {getInitials(user?.name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-3 sm:grid-cols-2 flex-1">
                  <div>
                    <p className="text-xs text-ecommerce-text-muted mb-1">{t('homepage.profile.fullName')}</p>
                    <p className="text-sm font-medium text-ecommerce-text-primary">{user?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ecommerce-text-muted mb-1">{t('homepage.profile.email')}</p>
                    <p className="text-sm font-medium text-ecommerce-text-primary">{user?.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ecommerce-text-muted mb-1">{t('homepage.profile.phoneNumber')}</p>
                    <p className="text-sm font-medium text-ecommerce-text-primary" dir="ltr">{user?.phoneNumber || '-'}</p>
                  </div>
                </div>
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
              <Switch defaultChecked />
            </div>
            <Separator className="bg-ecommerce-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ecommerce-text-primary">{t('homepage.profile.promotions')}</p>
                <p className="text-xs text-ecommerce-text-muted">{t('homepage.profile.emailNotifications')}</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-ecommerce-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ecommerce-text-primary">{t('homepage.profile.newsletter')}</p>
                <p className="text-xs text-ecommerce-text-muted">{t('homepage.profile.emailNotifications')}</p>
              </div>
              <Switch />
            </div>
            <Separator className="bg-ecommerce-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ecommerce-text-primary">{t('homepage.profile.pushNotifications')}</p>
                <p className="text-xs text-ecommerce-text-muted">{t('homepage.profile.pushNotifications')}</p>
              </div>
              <Switch />
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
                <AlertDialogCancel className="border-ecommerce-border text-ecommerce-text-secondary" disabled={deleting}>
                  {t('homepage.common.cancel')}
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting && <Loader2 className="w-4 h-4 me-1.5 animate-spin" />}
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
