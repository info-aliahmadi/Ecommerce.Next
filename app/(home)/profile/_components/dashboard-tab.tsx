'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, Heart, DollarSign, Star, Pencil, ShoppingBag, Truck } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../../_components/ui/card';
import { Button } from '../../_components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../_components/ui/avatar';
import { ActivityItem, TabId, ACTIVITY_ICONS, ACTIVITY_COLORS, staggerContainer, staggerItem } from './types';

export function DashboardTab({
  userName,
  userEmail,
  userAvatar,
  stats,
  activities,
  setActiveTab,
}: {
  userName: string;
  userEmail: string;
  userAvatar: string;
  stats: { icon: typeof Package; label: string; value: string; color: string; bg: string }[];
  activities: ActivityItem[];
  setActiveTab: (tab: TabId) => void;
}) {
  const t = useTranslations();
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
