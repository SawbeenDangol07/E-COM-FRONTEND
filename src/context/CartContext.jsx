import { createContext } from "react";

export const CartContext = createContext({
  cart: [],
  isCartOpen: false,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  setIsCartOpen: () => {},
  cartTotal: 0,
  cartCount: 0,
});

export default CartContext;
