'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getItemQuantity: (id: string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

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

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        getItemQuantity,
        getTotalItems,
        getTotalPrice,
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
