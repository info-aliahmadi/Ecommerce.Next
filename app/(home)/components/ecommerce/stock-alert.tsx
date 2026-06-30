'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame } from 'lucide-react';
import { useStockAlertStore, type StockAlert } from '@/lib/store';

const AUTO_DISMISS_MS = 5000;

function AlertCard({ alert, onDismiss }: { alert: StockAlert; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [alert.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="w-80 max-w-[calc(100vw-2rem)] rounded-xl bg-white dark:bg-ecommerce-surface shadow-xl border border-ecommerce-border overflow-hidden"
    >
      <div className="relative p-3.5 pr-9">
        {/* Auto-dismiss progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-ecommerce-red/60 origin-left"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: AUTO_DISMISS_MS / 1000, ease: 'linear' }}
        />

        <div className="flex items-start gap-3">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-ecommerce-red/10 flex items-center justify-center mt-0.5">
            <Flame size={16} className="text-ecommerce-red" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ecommerce-text-primary leading-snug">
              🔥 Only <span className="text-ecommerce-red">{alert.stock}</span> left in stock — order soon!
            </p>
            <p className="text-xs text-ecommerce-text-muted mt-0.5 truncate">
              {alert.productName}
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-ecommerce-text-muted hover:text-ecommerce-text-primary hover:bg-ecommerce-surface-hover transition-colors"
            aria-label="Dismiss alert"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function StockAlert() {
  const alerts = useStockAlertStore((s) => s.alerts);
  const dismissAlert = useStockAlertStore((s) => s.dismissAlert);

  const handleDismiss = useCallback(
    (id: string) => {
      dismissAlert(id);
    },
    [dismissAlert]
  );

  // Safety net: clear expired alerts periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      const store = useStockAlertStore.getState();
      store.alerts.forEach((a) => {
        if (now - a.timestamp > AUTO_DISMISS_MS + 1000) {
          dismissAlert(a.id);
        }
      });
    }, 2000);
    return () => clearInterval(cleanup);
  }, [dismissAlert]);

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col-reverse gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {alerts.map((alert) => (
          <div key={alert.id} className="pointer-events-auto">
            <AlertCard alert={alert} onDismiss={() => handleDismiss(alert.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}