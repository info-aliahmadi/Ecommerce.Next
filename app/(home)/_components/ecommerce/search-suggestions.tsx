'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Clock, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';
import { useUIStore } from '../../_lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import HomePageService from '../../_services/HomePageService';
import CONFIG from '@root/config';
import ProductDisplayModel from '../../_types/Product/ProductDisplayModel';
import CurrencyViewer from '@root/utils/CurrencyViewer';

interface RecentSearch {
  query: string;
  timestamp: number;
}

interface SearchResult {
  id: string;
  name: string;
  price: number;
  image: string;
  category: { name: string; slug?: string; color?: string };
  rating: number;
  reviewCount: number;
}

const MAX_RECENT = 5;
const STORAGE_KEY = 'ecommerce-recent-searches';

export function SearchSuggestions({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useTranslations();
  const router = useRouter();
  const { searchQuery, setSearchQuery, setSelectedCategory } = useUIStore();
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setActiveIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchQuery]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = searchQuery.trim();
    if (query.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const service = new HomePageService();
        const result = await service.searchProducts(query);
        if (result.succeeded && result.data?.items) {
          const mapped: SearchResult[] = result.data.items.map((product: ProductDisplayModel) => {
            const price =
              product.variants.length > 0
                ? Math.min(...product.variants.map((v) => v.sellPrice))
                : 0;
            const image =
              product.imagePaths && product.imagePaths.length > 0
                ? CONFIG.API_BASEPATH + "/" + product.imagePaths[0]
                : CONFIG.UNKNOWN_IMAGE_BASEPATH;
            const category =
              product.categories.length > 0
                ? { name: product.categories[0].name, color: product.categories[0].color }
                : { name: '' };
            const reviewCount = product.approvedTotalReviews;
            const rating = reviewCount > 0 ? product.approvedRatingSum / reviewCount : 0;
            return {
              id: String(product.id),
              name: product.name,
              price,
              image,
              category,
              rating,
              reviewCount,
            };
          });
          setResults(mapped);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 1000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, isOpen]);

  const addRecentSearch = (query: string) => {
    const updated: RecentSearch[] = [
      { query, timestamp: Date.now() },
      ...recentSearches.filter((r) => r.query.toLowerCase() !== query.toLowerCase()),
    ].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
  };

  const handleSelect = (query: string) => {
    addRecentSearch(query);
    setActiveIndex(-1);
    onClose();
    router.push(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleProductClick = (product: SearchResult) => {
    addRecentSearch(product.name);
    setActiveIndex(-1);
    setSearchQuery(product.name);
    onClose();
    router.push(`/products/${product.id}`);
  };

  const handleSearchForQuery = () => {
    const query = searchQuery.trim();
    if (query) {
      addRecentSearch(query);
      setActiveIndex(-1);
      onClose();
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  const showSuggestions = searchQuery.length >= 2 && (results.length > 0 || isSearching);
  const showNoResults = searchQuery.length >= 2 && !isSearching && results.length === 0;
  const showRecent = !showSuggestions && !showNoResults && searchQuery.length === 0 && recentSearches.length > 0;
  const showPopular = !showSuggestions && !showNoResults && !showRecent;

  const suggestionCount = showSuggestions ? results.length : 0;
  const hasSearchLink = searchQuery.length >= 2;
  const totalNavItems = showSuggestions ? suggestionCount + (hasSearchLink ? 1 : 0) : showRecent ? recentSearches.length : showPopular ? CONFIG.POPULAR_TERMS.length : 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, totalNavItems - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions) {
        if (activeIndex >= 0 && activeIndex < suggestionCount) {
          handleProductClick(results[activeIndex]);
        } else if (activeIndex === suggestionCount && hasSearchLink) {
          handleSearchForQuery();
        }
      } else if (showRecent && activeIndex >= 0 && activeIndex < recentSearches.length) {
        handleSelect(recentSearches[activeIndex].query);
      } else if (showPopular && activeIndex >= 0 && activeIndex < CONFIG.POPULAR_TERMS.length) {
        handleSelect(CONFIG.POPULAR_TERMS[activeIndex]);
      }
      setActiveIndex(-1);
    } else if (e.key === 'Escape') {
      onClose();
      setActiveIndex(-1);
    }
  };

  const clearRecent = () => {
    setRecentSearches([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className="search-dropdown absolute top-full start-0 end-0 mt-2 bg-white dark:bg-ecommerce-surface rounded-xl shadow-xl border border-ecommerce-border overflow-hidden z-50"
    >
      {showSuggestions && (
        <div className="py-2 max-h-96 overflow-y-auto scrollbar-thin">
          <div className="px-4 py-1.5">
            <p className="text-[10px] font-semibold text-ecommerce-text-muted uppercase tracking-wider">
              {isSearching ? `${t('homepage.common.searchPlaceholder').split('homepage. ')[0]}...` : `${t('homepage.common.searchPlaceholder').split('homepage. ')[0]} (${results.length})`}
            </p>
          </div>
          {results.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => handleProductClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 ${index === activeIndex ? 'bg-ecommerce-surface-hover ring-1 ring-ecommerce-red/20 ring-inset' : ''} hover:bg-ecommerce-surface-hover transition-colors text-start group`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-8 h-8 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ecommerce-text-primary truncate group-hover:text-ecommerce-red transition-colors">{item.name}</p>
                <p className="text-[11px] text-ecommerce-text-muted">{item.category.name} · {CurrencyViewer(item.price, CONFIG.DEFAULT_CURRENCY)}</p>
              </div>
            </button>
          ))}

          {hasSearchLink && (
            <button
              type="button"
              onClick={handleSearchForQuery}
              className={`w-full flex items-center gap-3 px-4 py-2.5 border-t border-ecommerce-border ${activeIndex === suggestionCount ? 'bg-ecommerce-surface-hover ring-1 ring-ecommerce-red/20 ring-inset' : ''} hover:bg-ecommerce-surface-hover transition-colors text-start group`}
            >
              <Search size={14} className="text-ecommerce-text-muted shrink-0" />
              <span className="text-sm text-ecommerce-red font-medium flex items-center gap-1">
                {t('homepage.searchSuggestions.searchFor', { query: searchQuery })}
                <ArrowRight size={12} />
              </span>
            </button>
          )}
        </div>
      )}

      <AnimatePresence>
        {showNoResults && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="py-8 px-4 text-center"
          >
            <AlertCircle size={28} className="text-ecommerce-text-muted mx-auto mb-3" />
            <p className="text-sm font-medium text-ecommerce-text-primary mb-1">
              {t('homepage.searchSuggestions.noResults')}
            </p>
            <p className="text-xs text-ecommerce-text-muted max-w-[240px] mx-auto">
              {t('homepage.searchSuggestions.tryDifferent')}
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {CONFIG.POPULAR_TERMS.slice(0, 4).map((term) => (
                <button
                  type="button"
                  key={term}
                  onClick={() => handleSelect(term)}
                  className="px-3 py-1.5 rounded-full bg-ecommerce-surface-hover text-xs text-ecommerce-text-secondary hover:bg-ecommerce-red/10 hover:text-ecommerce-red transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showRecent && (
        <div className="py-2">
          <div className="px-4 py-1.5 flex items-center justify-between">
            <p className="text-[10px] font-semibold text-ecommerce-text-muted uppercase tracking-wider">{t('homepage.searchSuggestions.recentSearches')}</p>
            <button
              type="button"
              onClick={clearRecent}
              className="text-[10px] text-ecommerce-red hover:underline"
            >
              {t('homepage.common.clear')}
            </button>
          </div>
          {recentSearches.map((recent, index) => (
            <button
              type="button"
              key={recent.query}
              onClick={() => handleSelect(recent.query)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 ${index === activeIndex ? 'bg-ecommerce-surface-hover' : ''} hover:bg-ecommerce-surface-hover transition-colors text-start`}
            >
              <Clock size={14} className="text-ecommerce-text-muted shrink-0" />
              <span className="text-sm text-ecommerce-text-secondary">{recent.query}</span>
            </button>
          ))}
        </div>
      )}

      {showPopular && (
        <div className="py-2">
          <div className="px-4 py-1.5">
            <p className="text-[10px] font-semibold text-ecommerce-text-muted uppercase tracking-wider">{t('homepage.searchSuggestions.trendingSearches')}</p>
          </div>
          {CONFIG.POPULAR_TERMS.map((term, index) => (
            <button
              type="button"
              key={term}
              onClick={() => handleSelect(term)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 ${index === activeIndex ? 'bg-ecommerce-surface-hover' : ''} hover:bg-ecommerce-surface-hover transition-colors text-start`}
            >
              <TrendingUp size={14} className="text-ecommerce-text-muted shrink-0" />
              <span className="text-sm text-ecommerce-text-secondary">{term}</span>
            </button>
          ))}
        </div>
      )}

      {!showNoResults && (
        <div className="border-t border-ecommerce-border px-4 py-2.5 bg-ecommerce-surface-hover/50">
          <p className="text-[11px] text-ecommerce-text-muted">
            <kbd className="px-1.5 py-0.5 rounded bg-ecommerce-surface border border-ecommerce-border text-[10px] font-mono">↑↓</kbd>
            {' '}{t('homepage.common.searchPlaceholder').split('homepage. ')[0]}
            {' · '}
            <kbd className="px-1.5 py-0.5 rounded bg-ecommerce-surface border border-ecommerce-border text-[10px] font-mono">Enter</kbd>
            {' '}{t('homepage.searchSuggestions.pressEnter').split('homepage. ').slice(-2).join(' ')}
            {' · '}
            <kbd className="px-1.5 py-0.5 rounded bg-ecommerce-surface border border-ecommerce-border text-[10px] font-mono">Esc</kbd>
            {' '}{t('homepage.common.close').toLowerCase()}
          </p>
        </div>
      )}
    </motion.div>
  );
}
