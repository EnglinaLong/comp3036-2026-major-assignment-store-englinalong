"use client";

import type { PropsWithChildren } from "react";
import CartDrawer from "./CartDrawer";
import { CartProvider } from "./CartProvider";

export default function StorefrontProviders({
  children,
}: PropsWithChildren) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
