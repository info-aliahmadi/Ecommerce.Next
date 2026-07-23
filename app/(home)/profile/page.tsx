'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Star,
  DollarSign,
  Loader2,
  ChevronRight,
} from 'lucide-react';

import { Footer } from '../_components/ecommerce/footer';
import { CartDrawer } from '../_components/ecommerce/cart-drawer';
import { QuickViewModal } from '../_components/ecommerce/quick-view-modal';
import { BackToTop } from '../_components/ecommerce/back-to-top';
import { CompareBar } from '../_components/ecommerce/compare-bar';
import { CompareDrawer } from '../_components/ecommerce/compare-drawer';
import { FlyToCart } from '../_components/ecommerce/fly-to-cart';
import { MobileBottomNav } from '../_components/ecommerce/mobile-bottom-nav';
import { useCartStore, useWishlistStore } from '../_lib/store';

import { Card, CardContent } from '../_components/ui/card';
import { Button } from '../_components/ui/button';
import { Badge } from '../_components/ui/badge';
import { Separator } from '../_components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../_components/ui/avatar';
import ProfileService from '../_services/ProfileService';
import AddressModel from '@root/app/dashboard/(ecommerce)/_types/Common/AddressModel';
import CountryModel from '@root/app/dashboard/(ecommerce)/_types/Common/CountryModel';
import StateProvinceModel from '@root/app/dashboard/(ecommerce)/_types/Common/StateProvinceModel';
import { Header } from '../_components/ecommerce/header';

import { TabId, ActivityItem, NAV_ITEMS, staggerContainer, staggerItem } from './_components/types';
import { DashboardTab } from './_components/dashboard-tab';
import { OrdersTab } from './_components/orders-tab';
import { WishlistTab } from './_components/wishlist-tab';
import { AddressesTab } from './_components/addresses-tab';
import { SettingsTab } from './_components/settings-tab';
import CONFIG from '@root/config';

const INITIAL_ACTIVITIES: ActivityItem[] = [
  { id: 'act1', type: 'order', message: '', time: '2 hours ago' },
  { id: 'act2', type: 'review', message: '', time: '1 day ago' },
  { id: 'act3', type: 'address', message: '', time: '3 days ago' },
  { id: 'act4', type: 'password', message: '', time: '1 week ago' },
];

const pageVariants: any = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

// ─── Profile Page Component ───────────────────────────────────────
function ProfilePageContent() {
  const t = useTranslations();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=/profile');
    }
  }, [status, router]);

  // Local state
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Password
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  // Notifications
  const [notifs, setNotifs] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    push: false,
  });

  // Addresses
  const [addresses, setAddresses] = useState<AddressModel[]>([]);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressModel | null>(null);
  const [addrForm, setAddrForm] = useState<AddressModel | null>(null);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressDeleting, setAddressDeleting] = useState<number | null>(null);
  const [addressSettingDefault, setAddressSettingDefault] = useState<number | null>(null);
  const [countries, setCountries] = useState<CountryModel[]>([]);
  const [states, setStates] = useState<StateProvinceModel[]>([]);

  // Stores
  const wishlistItems = useWishlistStore((s) => s.items);
  const wishlistCount = wishlistItems.length;
  const addToCart = useCartStore((s) => s.addItem);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);

  const fetchAddresses = async () => {
    if (!session?.user?.accessToken) return;
    setAddressesLoading(true);
    try {
      const service = new ProfileService(session.user.accessToken);
      const res = await service.getUserAddresses();
      if (res.succeeded && res.data) setAddresses(res.data);
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') fetchAddresses();
  }, [status, session]);

  useEffect(() => {
    if (addressDialogOpen && session?.user?.accessToken) {
      const service = new ProfileService(session.user.accessToken);
      service.getCountriesForSelect().then((res) => {
        if (res.succeeded && res.data) setCountries(res.data);
      });
    }
  }, [addressDialogOpen, session]);

  useEffect(() => {
    if (addrForm?.countryId && session?.user?.accessToken) {
      const service = new ProfileService(session.user.accessToken);
      service.getStateProvincesForSelect(addrForm.countryId).then((res) => {
        if (res.succeeded && res.data) setStates(res.data);
      });
    } else {
      setStates([]);
    }
  }, [addrForm?.countryId, session]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-ecommerce-red animate-spin" />
      </div>
    );
  }

  const user = session?.user;
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const userAvatar = CONFIG.AVATAR_BASEPATH + user?.avatar || '';

  // Activity messages use translations with params
  const activities: ActivityItem[] = INITIAL_ACTIVITIES.map((a, i) => {
    switch (a.type) {
      case 'order': return { ...a, message: t('homepage.profile.orderPlaced', { number: 1275 - i * 7 }) };
      case 'review': return { ...a, message: t('homepage.profile.reviewWritten', { product: i === 1 ? 'Wireless Headphones' : 'Smart Watch' }) };
      case 'address': return { ...a, message: t('homepage.profile.addressAdded') };
      case 'password': return { ...a, message: t('homepage.profile.passwordChanged') };
      default: return { ...a, message: t('homepage.profile.profilePictureUpdated') };
    }
  });

  // ─── Handlers ─────────────────────────────────────────────────
  const handleUpdatePassword = () => {
    if (!currentPw || !newPw || !confirmPw) return;
    if (newPw !== confirmPw) {
      toast.error('Passwords do not match');
      return;
    }
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    toast.success(t('homepage.profile.passwordUpdated'));
  };

  const openAddAddress = () => {
    setEditingAddress(null);
    setAddrForm({ id: 0, userId: 0, title: '', address1: '', city: '', stateProvinceName: '', stateProvinceId: 0, zipPostalCode: '', countryName: '', countryId: 0, county: '', phoneNumber: '', geoLocation: '', isDefault: false, createdOnUtc: new Date() });
    setAddressDialogOpen(true);
  };

  const openEditAddress = (addr: AddressModel) => {
    setEditingAddress(addr);
    setAddrForm({ ...addr });
    setAddressDialogOpen(true);
  };

  const handleSaveAddress = async () => {
    if (!session?.user?.accessToken || !addrForm) return;
    setAddressSaving(true);
    try {
      const service = new ProfileService(session.user.accessToken);
      const payload: AddressModel = {
        ...addrForm,
        id: editingAddress?.id ?? 0,
        userId: 0,
      };
      const res = editingAddress
        ? await service.updateAddress(payload)
        : await service.addAddress(payload);
      if (res.succeeded && res.data) {
        setAddressDialogOpen(false);
        toast.success(editingAddress ? t('homepage.common.save') : t('homepage.profile.addressAdded'));
        fetchAddresses();
      } else {
        toast.error(res.message ?? t('homepage.profile.addressNotSaved'));
      }
    } catch {
      toast.error(t('homepage.profile.addressNotSaved'));
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!session?.user?.accessToken) return;
    setAddressDeleting(id);
    try {
      const service = new ProfileService(session.user.accessToken);
      const res = await service.deleteAddress(id);
      if (res.succeeded) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        fetchAddresses();
        toast.success(t('homepage.common.delete'));
      } else {
        toast.error(res.message ?? t('homepage.profile.addressNotDeleted'));
      }
    } catch {
      toast.error(t('homepage.profile.addressNotDeleted'));
    } finally {
      setAddressDeleting(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    if (!session?.user?.accessToken) return;
    setAddressSettingDefault(id);
    try {
      const service = new ProfileService(session.user.accessToken);
      const res = await service.setAsDefaultAddress(id);
      if (res.succeeded) {
        if (res.data == true) {
          toast.success(t('homepage.profile.setAsDefaultSuccess'));
          fetchAddresses();
        } else if (res.data == false) toast.error(t('homepage.profile.addressNotSetAsDefault'));
      } else {
        toast.error(res.message ?? t('homepage.profile.addressNotSetAsDefault'));
      }
    } catch {
      toast.error(t('homepage.profile.addressNotSetAsDefault'));
    } finally {
      setAddressSettingDefault(null);
    }
  };

  const handleWishlistAddToCart = (item: typeof wishlistItems[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      variant: item.variant,
      image: item.image,
      categories: item.categories,
    });
    toast.success(t('homepage.common.addToCart'));
  };

  // ─── Stat Cards Data ──────────────────────────────────────────
  const stats = [
    { icon: Package, label: t('homepage.profile.statsTotalOrders'), value: '12', color: 'text-ecommerce-red', bg: 'bg-ecommerce-red/10' },
    { icon: DollarSign, label: t('homepage.profile.statsTotalSpent'), value: '$1,249.00', color: 'text-ecommerce-emerald', bg: 'bg-ecommerce-emerald/10' },
    { icon: Heart, label: t('homepage.profile.statsWishlistItems'), value: String(wishlistCount), color: 'text-ecommerce-rose', bg: 'bg-ecommerce-rose/10' },
    { icon: Star, label: t('homepage.profile.statsReviews'), value: '8', color: 'text-ecommerce-amber', bg: 'bg-ecommerce-amber/10' },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-16 lg:pb-0">
      <Header />
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-ecommerce-surface/80 backdrop-blur-xl border-b border-ecommerce-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-ecommerce-text-secondary hover:text-ecommerce-text-primary transition-colors">
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </Link>
            <h1 className="text-lg font-bold text-ecommerce-text-primary">{t('homepage.profile.title')}</h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-ecommerce-text-secondary hover:text-ecommerce-red" onClick={() => signOut()}>
              <LogOut className="w-4 h-4" />
              <span className="ms-2">{t('homepage.profile.logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Tab Navigation */}
        <nav className="md:hidden mb-6 overflow-x-auto -mx-4 px-4 scrollbar-hide" aria-label="Profile tabs">
          <div className="flex gap-1 bg-ecommerce-surface rounded-xl p-1 min-w-max">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${isActive
                    ? 'bg-white dark:bg-ecommerce-surface-hover text-ecommerce-red shadow-sm'
                    : 'text-ecommerce-text-secondary hover:text-ecommerce-text-primary'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t(item.labelKey)}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-72 shrink-0">
            <div className="sticky top-24">
              {/* User Card */}
              <Card className="bg-ecommerce-surface border-ecommerce-border overflow-hidden mb-4">
                <div className="h-20 bg-gradient-to-r from-ecommerce-red to-ecommerce-rose" />
                <div className="px-5 pb-5 -mt-8">
                  <Avatar className="w-16 h-16 border-4 border-ecommerce-surface shadow-lg">
                    {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
                    <AvatarFallback className="bg-ecommerce-red/10 text-ecommerce-red font-bold text-lg">
                      {userName.split(' ').map((n: any) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="mt-3 font-bold text-ecommerce-text-primary">{userName}</h3>
                  <p className="text-sm text-ecommerce-text-muted mt-0.5">{userEmail}</p>
                </div>
              </Card>

              {/* Nav */}
              <Card className="bg-ecommerce-surface border-ecommerce-border p-2">
                <nav className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                          ? 'bg-ecommerce-red/10 text-ecommerce-red'
                          : 'text-ecommerce-text-secondary hover:bg-ecommerce-surface-hover hover:text-ecommerce-text-primary'
                          }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                        {t(item.labelKey)}
                        {item.id === 'wishlist' && wishlistCount > 0 && (
                          <Badge className="ms-auto bg-ecommerce-red text-white text-[10px] px-1.5 py-0 h-5 min-w-5 flex items-center justify-center">
                            {wishlistCount}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </nav>
                <Separator className="my-2 bg-ecommerce-border" />
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ecommerce-text-secondary hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 w-full"
                >
                  <LogOut className="w-4.5 h-4.5" onClick={() => signOut()} />
                  {t('homepage.profile.logout')}
                </button>
              </Card>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <DashboardTab
                    t={t}
                    userName={userName}
                    userEmail={userEmail}
                    userAvatar={userAvatar}
                    stats={stats}
                    activities={activities}
                    setActiveTab={setActiveTab}
                  />
                </motion.div>
              )}
              {activeTab === 'orders' && (
                <motion.div key="orders" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <OrdersTab t={t} />
                </motion.div>
              )}
              {activeTab === 'wishlist' && (
                <motion.div key="wishlist" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <WishlistTab
                    t={t}
                    items={wishlistItems}
                    onAddToCart={handleWishlistAddToCart}
                    onRemove={removeWishlistItem}
                  />
                </motion.div>
              )}
              {activeTab === 'addresses' && (
                <motion.div key="addresses" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <AddressesTab
                    t={t}
                    addresses={addresses}
                    onAdd={openAddAddress}
                    onEdit={openEditAddress}
                    onDelete={handleDeleteAddress}
                    onSetDefault={handleSetDefault}
                    dialogOpen={addressDialogOpen}
                    setDialogOpen={setAddressDialogOpen}
                    editingAddress={editingAddress}
                    addrForm={addrForm}
                    setAddrForm={setAddrForm}
                    onSave={handleSaveAddress}
                    loading={addressesLoading}
                    saving={addressSaving}
                    deletingId={addressDeleting}
                    settingDefaultId={addressSettingDefault}
                    countries={countries}
                    states={states}
                  />
                </motion.div>
              )}
              {activeTab === 'settings' && (
                <motion.div key="settings" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <SettingsTab t={t} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <QuickViewModal />
      <BackToTop />
      <MobileBottomNav />
      <FlyToCart />
      <CompareBar />
      <CompareDrawer />
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────
export default function ProfilePage() {
  return (
    <ProfilePageContent />
  );
}
