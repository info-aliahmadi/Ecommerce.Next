'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, ExternalLink } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Notification = {
  id: number;
  name: string;
  city: string;
  product: string;
  image: string;
  time: string;
  color: string;
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, name: 'Sarah', city: 'NY', product: 'Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop', time: '2 min ago', color: '#E63946' },
  { id: 2, name: 'Michael', city: 'LA', product: 'Smart Watch Pro', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop', time: '5 min ago', color: '#6A5ACD' },
  { id: 3, name: 'Emily', city: 'Chicago', product: 'Leather Jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=80&h=80&fit=crop', time: '12 min ago', color: '#20B2AA' },
  { id: 4, name: 'David', city: 'Houston', product: 'Running Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop', time: '25 min ago', color: '#FFC107' },
  { id: 5, name: 'Lisa', city: 'Miami', product: 'Skincare Kit', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&h=80&fit=crop', time: '1 hr ago', color: '#FF69B4' },
  { id: 6, name: 'James', city: 'Seattle', product: 'Bluetooth Speaker', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=80&h=80&fit=crop', time: '2 hr ago', color: '#10B981' },
  { id: 7, name: 'Anna', city: 'Boston', product: 'Yoga Mat', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=80&h=80&fit=crop', time: '3 hr ago', color: '#E63946' },
  { id: 8, name: 'Robert', city: 'Denver', product: 'Desk Lamp', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=80&h=80&fit=crop', time: '5 hr ago', color: '#6A5ACD' },
];

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [readIds, setReadIds] = useState<Set<number>>(() => new Set(INITIAL_NOTIFICATIONS.slice(3).map((n) => n.id)));

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const handleMarkAllRead = useCallback(() => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  }, [notifications]);

  // Auto-refresh: every 15 seconds, move last item to top with "Just now"
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const rest = prev.slice(0, -1);
        return [{ ...last, time: 'Just now' }, ...rest];
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="sm:max-w-sm p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <SheetHeader className="p-4 pb-3 border-b border-ecommerce-border shrink-0">
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Bell size={18} className="text-ecommerce-text-primary" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center">
                    <span className="w-4 h-4 rounded-full bg-ecommerce-red text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </span>
                )}
              </div>
              <SheetTitle className="text-base">Notifications</SheetTitle>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-ecommerce-red/10 text-ecommerce-red border-ecommerce-red/20">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="h-7 px-2 text-xs text-ecommerce-text-secondary hover:text-ecommerce-text-primary"
              >
                <CheckCheck size={13} className="mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="divide-y divide-ecommerce-border">
            {notifications.map((notification) => {
              const isUnread = !readIds.has(notification.id);
              return (
                <div
                  key={notification.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-ecommerce-surface-hover transition-colors cursor-default group relative"
                >
                  {/* Unread indicator dot */}
                  {isUnread && (
                    <span
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: notification.color }}
                    />
                  )}

                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-semibold shadow-sm"
                    style={{ backgroundColor: notification.color }}
                  >
                    {notification.name[0]}
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ecommerce-text-primary leading-snug">
                      <span className="font-medium">{notification.name}</span>
                      <span className="text-ecommerce-text-secondary"> from </span>
                      <span className="font-medium">{notification.city}</span>
                      <span className="text-ecommerce-text-secondary"> purchased </span>
                      <span className="font-medium text-ecommerce-text-primary">{notification.product}</span>
                    </p>
                    <p className={`text-xs mt-0.5 ${isUnread ? 'text-ecommerce-text-secondary font-medium' : 'text-ecommerce-text-muted'}`}>
                      {notification.time}
                    </p>
                  </div>

                  {/* Product thumbnail */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-ecommerce-border shadow-sm">
                    <img
                      src={notification.image}
                      alt={notification.product}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-ecommerce-border p-3">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-ecommerce-text-secondary hover:text-ecommerce-red transition-colors py-2 rounded-lg hover:bg-ecommerce-surface-hover"
          >
            <ExternalLink size={14} />
            View all activity
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}