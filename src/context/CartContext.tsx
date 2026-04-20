'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

interface CartItemModifier {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  quantity: number;
  modifiers?: CartItemModifier[];
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  restaurantSlug: string | null;
  setRestaurantSlug: (slug: string) => void;
  hasCartFromOtherRestaurant: (slug: string) => boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateSpecialInstructions: (id: string, instructions: string) => void;
  getItemQuantity: (id: string) => number;
  getTotalQuantityByMenuItemId: (menuItemId: string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  clearCart: () => void;
  isSubmitting: boolean;
  setSubmitting: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cart.v1';
// Expire an untouched cart after 12 hours — protects stale tabs.
const CART_MAX_AGE_MS = 12 * 60 * 60 * 1000;

interface StoredCart {
  items: CartItem[];
  restaurantSlug: string | null;
  updatedAt: number;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantSlug, setRestaurantSlugState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hydrate once from localStorage on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredCart>;
        const fresh =
          typeof parsed.updatedAt === 'number' && Date.now() - parsed.updatedAt < CART_MAX_AGE_MS;
        if (fresh && Array.isArray(parsed.items)) {
          setItems(parsed.items);
          setRestaurantSlugState(parsed.restaurantSlug ?? null);
        } else {
          window.localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    } catch {
      // Corrupt payload or storage disabled — start empty.
    }
    setHydrated(true);
  }, []);

  // Persist whenever items or restaurantSlug change (but not before hydration finishes).
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (items.length === 0 && restaurantSlug === null) {
        window.localStorage.removeItem(CART_STORAGE_KEY);
        return;
      }
      const payload: StoredCart = { items, restaurantSlug, updatedAt: Date.now() };
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Quota exceeded or unavailable — carry on with in-memory state.
    }
  }, [items, restaurantSlug, hydrated]);

  const setRestaurantSlug = useCallback((slug: string) => {
    setRestaurantSlugState(slug);
  }, []);

  const hasCartFromOtherRestaurant = useCallback(
    (slug: string) => items.length > 0 && restaurantSlug !== null && restaurantSlug !== slug,
    [items.length, restaurantSlug]
  );

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === id);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(i => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
      }
      return prevItems.filter(i => i.id !== id);
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prevItems => prevItems.filter(i => i.id !== id));
    } else {
      setItems(prevItems => prevItems.map(i => (i.id === id ? { ...i, quantity } : i)));
    }
  }, []);

  const updateSpecialInstructions = useCallback((id: string, instructions: string) => {
    setItems(prevItems =>
      prevItems.map(i => (i.id === id ? { ...i, specialInstructions: instructions } : i))
    );
  }, []);

  const getItemQuantity = useCallback(
    (id: string) => {
      const item = items.find(i => i.id === id);
      return item?.quantity || 0;
    },
    [items]
  );

  const getTotalQuantityByMenuItemId = useCallback(
    (menuItemId: string) => {
      return items.filter(i => i.menuItemId === menuItemId).reduce((sum, i) => sum + i.quantity, 0);
    },
    [items]
  );

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getSubtotal = useCallback(() => {
    return items.reduce((total, item) => {
      const modifierTotal = item.modifiers?.reduce((m, mod) => m + mod.price, 0) || 0;
      return total + (item.price + modifierTotal) * item.quantity;
    }, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return getSubtotal();
  }, [getSubtotal]);

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantSlugState(null);
  }, []);

  const setSubmitting = useCallback((v: boolean) => {
    setIsSubmitting(v);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantSlug,
        setRestaurantSlug,
        hasCartFromOtherRestaurant,
        addItem,
        removeItem,
        updateQuantity,
        updateSpecialInstructions,
        getItemQuantity,
        getTotalQuantityByMenuItemId,
        getTotalItems,
        getTotalPrice,
        getSubtotal,
        clearCart,
        isSubmitting,
        setSubmitting,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
