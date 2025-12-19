import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';
import { getCart, saveCart as saveCartToStorage } from '../services/storage';

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cart = await getCart();
      setItems(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addItem = async (item: Omit<CartItem, 'id'>) => {
    const existingIndex = items.findIndex(
      (i) =>
        i.productId === item.productId &&
        i.size === item.size &&
        i.sugar === item.sugar
    );

    let newItems: CartItem[];
    if (existingIndex >= 0) {
      newItems = items.map((i, idx) =>
        idx === existingIndex ? { ...i, quantity: i.quantity + item.quantity } : i
      );
    } else {
      const newItem: CartItem = { ...item, id: Date.now().toString() };
      newItems = [...items, newItem];
    }

    setItems(newItems);
    await saveCartToStorage(newItems);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    let newItems: CartItem[];
    if (quantity <= 0) {
      newItems = items.filter((i) => i.id !== itemId);
    } else {
      newItems = items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
    }
    setItems(newItems);
    await saveCartToStorage(newItems);
  };

  const removeItem = async (itemId: string) => {
    const newItems = items.filter((i) => i.id !== itemId);
    setItems(newItems);
    await saveCartToStorage(newItems);
  };

  const clearCart = async () => {
    setItems([]);
    await saveCartToStorage([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        itemCount,
        subtotal,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
