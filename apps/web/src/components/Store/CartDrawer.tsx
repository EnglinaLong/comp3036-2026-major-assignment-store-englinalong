"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { useCustomerAuth } from "./CustomerAuthProvider";

export default function CartDrawer() {
  const {
    cartItems,
    subtotal,
    availableCartCount,
    hasUnavailableItems,
    hasStockIssues,
    isCartOpen,
    closeCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const { customer, hasHydrated } = useCustomerAuth();
  const router = useRouter();
  const hasAvailableItems = availableCartCount > 0;
  const canCheckout = hasAvailableItems && !hasStockIssues;

  useEffect(() => {
    if (!isCartOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCart();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeCart, isCartOpen]);

  function handleCheckout() {
    if (!canCheckout) {
      return;
    }

    if (!hasHydrated) {
      return;
    }

    if (!customer) {
      closeCart();
      router.push(
        `/account/login?intent=checkout&returnTo=${encodeURIComponent(
          "/checkout",
        )}`,
      );
      return;
    }

    closeCart();
    router.push("/checkout");
  }

  if (!isCartOpen && cartItems.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        isCartOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isCartOpen}
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-150 ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-black/10 bg-white shadow-[-18px_0_60px_rgba(15,23,42,0.16)] transition-none dark:border-white/10 dark:bg-neutral-950 dark:shadow-[-18px_0_60px_rgba(0,0,0,0.45)] ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800 sm:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
              Cart
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-neutral-950 dark:text-neutral-50">
              {availableCartCount}{" "}
              {availableCartCount === 1 ? "available item" : "available items"}
            </h2>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
          >
            Close
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="w-full rounded-[28px] border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 dark:border-neutral-700 dark:bg-neutral-900">
              <p className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">
                Your cart is empty.
              </p>
              <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                Add a toolkit or template to start building your stack.
              </p>
              <Link
                href="/#featured-products"
                onClick={closeCart}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
              {cartItems.map((item) => (
                <article
                  key={`cart-item-${item.urlId}`}
                  className="rounded-[24px] border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <Link
                        href={item.href}
                        onClick={closeCart}
                        className="block text-base font-semibold text-neutral-950 transition hover:text-[color:var(--color-wsu)] dark:text-neutral-50"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {item.category}
                      </p>
                      {!item.isAvailable ? (
                        <p className="text-sm text-amber-600 dark:text-amber-300">
                          {item.stockQuantity <= 0
                            ? "This product is out of stock."
                            : "This product is no longer available."}
                        </p>
                      ) : item.hasInsufficientStock ? (
                        <p className="text-sm text-amber-600 dark:text-amber-300">
                          Only {item.stockQuantity} left in stock.
                        </p>
                      ) : null}
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                      {item.price}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="grid grid-cols-[2.5rem_2rem_2.5rem] items-center rounded-full border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-950">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.title}`}
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={!item.isAvailable}
                        className="h-9 w-10 rounded-full text-sm font-semibold text-neutral-700 transition-none hover:bg-white hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-200 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
                      >
                        -
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.title}`}
                        onClick={() => increaseQuantity(item.id)}
                        disabled={!item.canIncreaseQuantity}
                        className="h-9 w-10 rounded-full text-sm font-semibold text-neutral-700 transition-none hover:bg-white hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-200 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm font-medium text-[color:var(--color-wsu)] transition hover:text-[color:var(--color-wsu-light)]"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="border-t border-neutral-200 bg-neutral-50 px-5 py-5 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
              <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-300">
                <span>Subtotal</span>
                <span
                  aria-label={`Subtotal ${subtotal}`}
                  className="text-xl font-semibold text-neutral-950 dark:text-neutral-50"
                >
                  Total: {subtotal}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                {!hasAvailableItems
                  ? "No available products to checkout."
                  : !hasHydrated
                    ? "Checking your account before checkout."
                  : hasStockIssues
                    ? "Reduce quantities to match available stock before checkout."
                  : customer
                    ? "Secure checkout and instant access after purchase."
                    : "Please sign in to continue to checkout."}
              </p>
              {hasUnavailableItems && hasAvailableItems ? (
                <p className="mt-2 text-sm text-amber-600 dark:text-amber-300">
                  Unavailable products will be excluded from checkout.
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={!canCheckout || !hasHydrated}
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
