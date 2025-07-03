import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (tshirt) => {
    setCartItems((prev) => {
      const exists = prev.find(
        (item) =>
          item.id === tshirt.id &&
          item.selectedSize === tshirt.selectedSize &&
          item.selectedColor === tshirt.selectedColor
      );

      if (exists) {
        return prev.map((item) =>
          item.id === tshirt.id &&
          item.selectedSize === tshirt.selectedSize &&
          item.selectedColor === tshirt.selectedColor
            ? { ...item, quantity: item.quantity + 10 }
            : item
        );
      }

      // Add new item with minimum quantity 10
      return [...prev, { ...tshirt, quantity: 10 }];
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(10, newQuantity) }
          : item
      )
    );
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity, // ✅ expose this
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
