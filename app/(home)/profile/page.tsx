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
  ShoppingCart,
  Star,
  DollarSign,
  Eye,
  Truck,
  Pencil,
  Trash2,
  Plus,
  ChevronRight,
  ShoppingBag,
  PackageCheck,
  AlertTriangle,
  Check,
  X,
  Loader2,
} from 'lucide-react';

import { Footer } from '../_components/ecommerce/footer';
import { CartDrawer } from '../_components/ecommerce/cart-drawer';
import { QuickViewModal } from '../_components/ecommerce/quick-view-modal';
import { BackToTop } from '../_components/ecommerce/back-to-top';
import { CompareBar } from '../_components/ecommerce/compare-bar';
import { CompareDrawer } from '../_components/ecommerce/compare-drawer';
import { FlyToCart } from '../_components/ecommerce/fly-to-cart';
import { MobileBottomNav } from '../_components/ecommerce/mobile-bottom-nav';
import { ProductCard } from '../_components/ecommerce/product-card';
import { useCartStore, useWishlistStore, useCompareStore } from '../_lib/store';
import CategoryDisplayModel from '../_types/CategoryDisplayModel';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../_components/ui/card';
import { Button } from '../_components/ui/button';
import { Input } from '../_components/ui/input';
import { Badge } from '../_components/ui/badge';
import { Separator } from '../_components/ui/separator';
import { Switch } from '../_components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../_components/ui/avatar';
import { Label } from '../_components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../_components/ui/dialog';
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
} from '../_components/ui/alert-dialog';
import ProductVariantDisplayModel from '../_types/ProductVariantDisplayModel';
import FileUploadModel from '@root/app/dashboard/(filestorage)/_types/FileUploadModel';
import ProfileService from '../_services/ProfileService';
import AddressModel from '@root/app/dashboard/(ecommerce)/_types/Common/AddressModel';
import CountryModel from '@root/app/dashboard/(ecommerce)/_types/Common/CountryModel';
import StateProvinceModel from '@root/app/dashboard/(ecommerce)/_types/Common/StateProvinceModel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../_components/ui/select';
import { Header } from '../_components/ecommerce/header';

// ─── Types ────────────────────────────────────────────────────────
type TabId = 'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'settings';

interface MockOrder {
  id: string;
  orderNum: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  total: number;
}



interface ActivityItem {
  id: string;
  type: 'order' | 'review' | 'address' | 'password' | 'avatar';
  message: string;
  time: string;
}

// ─── Mock Data ────────────────────────────────────────────────────
const MOCK_ORDERS: MockOrder[] = [
  { id: 'o1', orderNum: 1247, date: '2024-12-15', status: 'delivered', items: 3, total: 289.97 },
  { id: 'o2', orderNum: 1251, date: '2025-01-03', status: 'shipped', items: 1, total: 149.99 },
  { id: 'o3', orderNum: 1268, date: '2025-01-18', status: 'processing', items: 2, total: 449.50 },
  { id: 'o4', orderNum: 1275, date: '2025-02-01', status: 'pending', items: 4, total: 359.96 },
];



const INITIAL_ACTIVITIES: ActivityItem[] = [
  { id: 'act1', type: 'order', message: '', time: '2 hours ago' },
  { id: 'act2', type: 'review', message: '', time: '1 day ago' },
  { id: 'act3', type: 'address', message: '', time: '3 days ago' },
  { id: 'act4', type: 'password', message: '', time: '1 week ago' },
];

// ─── Sidebar Navigation Config ────────────────────────────────────
const NAV_ITEMS: { id: TabId; icon: typeof LayoutDashboard; labelKey: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, labelKey: 'homepage.profile.dashboard' },
  { id: 'orders', icon: Package, labelKey: 'homepage.profile.orders' },
  { id: 'wishlist', icon: Heart, labelKey: 'homepage.profile.wishlist' },
  { id: 'addresses', icon: MapPin, labelKey: 'homepage.profile.addresses' },
  { id: 'settings', icon: Settings, labelKey: 'homepage.profile.settings' },
];

// ─── Status Badge Config ──────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; bg: string; labelKey: string }> = {
  pending: { color: 'text-ecommerce-amber', bg: 'bg-ecommerce-amber/10', labelKey: 'homepage.profile.pending' },
  processing: { color: 'text-blue-500', bg: 'bg-blue-500/10', labelKey: 'homepage.profile.processing' },
  shipped: { color: 'text-ecommerce-purple', bg: 'bg-ecommerce-purple/10', labelKey: 'homepage.profile.shipped' },
  delivered: { color: 'text-ecommerce-emerald', bg: 'bg-ecommerce-emerald/10', labelKey: 'homepage.profile.delivered' },
  cancelled: { color: 'text-red-500', bg: 'bg-red-500/10', labelKey: 'homepage.profile.cancelled' },
};

// ─── Activity Icon Config ─────────────────────────────────────────
const ACTIVITY_ICONS: Record<string, typeof Package> = {
  order: Package,
  review: Star,
  address: MapPin,
  password: Check,
  avatar: Eye,
};

const ACTIVITY_COLORS: Record<string, string> = {
  order: 'bg-ecommerce-red/10 text-ecommerce-red',
  review: 'bg-ecommerce-amber/10 text-ecommerce-amber',
  address: 'bg-ecommerce-purple/10 text-ecommerce-purple',
  password: 'bg-ecommerce-emerald/10 text-ecommerce-emerald',
  avatar: 'bg-ecommerce-teal/10 text-ecommerce-teal',
};

// ─── Animation Variants ───────────────────────────────────────────
const pageVariants: any = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const staggerItem: any = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
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
  const userAvatar = user?.avatar || '';

  // Local state
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);

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
  const [countries, setCountries] = useState<CountryModel[]>([]);
  const [states, setStates] = useState<StateProvinceModel[]>([]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.accessToken) {
      setAddressesLoading(true);
      const service = new ProfileService(session.user.accessToken);
      service.getUserAddresses().then((res) => {
        if (res.succeeded && res.data) setAddresses(res.data);
      }).finally(() => setAddressesLoading(false));
    }
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

  // Stores
  const wishlistItems = useWishlistStore((s) => s.items);
  const wishlistCount = wishlistItems.length;
  const addToCart = useCartStore((s) => s.addItem);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);

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
  const handleSaveProfile = () => {
    if (!editName.trim()) return;
    setIsEditingProfile(false);
    toast.success(t('homepage.profile.profileUpdated'));
  };

  const handleCancelEdit = () => {
    setEditName(userName);
    setEditEmail(userEmail);
    setIsEditingProfile(false);
  };

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
    setAddrForm({ id: 0, userId: 0, title: '', address1: '', city: '', stateProvinceName: '', stateProvinceId: 0, zipPostalCode: '', countryName: '', countryId: 0, county: '', phoneNumber: '', geoLocation: '', isDefault: false, createdOnUtc: new Date(), orders: 0 });
    setAddressDialogOpen(true);
  };

  const openEditAddress = (addr: AddressModel) => {
    setEditingAddress(addr);
    setAddrForm({ ...addr });
    setAddressDialogOpen(true);
  };

  const handleSaveAddress = async () => {
    if (!addrForm?.title || !addrForm?.address1 || !addrForm?.city || !addrForm?.stateProvinceName || !addrForm?.zipPostalCode || !addrForm?.countryName) return;
    if (!session?.user?.accessToken) return;
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
      setAddresses((prev) => {
        if (editingAddress) {
          return prev.map((a) => a.id === editingAddress.id ? res.data! : a);
        }
        return [...prev, res.data!];
      });
      setAddressDialogOpen(false);
      toast.success(editingAddress ? t('homepage.common.save') : t('homepage.profile.addressAdded'));
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!session?.user?.accessToken) return;
    const service = new ProfileService(session.user.accessToken);
    const res = await service.deleteAddress(id);
    if (res.succeeded) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success(t('homepage.common.delete'));
    }
  };

  const handleSetDefault = async (id: number) => {
    if (!session?.user?.accessToken) return;
    const service = new ProfileService(session.user.accessToken);
    const res = await service.setAsDefaultAddress(id);
    if (res.succeeded) {
      toast.success(t('homepage.profile.defaultBadge'));
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
            <Button variant="ghost" size="sm" className="text-ecommerce-text-secondary hover:text-ecommerce-red" onClick={() => toast.info('Coming soon!')}>
              <LogOut className="w-4 h-4" onClick={() => signOut()} />
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
                  onClick={() => toast.info('Coming soon!')}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ecommerce-text-secondary hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 w-full"
                >
                  <LogOut className="w-4.5 h-4.5" />
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
                    countries={countries}
                    states={states}
                  />
                </motion.div>
              )}
              {activeTab === 'settings' && (
                <motion.div key="settings" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <SettingsTab
                    t={t}
                    isEditing={isEditingProfile}
                    editName={editName}
                    editEmail={editEmail}
                    setEditName={setEditName}
                    setEditEmail={setEditEmail}
                    onEdit={() => setIsEditingProfile(true)}
                    onSave={handleSaveProfile}
                    onCancel={handleCancelEdit}
                    currentPw={currentPw}
                    newPw={newPw}
                    confirmPw={confirmPw}
                    setCurrentPw={setCurrentPw}
                    setNewPw={setNewPw}
                    setConfirmPw={setConfirmPw}
                    onUpdatePassword={handleUpdatePassword}
                    notifs={notifs}
                    setNotifs={setNotifs}
                  />
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

// ─── Dashboard Tab ────────────────────────────────────────────────
function DashboardTab({
  t,
  userName,
  userEmail,
  userAvatar,
  stats,
  activities,
  setActiveTab,
}: {
  t: ReturnType<typeof useTranslations>;
  userName: string;
  userEmail: string;
  userAvatar: string;
  stats: { icon: typeof Package; label: string; value: string; color: string; bg: string }[];
  activities: ActivityItem[];
  setActiveTab: (tab: TabId) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div variants={staggerItem} initial="initial" animate="animate">
        <h2 className="text-2xl font-bold text-ecommerce-text-primary">
          {t('homepage.profile.welcomeBack', { name: userName.split(' ')[0] })}
        </h2>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} variants={staggerItem}>
              <Card className="bg-ecommerce-surface border-ecommerce-border hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-ecommerce-text-primary">{stat.value}</p>
                  <p className="text-xs text-ecommerce-text-muted mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mobile Profile Card */}
      <motion.div variants={staggerItem} initial="initial" animate="animate" className="md:hidden">
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardContent className="p-4 flex items-center gap-4">
            <Avatar className="w-14 h-14">
              {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
              <AvatarFallback className="bg-ecommerce-red/10 text-ecommerce-red font-bold">
                {userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-ecommerce-text-primary truncate">{userName}</h3>
              <p className="text-sm text-ecommerce-text-muted truncate">{userEmail}</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" onClick={() => setActiveTab('settings')}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={staggerItem} initial="initial" animate="animate">
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="h-auto py-3 flex-col gap-2 border-ecommerce-border hover:border-ecommerce-red hover:text-ecommerce-red transition-colors"
                onClick={() => setActiveTab('orders')}
              >
                <Package className="w-5 h-5" />
                <span className="text-xs font-medium">{t('homepage.profile.viewOrders')}</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3 flex-col gap-2 border-ecommerce-border hover:border-ecommerce-red hover:text-ecommerce-red transition-colors"
                asChild
              >
                <Link href="/">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="text-xs font-medium">{t('homepage.profile.browseProducts')}</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3 flex-col gap-2 border-ecommerce-border hover:border-ecommerce-red hover:text-ecommerce-red transition-colors"
                onClick={() => setActiveTab('orders')}
              >
                <Truck className="w-5 h-5" />
                <span className="text-xs font-medium">{t('homepage.profile.trackOrder')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={staggerItem} initial="initial" animate="animate">
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-ecommerce-text-primary">{t('homepage.profile.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {activities.map((activity) => {
                const Icon = ACTIVITY_ICONS[activity.type] || Package;
                const colorClass = ACTIVITY_COLORS[activity.type] || 'bg-gray-100 text-gray-500';
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-ecommerce-surface-hover transition-colors">
                    <div className={`w-9 h-9 rounded-lg ${colorClass} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ecommerce-text-primary truncate">{activity.message}</p>
                      <p className="text-xs text-ecommerce-text-muted">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────
function OrdersTab({ t }: { t: ReturnType<typeof useTranslations> }) {
  const statusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status];
    if (!cfg) return null;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
        {t(cfg.labelKey)}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.orderHistory')}</h2>

      {MOCK_ORDERS.length === 0 ? (
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardContent className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-ecommerce-surface-hover flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-ecommerce-text-muted" />
            </div>
            <h3 className="font-semibold text-ecommerce-text-primary">{t('homepage.profile.noOrders')}</h3>
            <p className="text-sm text-ecommerce-text-muted mt-1 max-w-sm">{t('homepage.profile.noOrdersDesc')}</p>
            <Button asChild className="mt-4 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white">
              <Link href="/">{t('homepage.profile.startShopping')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
          {MOCK_ORDERS.map((order, i) => (
            <motion.div key={order.id} variants={staggerItem}>
              <Card className="bg-ecommerce-surface border-ecommerce-border hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-ecommerce-text-primary">
                          {t('homepage.profile.orderNumber', { number: order.orderNum })}
                        </h3>
                        {statusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 text-sm text-ecommerce-text-muted">
                        <span>{t('homepage.profile.orderDate', { date: order.date })}</span>
                        <span className="hidden sm:inline">·</span>
                        <span>{t('homepage.profile.itemsLabel', { count: order.items })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-base font-bold text-ecommerce-text-primary">
                        {t('homepage.profile.orderTotal', { amount: order.total.toFixed(2) })}
                      </span>
                      <Button variant="outline" size="sm" className="border-ecommerce-border hover:border-ecommerce-red hover:text-ecommerce-red transition-colors shrink-0">
                        {t('homepage.profile.viewOrder')}
                        <ChevronRight className="w-3.5 h-3.5 ms-1 rtl:rotate-180" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ─── Wishlist Tab ─────────────────────────────────────────────────
function WishlistTab({
  t,
  items,
  onAddToCart,
  onRemove,
}: Readonly<{
  t: ReturnType<typeof useTranslations>;
  items: {
    id: number;
    name: string;
    variant: ProductVariantDisplayModel;
    image?: FileUploadModel;
    categories: CategoryDisplayModel[]
  }[];
  onAddToCart: (item: typeof items[0]) => void;
  onRemove: (variantId: number) => void;
}>) {
  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.wishlist')}</h2>
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardContent className="py-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-ecommerce-rose/10 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-ecommerce-rose" />
            </div>
            <h3 className="font-semibold text-ecommerce-text-primary">{t('homepage.common.noProductsFound')}</h3>
            <p className="text-sm text-ecommerce-text-muted mt-1 max-w-sm">
              {t('homepage.profile.noOrdersDesc')}
            </p>
            <Button asChild className="mt-4 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white">
              <Link href="/">{t('homepage.profile.startShopping')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.wishlist')}</h2>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item, i) => (
          <motion.div key={item.id} variants={staggerItem} className="group relative">
            <ProductCard
              product={{
                id: item.id,
                name: item.name,
                sku: item.variant.sku,
                createUserId: 0,
                imagePreviewId: item.image?.id ?? null,
                imagePreview: item.image,
                metaKeywords: '',
                metaTitle: '',
                metaDescription: '',
                shortDescription: '',
                fullDescription: '',
                deliveryDateType: 0 as any,
                deliveryDateName: '',
                taxCategoryId: null,
                taxCategoryName: '',
                allowedQuantities: false,
                orderMinimumQuantity: 1,
                orderMaximumQuantity: 999,
                currencyType: 0 as any,
                approvedRatingSum: 45,
                notApprovedRatingSum: 0,
                approvedTotalReviews: 10,
                notApprovedTotalReviews: 0,
                hasDiscountsApplied: item.variant.oldSellPrice > 0,
                markAsNew: false,
                notReturnable: false,
                isTaxExempt: false,
                showOnHomepage: false,
                isFreeShipping: false,
                allowCustomerReviews: true,
                disableBuyButton: false,
                disableWishlistButton: false,
                availableForPreOrder: false,
                callForPrice: false,
                createdOnUtc: new Date(),
                updatedOnUtc: null,
                measureType: 0 as any,
                displayStockQuantity: false,
                stockQuantity: item.variant.productInventory.stockQuantity,
                minStockQuantity: 0,
                categories: item.categories,
                manufacturerNames: [],
                attributes: [],
                imagePaths: [],
                variants: [item.variant],
                reviewIds: [],
                relatedProductIds: [],
                productTags: [],
              } as any}
              index={i}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                onRemove(item.variant.id);
                toast.success(t('homepage.common.removeFromWishlist'));
              }}
              className="absolute top-2.5 end-2.5 z-20 w-8 h-8 rounded-full bg-white dark:bg-ecommerce-surface shadow-lg flex items-center justify-center text-ecommerce-text-secondary hover:text-ecommerce-red hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              aria-label={t('homepage.common.removeFromWishlist')}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Addresses Tab ────────────────────────────────────────────────
function AddressesTab({
  t,
  addresses,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
  dialogOpen,
  setDialogOpen,
  editingAddress,
  addrForm,
  setAddrForm,
  onSave,
  loading,
  countries,
  states,
}: Readonly<{
  t: ReturnType<typeof useTranslations>;
  addresses: AddressModel[];
  onAdd: () => void;
  onEdit: (addr: AddressModel) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingAddress: AddressModel | null;
  addrForm: AddressModel | null;
  setAddrForm: (form: AddressModel) => void;
  onSave: () => void;
  loading?: boolean;
  countries: CountryModel[];
  states: StateProvinceModel[];
}>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.myAddresses')}</h2>
        <Button size="sm" className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white" onClick={onAdd}>
          <Plus className="w-4 h-4" />
          <span className="ms-1.5">{t('homepage.profile.addNewAddress')}</span>
        </Button>
      </div>

      {loading ? (
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardContent className="py-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-ecommerce-red animate-spin" />
          </CardContent>
        </Card>
      ) : addresses.length === 0 ? (
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardContent className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-ecommerce-surface-hover flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-ecommerce-text-muted" />
            </div>
            <h3 className="font-semibold text-ecommerce-text-primary">{t('homepage.profile.noAddresses')}</h3>
            <p className="text-sm text-ecommerce-text-muted mt-1 max-w-sm">{t('homepage.profile.noAddressesDesc')}</p>
            <Button className="mt-4 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white" onClick={onAdd}>
              <Plus className="w-4 h-4" />
              <span className="ms-1.5">{t('homepage.profile.addNewAddress')}</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-3 sm:grid-cols-2">
          {addresses.map((addr) => (
            <motion.div key={addr.id} variants={staggerItem}>
              <Card className="bg-ecommerce-surface border-ecommerce-border hover:shadow-md transition-shadow duration-200 h-full">
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-ecommerce-text-primary truncate">{addr.title}</h3>
                        {addr.isDefault && (
                          <Badge className="bg-ecommerce-emerald/10 text-ecommerce-emerald border-0 text-[10px] font-semibold px-1.5 py-0">
                            {t('homepage.profile.defaultBadge')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex-1 text-sm text-ecommerce-text-secondary space-y-1">
                    <p>{addr.address1}</p>
                    <p>
                      {addr.city}, {addr.stateProvinceName} {addr.zipPostalCode}
                    </p>
                    <p>{addr.countryName}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-ecommerce-border">
                    {!addr.isDefault && (
                      <Button variant="ghost" size="sm" className="text-xs text-ecommerce-text-muted hover:text-ecommerce-emerald" onClick={() => onSetDefault(addr.id)}>
                        {t('homepage.profile.setAsDefault')}
                      </Button>
                    )}
                    <div className="ms-auto flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-ecommerce-text-muted hover:text-ecommerce-text-primary" onClick={() => onEdit(addr)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-ecommerce-text-muted hover:text-red-500" onClick={() => onDelete(addr.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Address Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-ecommerce-surface border-ecommerce-border sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-ecommerce-text-primary">
              {editingAddress ? t('homepage.profile.editAddress') : t('homepage.profile.addNewAddress')}
            </DialogTitle>
            <DialogDescription className="text-ecommerce-text-muted">
              {editingAddress ? t('homepage.profile.editAddress') : t('homepage.profile.addNewAddress')}
            </DialogDescription>
          </DialogHeader>
          {addrForm && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-ecommerce-text-primary text-sm">{t('homepage.profile.addressName')}</Label>
                <Input value={addrForm?.title ?? ''} onChange={(e) => setAddrForm({ ...addrForm, title: e.target.value })} placeholder="Home, Office, etc." className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
              </div>
              <div className="space-y-2">
                <Label className="text-ecommerce-text-primary text-sm">{t('homepage.profile.country')}</Label>
                <Select value={addrForm.countryId ? String(addrForm.countryId) : ''} onValueChange={(val) => {
                  const country = countries.find((c) => c.id === Number(val));
                  setAddrForm({ ...addrForm, countryId: Number(val), countryName: country?.name ?? '', stateProvinceId: 0, stateProvinceName: '' });
                }}>
                  <SelectTrigger className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary">
                    <SelectValue placeholder={t('homepage.profile.country')} />
                  </SelectTrigger>
                  <SelectContent className="bg-ecommerce-surface border-ecommerce-border">
                    {countries.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)} className="text-ecommerce-text-primary">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-ecommerce-text-primary text-sm">{t('homepage.profile.state')}</Label>
                <Select value={addrForm.stateProvinceId ? String(addrForm.stateProvinceId) : ''} onValueChange={(val) => {
                  const state = states.find((s) => s.id === Number(val));
                  setAddrForm({ ...addrForm, stateProvinceId: Number(val), stateProvinceName: state?.name ?? '' });
                }} disabled={!addrForm.countryId}>
                  <SelectTrigger className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary">
                    <SelectValue placeholder={t('homepage.profile.state')} />
                  </SelectTrigger>
                  <SelectContent className="bg-ecommerce-surface border-ecommerce-border">
                    {states.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)} className="text-ecommerce-text-primary">{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-ecommerce-text-primary text-sm">{t('homepage.profile.city')}</Label>
                <Input value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">

                <div className="space-y-2">
                  <Label className="text-ecommerce-text-primary text-sm">{t('homepage.profile.zipCode')}</Label>
                  <Input value={addrForm.zipPostalCode} onChange={(e) => setAddrForm({ ...addrForm, zipPostalCode: e.target.value })} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-ecommerce-text-primary text-sm">{t('homepage.profile.addressLine1')}</Label>
                <Input value={addrForm?.address1} onChange={(e) => setAddrForm({ ...addrForm, address1: e.target.value })} className="bg-ecommerce-surface-hover border-ecommerce-border text-ecommerce-text-primary" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-ecommerce-border text-ecommerce-text-secondary">
              {t('homepage.common.cancel')}
            </Button>
            <Button onClick={onSave} className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white">
              {t('homepage.profile.saveAddress')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────
function SettingsTab({
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

// ─── Page Export ──────────────────────────────────────────────────
export default function ProfilePage() {
  return (
    <ProfilePageContent />
  );
}