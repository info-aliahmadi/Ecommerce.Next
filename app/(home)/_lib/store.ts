import CONFIG from '@root/config';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CheckoutStep } from '../checkout/_components/types';
import PaymentMethod from '@root/app/types/enums/PaymentMethod';
import ProductDisplayModel from '../_types/Product/ProductDisplayModel';
import CartItem from '../_types/Order/CartItem';
import WishlistItem from '../_types/Order/WishlistItem';
import CompareItem from '../_types/Product/CompareItem';
import StockAlertType from '../_types/StockAlertType';
import { resolveLanguage } from '@root/utils/resolver';
import LanguageType from '@root/app/types/enums/LanguageType';



interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
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
          const existing = state.items.some((i) => i.variant.id === item.variant.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variant.id === item.variant.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (variantId: number) => {
        set((state) => ({
          items: state.items.filter((i) => i.variant.id !== variantId),
        }));
      },

      updateQuantity: (variantId: number, quantity) => {
        if (quantity <= 0) {
          // remove based on variant id
          set((state) => ({
            items: state.items.filter((i) => i.variant.id !== variantId),
          }));
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variant.id === variantId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.variant.sellPrice * i.quantity, 0),

      totalSavings: () =>
        get().items.reduce((sum, i) => {
          if (i.variant.oldSellPrice > 0) {
            return sum + (i.variant.oldSellPrice - i.variant.sellPrice) * i.quantity;
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


interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (variantId: number) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (variantId: number) => boolean;
  totalCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.find((i) => i.variant.id === item.variant.id)) return state;
          return { items: [...state.items, item] };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variant.id !== variantId),
        }));
      },

      toggleItem: (item) => {
        const isIn = get().items.some((i) => i.variant.id === item.variant.id);
        if (isIn) {
          get().removeItem(item.variant.id);
        } else {
          get().addItem(item);
        }
      },

      isInWishlist: (variantId) => get().items.some((i) => i.variant.id === variantId),
      totalCount: () => get().items.length,
    }),
    {
      name: 'ecommerce-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export type PageName = 'home' | 'checkout' | 'products' | 'product-detail' | 'profile';

export interface PageParams {
  productId?: string;
  [key: string]: string | undefined;
}

interface UIStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating' | 'name-asc' | 'name-desc' | 'oldest';
  setSortBy: (sort: UIStore['sortBy']) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  quickViewProduct: ProductDisplayModel | null;
  setQuickViewProduct: (product: ProductDisplayModel | null) => void;
  isCatalogOpen: boolean;
  setCatalogOpen: (open: boolean) => void;
  currentPage: PageName;
  pageParams: PageParams;
  navigate: (page: PageName, params?: PageParams) => void;
  goHome: () => void;
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
  isCatalogOpen: false,
  setCatalogOpen: (open) => set({ isCatalogOpen: open }),
  currentPage: 'home' as PageName,
  pageParams: {} as PageParams,
  navigate: (page, params) => set({ currentPage: page, pageParams: params || {} }),
  goHome: () => set({ currentPage: 'home', pageParams: {} }),
}));



interface RecentStore {
  items: ProductDisplayModel[];
  addItem: (item: Omit<ProductDisplayModel, 'viewedAt'>) => void;
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



interface CompareStore {
  items: CompareItem[];
  isCompareOpen: boolean;
  setCompareOpen: (open: boolean) => void;
  addItem: (item: CompareItem) => void;
  removeItem: (variantId: number) => void;
  clearAll: () => void;
  isInCompare: (variantId: number) => boolean;
  totalCount: () => number;
}

const MAX_COMPARE = 4;

export const useCompareStore = create<CompareStore>((set, get) => ({
  items: [],
  isCompareOpen: false,

  setCompareOpen: (open) => set({ isCompareOpen: open }),

  addItem: (item) => {
    const existing = get().items.find((i) => i.variant.id === item.variant.id);
    if (existing) {
      set((state) => ({ items: state.items.filter((i) => i.variant.id !== item.variant.id) }));
      return;
    }
    if (get().items.length >= MAX_COMPARE) {
      return;
    }
    set((state) => ({ items: [...state.items, item] }));
  },

  removeItem: (variantId) => {
    set((state) => ({ items: state.items.filter((i) => i.variant.id !== variantId) }));
  },

  clearAll: () => set({ items: [] }),

  isInCompare: (variantId) => get().items.some((i) => i.variant.id === variantId),

  totalCount: () => get().items.length,
}));



interface StockAlertStore {
  alerts: StockAlertType[];
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

// ── Auth Store ───────────────────────────────────────────────

interface AuthStore {
  isLoginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
  isRegisterOpen: boolean;
  setRegisterOpen: (open: boolean) => void;
  isForgotPasswordOpen: boolean;
  setForgotPasswordOpen: (open: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoginOpen: false,
  setLoginOpen: (open) => set({ isLoginOpen: open }),
  isRegisterOpen: false,
  setRegisterOpen: (open) => set({ isRegisterOpen: open }),
  isForgotPasswordOpen: false,
  setForgotPasswordOpen: (open) => set({ isForgotPasswordOpen: open }),
}));

// ── Checkout Persist Store (sessionStorage) ─────────────────

interface CheckoutPersistState {
  currentStep: CheckoutStep;
  paymentMethod: PaymentMethod | null;
  selectedAddressId: string | null;
  appliedPromo: string | null;
  shippingNote: string;
  setCheckoutPersist: (partial: Partial<CheckoutPersistState>) => void;
  clearCheckoutPersist: () => void;
}

export const useCheckoutPersistStore = create<CheckoutPersistState>()(
  persist(
    (set) => ({
      currentStep: 1 as CheckoutStep,
      paymentMethod: null,
      selectedAddressId: null,
      appliedPromo: null,
      shippingNote: '',
      setCheckoutPersist: (partial) => set(partial),
      clearCheckoutPersist: () =>
        set({
          currentStep: 1,
          paymentMethod: null,
          selectedAddressId: null,
          appliedPromo: null,
          shippingNote: '',
        }),
    }),
    {
      name: 'ecommerce-checkout',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        paymentMethod: state.paymentMethod,
        selectedAddressId: state.selectedAddressId,
        appliedPromo: state.appliedPromo,
        shippingNote: state.shippingNote,
      }),
    }
  )
);

// ── Locale Store ──────────────────────────────────────────────
export type Locale = 'en' | 'fa' | 'ar';

export const LOCALES = ['en', 'ar', 'fa'] as const;

export const DEFAULT_LOCALE = resolveLanguage(CONFIG.DEFAULT_LANGUAGE);

export const PERSIAN_CALENDAR: Locale[] = ['fa'];

export const RTL_LOCALES: Locale[] = ['fa', 'ar'];

export const LOCALE_CONFIG: Record<Locale, { name: string; dir: 'ltr' | 'rtl'; nativeName: string; type: LanguageType }> = {
  en: { name: 'English', dir: 'ltr', nativeName: 'English' , type: LanguageType.English },
  fa: { name: 'Farsi', dir: 'rtl', nativeName: 'فارسی' , type: LanguageType.Persian },
  ar: { name: 'Arabic', dir: 'rtl', nativeName: 'العربية' , type: LanguageType.Arabic },
};

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: 'en' as Locale,
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'ecommerce-locale',
    }
  )
);