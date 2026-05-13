"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { getProductHref } from "@/functions/productHref";
import { getProductPrice } from "@/functions/productPrice";
import type { Post } from "@repo/db/data";

export type CartItem = {
  id: number;
  urlId: string;
  title: string;
  category: string;
  price: string;
  quantity: number;
  href: string;
};

type CartContextValue = {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: string;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (post: Post) => void;
  removeFromCart: (postId: number) => void;
  increaseQuantity: (postId: number) => void;
  decreaseQuantity: (postId: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function priceToNumber(price: string) {
  return Number(price.replace(/[^0-9.]/g, "")) || 0;
}

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function createCartItem(post: Post): CartItem {
  return {
    id: post.id,
    urlId: post.urlId,
    title: post.title,
    category: post.category,
    price: getProductPrice(post.id),
    quantity: 1,
    href: getProductHref(post),
  };
}

export function CartProvider({ children }: PropsWithChildren) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const addToCart = useCallback((post: Post) => {
    setCartItems((current) => {
      const existingItem = current.find((item) => item.id === post.id);

      if (existingItem) {
        return current.map((item) =>
          item.id === post.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, createCartItem(post)];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((postId: number) => {
    setCartItems((current) => current.filter((item) => item.id !== postId));
  }, []);

  const increaseQuantity = useCallback((postId: number) => {
    setCartItems((current) =>
      current.map((item) =>
        item.id === postId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((postId: number) => {
    setCartItems((current) =>
      current.flatMap((item) => {
        if (item.id !== postId) {
          return [item];
        }

        if (item.quantity <= 1) {
          return [];
        }

        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  }, []);

  useEffect(() => {
    if (!isCartOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isCartOpen]);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const subtotal = useMemo(
    () =>
      formatCurrency(
        cartItems.reduce(
          (total, item) => total + priceToNumber(item.price) * item.quantity,
          0,
        ),
      ),
    [cartItems],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cartItems,
      cartCount,
      subtotal,
      isCartOpen,
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
    }),
    [
      addToCart,
      cartCount,
      cartItems,
      closeCart,
      decreaseQuantity,
      increaseQuantity,
      isCartOpen,
      openCart,
      removeFromCart,
      subtotal,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
