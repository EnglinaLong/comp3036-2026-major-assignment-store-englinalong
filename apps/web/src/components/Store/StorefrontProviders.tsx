"use client";

import type { Post } from "@repo/db/data";
import type { PropsWithChildren } from "react";
import CartDrawer from "./CartDrawer";
import { CartProvider } from "./CartProvider";
import { CustomerAuthProvider } from "./CustomerAuthProvider";

export default function StorefrontProviders({
  children,
  initialPosts,
}: PropsWithChildren<{ initialPosts: Post[] }>) {
  return (
    <CustomerAuthProvider>
      <CartProvider initialPosts={initialPosts}>
        {children}
        <CartDrawer />
      </CartProvider>
    </CustomerAuthProvider>
  );
}
