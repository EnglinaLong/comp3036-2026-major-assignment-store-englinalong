"use client";

import type { PropsWithChildren } from "react";
import CartDrawer from "./CartDrawer";
import { CartProvider } from "./CartProvider";
import { CustomerAuthProvider } from "./CustomerAuthProvider";

export default function StorefrontProviders({
  children,
}: PropsWithChildren) {
  return (
    <CustomerAuthProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </CustomerAuthProvider>
  );
}
