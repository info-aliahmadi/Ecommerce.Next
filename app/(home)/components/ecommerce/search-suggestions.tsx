'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Clock, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';
import { useUIStore } from '../../lib/store';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

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
const POPULAR_TERMS = ['Headphones', 'T-Shirt', 'Lamp', 'Yoga', 'Perfume', 'Keyboard'];

export function SearchSuggestions({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useTranslations();
  const { searchQuery, setSearchQuery, setSelectedCategory } = useUIStore();
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Reset activeIndex when isOpen changes to false
  useEffect(() => {
    if (!isOpen) setActiveIndex(-1);
  }, [isOpen]);

  // Reset activeIndex when searchQuery changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [searchQuery]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  // Debounce query for API search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch from dedicated search API (debounced)
  const { data: apiResults = [], isLoading: isApiLoading } = useQuery({
    queryKey: ['api-search', debouncedQuery],
    queryFn: () => {
      const params = new URLSearchParams({ q: debouncedQuery });
      return fetch(`/api/search?${params}`).then(r => r.json()).then(d => (d.products || []) as SearchResult[]);
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 10000,
  });

  // Fetch search suggestions from existing products API (immediate)
  const { data: localSuggestions = [] } = useQuery({
    queryKey: ['search-suggestions', searchQuery],
    queryFn: () => {
      if (!searchQuery || searchQuery.length < 2) return [];
      const params = new URLSearchParams({ search: searchQuery, limit: '5' });
      return fetch(`/api/products?${params}`).then(r => r.json()).then(d => (d.products || []) as SearchResult[]);
    },
    enabled: searchQuery.length >= 2,
  });

  // Merge API results with local (deduplicate by id)
  const mergedResults = (() => {
    const seen = new Set<string>();
    const merged: SearchResult[] = [];
    for (const item of [...apiResults, ...localSuggestions]) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    }
    // Cap at 8
    return merged.slice(0, 8);
  })();

  const addRecentSearch = (query: string) => {
    const updated: RecentSearch[] = [
      { query, timestamp: Date.now() },
      ...recentSearches.filter(r => r.query.toLowerCase() !== query.toLowerCase()),
    ].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
  };

  const handleSelect = (query: string) => {
    setSearchQuery(query);
    addRecentSearch(query);
    setActiveIndex(-1);
    onClose();
  };

  const handleProductClick = (product: SearchResult) => {
    addRecentSearch(product.name);
    setActiveIndex(-1);
    // Scroll to products section
    const productsSection = document.getElementById('products-section') || document.getElementById('product-grid-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setSearchQuery(product.name);
    onClose();
  };

  const handleSearchForQuery = () => {
    if (searchQuery.trim().length > 0) {
      addRecentSearch(searchQuery);
      const section = document.getElementById('products-section') || document.getElementById('product-grid-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setActiveIndex(-1);
      onClose();
    }
  };

  // Calculate total items for keyboard nav
  const showSuggestions = searchQuery.length >= 2 && (mergedResults.length > 0 || isApiLoading);
  const showNoResults = searchQuery.length >= 2 && !isApiLoading && mergedResults.length === 0;
  const showRecent = !showSuggestions && !showNoResults && searchQuery.length === 0 && recentSearches.length > 0;
  const showPopular = !showSuggestions && !showNoResults && !showRecent;

  // Total navigable items: suggestions + optional "Search for..." link
  const suggestionCount = showSuggestions ? mergedResults.length : 0;
  const hasSearchLink = searchQuery.length >= 2;
  const totalNavItems = showSuggestions ? suggestionCount + (hasSearchLink ? 1 : 0) : showRecent ? recentSearches.length : showPopular ? POPULAR_TERMS.length : 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, totalNavItems - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions) {
        if (activeIndex >= 0 && activeIndex < suggestionCount) {
          handleProductClick(mergedResults[activeIndex]);
        } else if (activeIndex === suggestionCount && hasSearchLink) {
          handleSearchForQuery();
        }
      } else if (showRecent && activeIndex >= 0 && activeIndex < recentSearches.length) {
        handleSelect(recentSearches[activeIndex].query);
      } else if (showPopular && activeIndex >= 0 && activeIndex < POPULAR_TERMS.length) {
        handleSelect(POPULAR_TERMS[activeIndex]);
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
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className="search-dropdown absolute top-full start-0 end-0 mt-2 bg-white dark:bg-ecommerce-surface rounded-xl shadow-xl border border-ecommerce-border overflow-hidden z-50"
    >
      {/* Search suggestions from API + local */}
      {showSuggestions && (
        <div className="py-2 max-h-96 overflow-y-auto scrollbar-thin">
          <div className="px-4 py-1.5">
            <p className="text-[10px] font-semibold text-ecommerce-text-muted uppercase tracking-wider">
              {isApiLoading ? `${t('common.searchPlaceholder').split(' ')[0]}...` : `${t('common.searchPlaceholder').split(' ')[0]} (${mergedResults.length})`}
            </p>
          </div>
          {mergedResults.map((item, index) => (
            <button
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
                <p className="text-[11px] text-ecommerce-text-muted">{item.category.name} · ${item.price.toFixed(2)}</p>
              </div>
            </button>
          ))}

          {/* "Search for '{query}'" link */}
          {hasSearchLink && (
            <button
              onClick={handleSearchForQuery}
              className={`w-full flex items-center gap-3 px-4 py-2.5 border-t border-ecommerce-border ${activeIndex === suggestionCount ? 'bg-ecommerce-surface-hover ring-1 ring-ecommerce-red/20 ring-inset' : ''} hover:bg-ecommerce-surface-hover transition-colors text-start group`}
            >
              <Search size={14} className="text-ecommerce-text-muted shrink-0" />
              <span className="text-sm text-ecommerce-red font-medium flex items-center gap-1">
                {t('searchSuggestions.searchFor', { query: searchQuery })}
                <ArrowRight size={12} />
              </span>
            </button>
          )}
        </div>
      )}

      {/* No results state */}
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
              {t('searchSuggestions.noResults')}
            </p>
            <p className="text-xs text-ecommerce-text-muted max-w-[240px] mx-auto">
              {t('searchSuggestions.tryDifferent')}
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {POPULAR_TERMS.slice(0, 4).map((term) => (
                <button
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

      {/* Recent searches */}
      {showRecent && (
        <div className="py-2">
          <div className="px-4 py-1.5 flex items-center justify-between">
            <p className="text-[10px] font-semibold text-ecommerce-text-muted uppercase tracking-wider">{t('searchSuggestions.recentSearches')}</p>
            <button
              onClick={clearRecent}
              className="text-[10px] text-ecommerce-red hover:underline"
            >
              {t('common.clear')}
            </button>
          </div>
          {recentSearches.map((recent, index) => (
            <button
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

      {/* Popular searches */}
      {showPopular && (
        <div className="py-2">
          <div className="px-4 py-1.5">
            <p className="text-[10px] font-semibold text-ecommerce-text-muted uppercase tracking-wider">{t('searchSuggestions.trendingSearches')}</p>
          </div>
          {POPULAR_TERMS.map((term, index) => (
            <button
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

      {/* Search hint at bottom */}
      {!showNoResults && (
        <div className="border-t border-ecommerce-border px-4 py-2.5 bg-ecommerce-surface-hover/50">
          <p className="text-[11px] text-ecommerce-text-muted">
            <kbd className="px-1.5 py-0.5 rounded bg-ecommerce-surface border border-ecommerce-border text-[10px] font-mono">↑↓</kbd>
            {' '}{t('common.searchPlaceholder').split(' ')[0]}
            {' · '}
            <kbd className="px-1.5 py-0.5 rounded bg-ecommerce-surface border border-ecommerce-border text-[10px] font-mono">Enter</kbd>
            {' '}{t('searchSuggestions.pressEnter').split(' ').slice(-2).join(' ')}
            {' · '}
            <kbd className="px-1.5 py-0.5 rounded bg-ecommerce-surface border border-ecommerce-border text-[10px] font-mono">Esc</kbd>
            {' '}{t('common.close').toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
}