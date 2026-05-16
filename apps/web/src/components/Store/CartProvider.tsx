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
import { useMergedStorefrontPosts } from "@/functions/storefrontPosts";
import { posts, type Post } from "@repo/db/data";

export type CartItem = {
  id: number;
  urlId: string;
  title: string;
  category: string;
  price: string;
  quantity: number;
  href: string;
};

const CART_STORAGE_KEY = "storefront-cart-items";

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
  clearCart: () => void;
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
    price: getProductPrice(post),
    quantity: 1,
    href: getProductHref(post),
  };
}

function resolveCartItem(item: CartItem, products: Post[]) {
  const latestProduct =
    products.find((product) => product.id === item.id) ??
    products.find((product) => product.urlId === item.urlId);

  if (!latestProduct) {
    return item;
  }

  return {
    ...item,
    urlId: latestProduct.urlId,
    title: latestProduct.title,
    category: latestProduct.category,
    price: getProductPrice(latestProduct),
    href: getProductHref(latestProduct),
  };
}

function readStoredCartItems() {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as CartItem[];

    return parsedValue.filter(
      (item) =>
        typeof item.id === "number" &&
        typeof item.urlId === "string" &&
        typeof item.title === "string" &&
        typeof item.category === "string" &&
        typeof item.price === "string" &&
        typeof item.quantity === "number" &&
        item.quantity > 0 &&
        typeof item.href === "string",
    );
  } catch {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

export function CartProvider({ children }: PropsWithChildren) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const mergedProducts = useMergedStorefrontPosts(posts);

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

  const clearCart = useCallback(() => {
    setCartItems([]);
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
    setCartItems(readStoredCartItems());
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, hasHydrated]);

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

  const resolvedCartItems = useMemo(
    () => cartItems.map((item) => resolveCartItem(item, mergedProducts)),
    [cartItems, mergedProducts],
  );

  const subtotal = useMemo(
    () =>
      formatCurrency(
        resolvedCartItems.reduce(
          (total, item) => total + priceToNumber(item.price) * item.quantity,
          0,
        ),
      ),
    [resolvedCartItems],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cartItems: resolvedCartItems,
      cartCount,
      subtotal,
      isCartOpen,
      openCart,
      closeCart,
      addToCart,
      clearCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
    }),
    [
      addToCart,
      cartCount,
      clearCart,
      closeCart,
      decreaseQuantity,
      increaseQuantity,
      isCartOpen,
      openCart,
      removeFromCart,
      resolvedCartItems,
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
