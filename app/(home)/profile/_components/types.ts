import { LayoutDashboard, Package, Heart, MapPin, Settings, Star, Check, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export type TabId = 'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'settings';

export interface ActivityItem {
  id: string;
  type: 'order' | 'review' | 'address' | 'password' | 'avatar';
  message: string;
  time: string;
}

export interface MockOrder {
  id: string;
  orderNum: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  total: number;
}

export const NAV_ITEMS: { id: TabId; icon: typeof LayoutDashboard; labelKey: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, labelKey: 'homepage.profile.dashboard' },
  { id: 'orders', icon: Package, labelKey: 'homepage.profile.orders' },
  { id: 'wishlist', icon: Heart, labelKey: 'homepage.profile.wishlist' },
  { id: 'addresses', icon: MapPin, labelKey: 'homepage.profile.addresses' },
  { id: 'settings', icon: Settings, labelKey: 'homepage.profile.settings' },
];

export const STATUS_CONFIG: Record<string, { color: string; bg: string; labelKey: string }> = {
  pending: { color: 'text-ecommerce-amber', bg: 'bg-ecommerce-amber/10', labelKey: 'homepage.profile.pending' },
  processing: { color: 'text-blue-500', bg: 'bg-blue-500/10', labelKey: 'homepage.profile.processing' },
  shipped: { color: 'text-ecommerce-purple', bg: 'bg-ecommerce-purple/10', labelKey: 'homepage.profile.shipped' },
  delivered: { color: 'text-ecommerce-emerald', bg: 'bg-ecommerce-emerald/10', labelKey: 'homepage.profile.delivered' },
  cancelled: { color: 'text-red-500', bg: 'bg-red-500/10', labelKey: 'homepage.profile.cancelled' },
};

export const ACTIVITY_ICONS: Record<string, typeof Package> = {
  order: Package,
  review: Star,
  address: MapPin,
  password: Check,
  avatar: Eye,
};

export const ACTIVITY_COLORS: Record<string, string> = {
  order: 'bg-ecommerce-red/10 text-ecommerce-red',
  review: 'bg-ecommerce-amber/10 text-ecommerce-amber',
  address: 'bg-ecommerce-purple/10 text-ecommerce-purple',
  password: 'bg-ecommerce-emerald/10 text-ecommerce-emerald',
  avatar: 'bg-ecommerce-teal/10 text-ecommerce-teal',
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const staggerItem: any = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};
