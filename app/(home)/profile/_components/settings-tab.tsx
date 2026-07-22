'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Pencil, Check, Trash2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../_components/ui/card';
import { Button } from '../../_components/ui/button';
import { Input } from '../../_components/ui/input';
import { Label } from '../../_components/ui/label';
import { Switch } from '../../_components/ui/switch';
import { Separator } from '../../_components/ui/separator';
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
  currentPw,
  newPw,
  confirmPw,
  setCurrentPw,
  setNewPw,
  setConfirmPw,
  onUpdatePassword,
  notifs,
  setNotifs,
}: {
  t: ReturnType<typeof useTranslations>;
  isEditing: boolean;
  editName: string;
  editEmail: string;
  setEditName: (v: string) => void;
  setEditEmail: (v: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  currentPw: string;
  newPw: string;
  confirmPw: string;
  setCurrentPw: (v: string) => void;
  setNewPw: (v: string) => void;
  setConfirmPw: (v: string) => void;
  onUpdatePassword: () => void;
  notifs: { orderUpdates: boolean; promotions: boolean; newsletter: boolean; push: boolean };
  setNotifs: (n: { orderUpdates: boolean; promotions: boolean; newsletter: boolean; push: boolean }) => void;
}) {
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

      {/* Change Password */}
      <Card className="bg-ecommerce-surface border-ecommerce-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-ecommerce-text-primary">{t('homepage.profile.changePassword')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="space-y-2 max-w-sm">
            <Label className="text-sm text-ecommerce-text-primary">{t('homepage.profile.currentPassword')}</Label>
            <Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 max-w-lg">
            <div className="space-y-2">
              <Label className="text-sm text-ecommerce-text-primary">{t('homepage.profile.newPassword')}</Label>
              <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-ecommerce-text-primary">{t('homepage.profile.confirmPassword')}</Label>
              <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
            </div>
          </div>
          <Button size="sm" className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white" onClick={onUpdatePassword}>
            {t('homepage.profile.updatePassword')}
          </Button>
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
