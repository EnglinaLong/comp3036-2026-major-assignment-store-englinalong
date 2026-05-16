"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { useCustomerAuth } from "./CustomerAuthProvider";
import {
  readCustomerWishlist,
  subscribeToCustomerWishlist,
} from "@/functions/customerWishlist";

export function AccountSummary() {
  const { cartCount, openCart } = useCart();
  const { account, customer, logout } = useCustomerAuth();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    setWishlistCount(readCustomerWishlist().length);

    return subscribeToCustomerWishlist(() => {
      setWishlistCount(readCustomerWishlist().length);
    });
  }, []);

  if (!customer) {
    return (
      <div className="rounded-[24px] border border-black/10 bg-neutral-50 p-5 dark:border-white/10 dark:bg-neutral-900">
        <p className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
          You&apos;re not logged in.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/account/register"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
          >
            Create Account
          </Link>
          <Link
            href="/account/login"
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="rounded-[24px] border border-black/10 bg-neutral-50 p-5 dark:border-white/10 dark:bg-neutral-900">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
          Signed In
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-neutral-950 dark:text-neutral-50">
          {customer.name}
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          {customer.email}
        </p>
        <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
          Your cart currently has {cartCount} {cartCount === 1 ? "item" : "items"}.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openCart}
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
          >
            Open Cart
          </button>
          <Link
            href="/#featured-products"
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
          >
            Shop Products
          </Link>
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
          >
            View Orders
          </Link>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
          >
            Logout
          </button>
        </div>
      </div>

      {account ? (
        <div className="rounded-[24px] border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
            Account Overview
          </p>
          <div className="mt-4 space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
            <p>Member since today</p>
            <p>
              {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
            </p>
            <p>
              {wishlistCount} {wishlistCount === 1 ? "wishlist item" : "wishlist items"}
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/account/orders"
              className="inline-flex items-center text-sm font-medium text-[color:var(--color-wsu)] transition hover:text-[color:var(--color-wsu-light)]"
            >
              Review order history
            </Link>
            <Link
              href="/account/wishlist"
              className="inline-flex items-center text-sm font-medium text-[color:var(--color-wsu)] transition hover:text-[color:var(--color-wsu-light)]"
            >
              View Wishlist
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
