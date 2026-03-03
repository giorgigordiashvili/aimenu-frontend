'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateSpecialInstructions: (id: string, instructions: string) => void;
  getItemQuantity: (id: string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantSlug, setRestaurantSlugState] = useState<string | null>(null);

  const setRestaurantSlug = useCallback((slug: string) => {
    setRestaurantSlugState(slug);
  }, []);

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

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantSlug,
        setRestaurantSlug,
        addItem,
        removeItem,
        updateQuantity,
        updateSpecialInstructions,
        getItemQuantity,
        getTotalItems,
        getTotalPrice,
        getSubtotal,
        clearCart,
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
