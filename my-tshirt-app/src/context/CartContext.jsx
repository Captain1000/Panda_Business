import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (tshirt) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === tshirt.id);
      if (exists) {
        return prev.map((item) =>
          item.id === tshirt.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...tshirt, quantity: 1 }];
    });
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
