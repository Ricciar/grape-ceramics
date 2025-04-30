import React, { createContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  imageUrl: string;
  description: string;
}

// Definiera kontextens struktur
export type CartContextType = {
  cart: CartItem[];
  addToCart: (product: CartItem, quantityChange: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
};

// Skapa en kontext med standardvärden
export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

// Provider-komponenten som håller i varukorgens state
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: CartItem, quantityChange: number = 1) => {
    console.log('addToCart called with quantityChange:', quantityChange); // Logga varje anrop
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Om produkten redan finns i varukorgen, uppdatera dess kvantitet
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantityChange;

        // Om kvantiteten blir noll eller mindre, ta bort produkten från varukorgen
        if (updatedCart[existingItemIndex].quantity <= 0) {
          return updatedCart.filter((item) => item.id !== product.id);
        }

        return updatedCart;
      } else {
        // Om produkten inte finns i varukorgen, lägg till den med startkvantitet
        return [...prevCart, { ...product, quantity: quantityChange }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
