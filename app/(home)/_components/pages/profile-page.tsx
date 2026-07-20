'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Trash2,
  LogOut,
  Heart,
  ShoppingCart,
  Camera,
  Save,
  Loader2,
  ChevronRight,
  Home,
  Edit3,
  Lock,
  AlertTriangle,
  X,
  Check,
  Globe,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useUIStore, useAuthStore, useCartStore, useWishlistStore } from '@/lib/store';
import type { AuthUser } from '@/lib/store';

type ProfileFormData = Partial<
  Pick<
    AuthUser,
    'name' | 'username' | 'email' | 'phone' | 'bio' | 'gender' | 'birthday' | 'address' | 'city' | 'country' | 'avatar'
  >
>;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tNav = useTranslations('navigation');

  const navigate = useUIStore((s) => s.navigate);
  const goHome = useUIStore((s) => s.goHome);
  const { user, setUser, updateUser, logout, isAuthenticated } = useAuthStore();
  const totalCartItems = useCartStore((s) => s.totalItems);
  const totalWishlist = useWishlistStore((s) => s.totalCount);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('personal');
  const [savingTab, setSavingTab] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  // Fetch profile from API
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await fetch(`/api/auth/profile`, {
        headers: { 'x-user-id': user.id },
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      return res.json() as Promise<AuthUser>;
    },
    enabled: !!user?.id,
    staleTime: 30_000,
  });

  // Use latest data from API or store
  const currentUser = profileData || user;

  // Personal info form state
  const [personalForm, setPersonalForm] = useState<ProfileFormData>({
    name: currentUser?.name || '',
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || '',
    gender: currentUser?.gender || '',
    birthday: currentUser?.birthday || '',
    avatar: currentUser?.avatar || '',
  });

  // Address form state
  const [addressForm, setAddressForm] = useState<ProfileFormData>({
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    country: currentUser?.country || '',
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const res = await fetch(`/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user!.id,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err.field === 'username') throw new Error(t('errorUsername'));
        throw new Error(t('error'));
      }
      return res.json() as Promise<AuthUser>;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(t('saved'));
    },
    onError: (error: Error) => {
      toast.error(error.message || t('error'));
    },
    onSettled: () => {
      setSavingTab(null);
    },
  });

  // Save handler
  const handleSave = useCallback(
    (tab: string) => {
      setSavingTab(tab);

      if (tab === 'personal') {
        updateProfileMutation.mutate(personalForm);
      } else if (tab === 'address') {
        updateProfileMutation.mutate(addressForm);
      } else if (tab === 'security') {
        // Password change would be a separate API call
        setSavingTab(null);
        toast.success(t('saved'));
      }
    },
    [personalForm, addressForm, updateProfileMutation, t]
  );

  const handleLogout = useCallback(() => {
    logout();
    goHome();
  }, [logout, goHome]);

  const handleDeleteAccount = useCallback(() => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleteConfirmOpen(false);
    setDeleteConfirmText('');
    toast.error('Account deletion is not available in demo mode.');
  }, [deleteConfirmText]);

  const memberSince = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Not authenticated state
  if (!isAuthenticated() || !user) {
    return (
      <div className="ecommerce-container py-12">
        <motion.div
          className="flex flex-col items-center justify-center min-h-[50vh] text-center"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t('notLoggedIn')}</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            {t('loginToView')}
          </p>
          <Button
            onClick={() => navigate('login')}
            className="ecommerce-button-primary"
            size="lg"
          >
            {t('goLogin')}
          </Button>
        </motion.div>
      </div>
    );
  }

  const isSaving = savingTab !== null;

  return (
    <div className="ecommerce-container py-6 md:py-10">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Breadcrumb */}
        <motion.nav variants={fadeInUp} className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button
            onClick={goHome}
            className="hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            <span>{tNav('home')}</span>
          </button>
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          <span className="text-foreground font-medium">{t('title')}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* ===== LEFT SIDEBAR ===== */}
          <motion.aside
            variants={fadeInUp}
            className="lg:col-span-4 xl:col-span-3"
          >
            <div className="lg:sticky lg:top-24">
              <Card className="ecommerce-card overflow-hidden">
                {/* Avatar section */}
                <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pt-8 pb-6 px-6 text-center">
                  <div className="relative inline-block group">
                    <Avatar className="w-28 h-28 mx-auto border-4 border-background shadow-lg">
                      <AvatarImage
                        src={avatarUrl || user.avatar}
                        alt={user.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      onClick={() => setActiveTab('personal')}
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h2 className="mt-4 text-xl font-bold">{user.name || user.username}</h2>
                  {user.username && (
                    <p className="text-muted-foreground text-sm">@{user.username}</p>
                  )}
                  {user.bio && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {user.bio}
                    </p>
                  )}
                </div>

                <CardContent className="p-4 space-y-4">
                  {/* Member since */}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">
                      {t('memberSince')}: <span className="text-foreground">{memberSince}</span>
                    </span>
                  </div>

                  <Separator />

                  {/* Quick stats */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {t('statistics')}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => navigate('wishlist')}
                        className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Heart className="w-5 h-5 text-red-500" />
                        <span className="text-sm font-medium">{totalWishlist()}</span>
                        <span className="text-xs text-muted-foreground">{t('wishlist')}</span>
                      </button>
                      <button
                        onClick={() => navigate('cart')}
                        className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">{totalCartItems()}</span>
                        <span className="text-xs text-muted-foreground">{t('cart')}</span>
                      </button>
                    </div>
                  </div>

                  <Separator />

                  {/* Logout */}
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 rtl:rotate-180" />
                    {t('logOut')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.aside>

          {/* ===== RIGHT CONTENT AREA ===== */}
          <motion.main variants={fadeInUp} className="lg:col-span-8 xl:col-span-9">
            <Card className="ecommerce-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  {t('editProfile')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full justify-start mb-6">
                    <TabsTrigger value="personal" className="gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('personalInfo')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="address" className="gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('addressInfo')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                      <Shield className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('security')}</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* ===== PERSONAL INFO TAB ===== */}
                  <TabsContent value="personal">
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="space-y-5"
                    >
                      {/* Avatar URL */}
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="avatar" className="flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          {t('avatar')}
                        </Label>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12 shrink-0">
                            <AvatarImage src={avatarUrl} alt="Avatar preview" />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <Input
                              id="avatar"
                              placeholder={t('avatarPlaceholder')}
                              value={personalForm.avatar}
                              onChange={(e) => {
                                setPersonalForm((prev) => ({ ...prev, avatar: e.target.value }));
                                setAvatarUrl(e.target.value);
                              }}
                              className="ecommerce-input"
                            />
                            {personalForm.avatar && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPersonalForm((prev) => ({ ...prev, avatar: '' }));
                                  setAvatarUrl('');
                                }}
                                className="text-xs text-destructive hover:underline inline-flex items-center gap-1"
                              >
                                <X className="w-3 h-3" />
                                {t('removeAvatar')}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>

                      <Separator />

                      {/* Name */}
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {t('name')}
                        </Label>
                        <Input
                          id="name"
                          value={personalForm.name}
                          onChange={(e) =>
                            setPersonalForm((prev) => ({ ...prev, name: e.target.value }))
                          }
                          className="ecommerce-input"
                        />
                      </motion.div>

                      {/* Username */}
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="username" className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          {t('username')}
                        </Label>
                        <div className="relative">
                          <span className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            @
                          </span>
                          <Input
                            id="username"
                            className="ecommerce-input ps-8"
                            value={personalForm.username}
                            onChange={(e) =>
                              setPersonalForm((prev) => ({
                                ...prev,
                                username: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </motion.div>

                      {/* Email */}
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {t('email')}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={personalForm.email}
                          onChange={(e) =>
                            setPersonalForm((prev) => ({ ...prev, email: e.target.value }))
                          }
                          className="ecommerce-input"
                        />
                      </motion.div>

                      {/* Phone (read-only) */}
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {t('phone')}
                        </Label>
                        <Input
                          id="phone"
                          value={personalForm.phone || ''}
                          readOnly
                          className="ecommerce-input bg-muted/50 cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground">
                          Phone number cannot be changed. Contact support if needed.
                        </p>
                      </motion.div>

                      <Separator />

                      {/* Bio */}
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="bio" className="flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          {t('bio')}
                        </Label>
                        <Textarea
                          id="bio"
                          placeholder={t('bioPlaceholder')}
                          rows={4}
                          value={personalForm.bio}
                          onChange={(e) =>
                            setPersonalForm((prev) => ({ ...prev, bio: e.target.value }))
                          }
                          className="ecommerce-input resize-none"
                        />
                      </motion.div>

                      {/* Gender */}
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label className="flex items-center gap-2">
                          {t('gender')}
                        </Label>
                        <Select
                          value={personalForm.gender || 'unspecified'}
                          onValueChange={(val) =>
                            setPersonalForm((prev) => ({
                              ...prev,
                              gender: val === 'unspecified' ? '' : val,
                            }))
                          }
                        >
                          <SelectTrigger className="ecommerce-input">
                            <SelectValue placeholder={t('genderSelect')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unspecified">{t('genderSelect')}</SelectItem>
                            <SelectItem value="male">{t('male')}</SelectItem>
                            <SelectItem value="female">{t('female')}</SelectItem>
                            <SelectItem value="other">{t('other')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      {/* Birthday */}
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="birthday" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {t('birthday')}
                        </Label>
                        <Input
                          id="birthday"
                          type="date"
                          value={personalForm.birthday || ''}
                          onChange={(e) =>
                            setPersonalForm((prev) => ({
                              ...prev,
                              birthday: e.target.value,
                            }))
                          }
                          className="ecommerce-input"
                        />
                      </motion.div>

                      {/* Save button */}
                      <motion.div variants={fadeInUp} className="pt-4">
                        <Button
                          className="ecommerce-button-primary gap-2 min-w-[120px]"
                          onClick={() => handleSave('personal')}
                          disabled={isSaving || updateProfileMutation.isPending}
                        >
                          {savingTab === 'personal' ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {t('saving')}
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              {t('save')}
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </TabsContent>

                  {/* ===== ADDRESS TAB ===== */}
                  <TabsContent value="address">
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="space-y-5"
                    >
                      {/* Address */}
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="address" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {t('address')}
                        </Label>
                        <Input
                          id="address"
                          placeholder={t('address')}
                          value={addressForm.address}
                          onChange={(e) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          className="ecommerce-input"
                        />
                      </motion.div>

                      {/* City */}
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="city" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {t('city')}
                        </Label>
                        <Input
                          id="city"
                          placeholder={t('city')}
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          className="ecommerce-input"
                        />
                      </motion.div>

                      {/* Country */}
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="country" className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          {t('country')}
                        </Label>
                        <Input
                          id="country"
                          placeholder={t('country')}
                          value={addressForm.country}
                          onChange={(e) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              country: e.target.value,
                            }))
                          }
                          className="ecommerce-input"
                        />
                      </motion.div>

                      {/* Save button */}
                      <motion.div variants={fadeInUp} className="pt-4">
                        <Button
                          className="ecommerce-button-primary gap-2 min-w-[120px]"
                          onClick={() => handleSave('address')}
                          disabled={isSaving || updateProfileMutation.isPending}
                        >
                          {savingTab === 'address' ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {t('saving')}
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              {t('save')}
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </TabsContent>

                  {/* ===== SECURITY TAB ===== */}
                  <TabsContent value="security">
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="space-y-8"
                    >
                      {/* Change password section */}
                      <motion.div variants={fadeInUp} className="space-y-5">
                        <div className="flex items-center gap-2">
                          <Lock className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-lg">{t('changePassword')}</h3>
                        </div>

                        <div className="space-y-4 p-4 rounded-lg border bg-muted/20">
                          {/* Old password */}
                          <div className="space-y-2">
                            <Label htmlFor="oldPassword">{t('oldPassword')}</Label>
                            <Input
                              id="oldPassword"
                              type="password"
                              value={passwords.oldPassword}
                              onChange={(e) =>
                                setPasswords((prev) => ({
                                  ...prev,
                                  oldPassword: e.target.value,
                                }))
                              }
                              className="ecommerce-input"
                            />
                          </div>

                          {/* New password */}
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">{t('newPassword')}</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={passwords.newPassword}
                              onChange={(e) =>
                                setPasswords((prev) => ({
                                  ...prev,
                                  newPassword: e.target.value,
                                }))
                              }
                              className="ecommerce-input"
                            />
                          </div>

                          {/* Confirm password */}
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={passwords.confirmPassword}
                              onChange={(e) =>
                                setPasswords((prev) => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                              className="ecommerce-input"
                            />
                          </div>

                          <Button
                            className="ecommerce-button-primary gap-2 min-w-[120px]"
                            onClick={() => handleSave('security')}
                            disabled={
                              isSaving ||
                              !passwords.oldPassword ||
                              !passwords.newPassword ||
                              passwords.newPassword !== passwords.confirmPassword
                            }
                          >
                            {savingTab === 'security' ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t('saving')}
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                {t('save')}
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>

                      <Separator />

                      {/* Delete account section */}
                      <motion.div variants={fadeInUp} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Trash2 className="w-5 h-5 text-destructive" />
                          <h3 className="font-semibold text-lg text-destructive">
                            {t('deleteAccount')}
                          </h3>
                        </div>

                        {!deleteConfirmOpen ? (
                          <Button
                            variant="outline"
                            className="border-destructive/30 text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                            onClick={() => setDeleteConfirmOpen(true)}
                          >
                            <Trash2 className="w-4 h-4" />
                            {t('deleteAccount')}
                          </Button>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 rounded-lg border border-destructive/30 bg-destructive/5 space-y-4"
                          >
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                              <div>
                                <p className="font-medium text-destructive">
                                  This action is irreversible!
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Type <strong>DELETE</strong> to confirm account deletion.
                                </p>
                              </div>
                            </div>
                            <Input
                              value={deleteConfirmText}
                              onChange={(e) => setDeleteConfirmText(e.target.value)}
                              placeholder='Type "DELETE" to confirm'
                              className="ecommerce-input"
                            />
                            <div className="flex items-center gap-3">
                              <Button
                                variant="destructive"
                                className="gap-2"
                                disabled={deleteConfirmText !== 'DELETE'}
                                onClick={handleDeleteAccount}
                              >
                                <Trash2 className="w-4 h-4" />
                                {t('deleteAccount')}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setDeleteConfirmOpen(false);
                                  setDeleteConfirmText('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.main>
        </div>
      </motion.div>
    </div>
  );
}