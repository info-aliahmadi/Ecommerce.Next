'use client';

// import { useI18n } from '../../i18n/provider';
import { Globe, ChevronDown } from 'lucide-react';
import { LOCALE_CONFIG, LOCALES, type Locale } from '../../_lib/store';
import { useEffect, useRef, useState } from 'react';
import nextIntlService from '@root/locales/nextIntlService';

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>(nextIntlService.getNextIntlLocale() as Locale);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        ref.current?.classList.remove('lang-open');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    ref.current?.classList.toggle('lang-open');
  };

  const handleSelect = (loc: Locale) => {
    nextIntlService.setNextIntlLocale(loc);
    setLocale(loc);
    ref.current?.classList.remove('lang-open');
    // Refresh the page to apply the new locale
    window.location.reload();
  };

  return (
    <div className="relative" ref={ref}>
      <style>{`
        .lang-menu { display: none; }
        .lang-open .lang-menu { display: block; }
      `}</style>
      <button
        onMouseDown={toggle}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-ecommerce-surface-hover transition-colors text-ecommerce-text-secondary hover:text-ecommerce-text-primary cursor-pointer"
        aria-label="Switch language"
      >
        <Globe size={16} />
        <span className="text-xs font-medium hidden sm:inline">{locale.toUpperCase()}</span>
        <ChevronDown size={14} className="transition-transform duration-200 lang-chevron" />
      </button>

      <div className="lang-menu absolute end-0 top-full mt-1.5 bg-ecommerce-surface border border-ecommerce-border rounded-xl shadow-xl z-[999] min-w-[180px] py-1">
        {LOCALES.map((loc) => {
          const cfg = LOCALE_CONFIG[loc];
          const isActive = locale === loc;
          return (
            <button
              key={loc}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(loc);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer text-start ${isActive
                  ? 'bg-ecommerce-red/10 text-ecommerce-red font-semibold'
                  : 'text-ecommerce-text-secondary hover:bg-ecommerce-surface-hover hover:text-ecommerce-text-primary'
                }`}
            >
              <span className="text-lg">{loc === 'en' ? '🇺🇸' : loc === 'fa' ? '🇮🇷' : '🇸🇦'}</span>
              <span>{cfg.nativeName}</span>
              {isActive && (
                <span className="ms-auto w-1.5 h-1.5 rounded-full bg-ecommerce-red" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}