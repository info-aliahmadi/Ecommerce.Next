'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';
import { Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'cookie-consent-granted';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot(): string {
  return localStorage.getItem(STORAGE_KEY) ?? '';
}

function getServerSnapshot(): string {
  return '';
}

export function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hasConsented = consent !== '';
  const [dismissed, setDismissed] = useState(false);
  const showBanner = !hasConsented && !dismissed;

  const handleAccept = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'all');
    window.dispatchEvent(new Event('storage'));
  }, []);

  const handleCustomize = useCallback(() => {
    setDismissed(true);
  }, []);

  const handleReopen = useCallback(() => {
    setDismissed(false);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4"
          >
            <div className="bg-white/95 dark:bg-ecommerce-surface/95 backdrop-blur-xl border border-ecommerce-border shadow-2xl rounded-t-2xl max-w-2xl mx-auto p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ecommerce-red/10 flex items-center justify-center">
                    <Cookie size={20} className="text-ecommerce-red" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-ecommerce-text-primary">We value your privacy</h3>
                    <p className="text-xs sm:text-sm text-ecommerce-text-secondary mt-1 leading-relaxed">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
                  <button
                    onClick={handleAccept}
                    className="bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl h-10 px-5 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleCustomize}
                    className="border border-ecommerce-border hover:bg-ecommerce-surface-hover rounded-xl h-10 px-5 text-sm font-medium text-ecommerce-text-primary transition-colors cursor-pointer"
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasConsented && !showBanner && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={handleReopen}
          className="fixed bottom-20 lg:bottom-4 right-4 z-30 w-10 h-10 rounded-full bg-white/95 dark:bg-ecommerce-surface/95 backdrop-blur-xl border border-ecommerce-border shadow-lg flex items-center justify-center hover:bg-ecommerce-surface-hover transition-colors cursor-pointer"
          aria-label="Cookie settings"
        >
          <Cookie size={18} className="text-ecommerce-text-secondary" />
        </motion.button>
      )}
    </>
  );
}
