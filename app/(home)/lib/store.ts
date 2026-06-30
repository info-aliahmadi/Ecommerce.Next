import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  totalSavings: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      setCartOpen: (open) => set({ isCartOpen: open }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      totalSavings: () =>
        get().items.reduce((sum, i) => {
          if (i.comparePrice) {
            return sum + (i.comparePrice - i.price) * i.quantity;
          }
          return sum;
        }, 0),
    }),
    {
      name: 'ecommerce-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  category: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  totalCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.find((i) => i.id === item.id)) return state;
          return { items: [...state.items, item] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      toggleItem: (item) => {
        const isIn = get().items.some((i) => i.id === item.id);
        if (isIn) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },

      isInWishlist: (id) => get().items.some((i) => i.id === id),
      totalCount: () => get().items.length,
    }),
    {
      name: 'ecommerce-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export interface QuickViewProduct {
  id: string;
  name: string;
  description: string;
  shortDesc?: string;
  price: number;
  comparePrice?: number;
  image: string;
  images?: string;
  rating: number;
  reviewCount: number;
  category: { name: string; color: string };
  stock: number;
  sku?: string;
  tags?: string;
}

interface UIStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  setSortBy: (sort: UIStore['sortBy']) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  quickViewProduct: QuickViewProduct | null;
  setQuickViewProduct: (product: QuickViewProduct | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  sortBy: 'newest',
  setSortBy: (sort) => set({ sortBy: sort }),
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  isWishlistOpen: false,
  setWishlistOpen: (open) => set({ isWishlistOpen: open }),
  quickViewProduct: null,
  setQuickViewProduct: (product) => set({ quickViewProduct: product }),
}));

export interface RecentItem {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  category: string;
  viewedAt: number;
}

interface RecentStore {
  items: RecentItem[];
  addItem: (item: Omit<RecentItem, 'viewedAt'>) => void;
}

const MAX_RECENT = 10;

export const useRecentStore = create<RecentStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const filtered = state.items.filter((i) => i.id !== item.id);
          return { items: [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, MAX_RECENT) };
        });
      },
    }),
    { name: 'ecommerce-recently-viewed' }
  )
);

export interface CompareItem {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: { name: string; color: string };
  stock: number;
  description: string;
  sku?: string;
}

interface CompareStore {
  items: CompareItem[];
  isCompareOpen: boolean;
  setCompareOpen: (open: boolean) => void;
  addItem: (item: CompareItem) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
  totalCount: () => number;
}

const MAX_COMPARE = 4;

export const useCompareStore = create<CompareStore>((set, get) => ({
  items: [],
  isCompareOpen: false,

  setCompareOpen: (open) => set({ isCompareOpen: open }),

  addItem: (item) => {
    const existing = get().items.find((i) => i.id === item.id);
    if (existing) {
      set((state) => ({ items: state.items.filter((i) => i.id !== item.id) }));
      return;
    }
    if (get().items.length >= MAX_COMPARE) {
      return;
    }
    set((state) => ({ items: [...state.items, item] }));
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
  },

  clearAll: () => set({ items: [] }),

  isInCompare: (id) => get().items.some((i) => i.id === id),

  totalCount: () => get().items.length,
}));

export interface StockAlert {
  id: string;
  productName: string;
  stock: number;
  timestamp: number;
}

interface StockAlertStore {
  alerts: StockAlert[];
  addAlert: (product: { name: string; stock: number }) => void;
  dismissAlert: (id: string) => void;
  clearAll: () => void;
}

export const useStockAlertStore = create<StockAlertStore>()(
  persist(
    (set, get) => ({
      alerts: [],

      addAlert: (product) => {
        const id = `alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        set((state) => ({
          alerts: [
            { id, productName: product.name, stock: product.stock, timestamp: Date.now() },
            ...state.alerts,
          ].slice(0, 5),
        }));
      },

      dismissAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== id),
        }));
      },

      clearAll: () => set({ alerts: [] }),
    }),
    {
      name: 'ecommerce-stock-alerts',
      partialize: (state) => ({ alerts: state.alerts }),
    }
  )
);