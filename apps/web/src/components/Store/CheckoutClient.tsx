"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import { useCustomerAuth } from "./CustomerAuthProvider";
import {
  setPaymentSuccessState,
} from "@/functions/customerOrders";
import type { CustomerOrder } from "@/lib/orders";

type CheckoutFormState = {
  fullName: string;
  email: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

type CheckoutErrors = Partial<Record<keyof CheckoutFormState, string>>;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCardNumber(value: string) {
  return onlyDigits(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function formatExpiryDate(value: string) {
  const digits = onlyDigits(value).slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isValidExpiryDate(value: string) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value.trim());

  if (!match || !match[1] || !match[2]) {
    return false;
  }

  const month = Number.parseInt(match[1], 10);
  const year = Number.parseInt(match[2], 10);

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) {
    return false;
  }

  if (year === currentYear && month < currentMonth) {
    return false;
  }

  return true;
}

function validateForm(values: CheckoutFormState) {
  const errors: CheckoutErrors = {};

  if (!values.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!values.email.trim()) errors.email = "Enter your email.";
  if (!values.cardholderName.trim()) {
    errors.cardholderName = "Enter the cardholder name.";
  }
  if (onlyDigits(values.cardNumber).length !== 16) {
    errors.cardNumber = "Enter a valid card number.";
  }
  if (!isValidExpiryDate(values.expiryDate)) {
    errors.expiryDate = "Enter a valid expiry date in MM/YY format.";
  }
  if (onlyDigits(values.cvv).length < 3) {
    errors.cvv = "Enter a valid security code.";
  }

  return errors;
}

export function CheckoutClient() {
  const router = useRouter();
  const {
    cartItems,
    availableCartItems,
    availableCartCount,
    subtotal,
    hasStockIssues,
    clearAvailableItems,
  } = useCart();
  const { account, customer, hasHydrated } = useCustomerAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirectingToOrders, setIsRedirectingToOrders] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [formState, setFormState] = useState<CheckoutFormState>({
    fullName: "",
    email: "",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const checkoutCustomer = customer ?? account;

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!checkoutCustomer) {
      return;
    }

    setFormState((current) => ({
      ...current,
      fullName: current.fullName || checkoutCustomer.name,
      email: current.email || checkoutCustomer.email,
      cardholderName: current.cardholderName || checkoutCustomer.name,
    }));
  }, [checkoutCustomer, hasHydrated]);

  useEffect(() => {
    if (!isRedirectingToOrders) {
      return;
    }

    router.replace("/account/orders");
  }, [isRedirectingToOrders, router]);

  const orderSummary = useMemo(
    () =>
      availableCartItems.map((item) => ({
        ...item,
        lineTotal: `$${(
          Number(item.price.replace(/[^0-9.]/g, "")) * item.quantity
        ).toFixed(2)}`,
      })),
    [availableCartItems],
  );

  function updateField(field: keyof CheckoutFormState, value: string) {
    setFormState((current) => ({
      ...current,
      [field]:
        field === "cardNumber"
          ? formatCardNumber(value)
          : field === "expiryDate"
            ? formatExpiryDate(value)
            : field === "cvv"
              ? onlyDigits(value).slice(0, 4)
              : value,
    }));

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (availableCartItems.length === 0 || hasStockIssues) {
      if (hasStockIssues) {
        setFormError("Please reduce item quantities to match available stock.");
      }
      return;
    }

    const nextErrors = validateForm(formState);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFormError("Please review your checkout details and try again.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const customerEmail = checkoutCustomer?.email;

      if (!customerEmail) {
        setFormError("Please log in before continuing to checkout.");
        return;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 1200));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: availableCartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; order?: CustomerOrder }
        | null;

      if (response.status === 401) {
        setFormError("Please log in before continuing to checkout.");
        return;
      }

      if (!response.ok || !payload?.order) {
        setFormError(
          payload?.error ||
            "Please review your checkout details and try again.",
        );
        return;
      }

      setPaymentSuccessState({
        customerEmail,
        orderId: payload.order.id,
        total: payload.order.total,
        status: payload.order.status,
        items: payload.order.items,
      });
      clearAvailableItems();
      setIsRedirectingToOrders(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isRedirectingToOrders) {
    return (
      <div className="rounded-[28px] border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-neutral-950">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Finalizing your order...
        </p>
      </div>
    );
  }

  if (!hasHydrated) {
    return (
      <div className="rounded-[28px] border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-neutral-950">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Preparing checkout...
        </p>
      </div>
    );
  }

  if (!checkoutCustomer) {
    return (
      <div className="rounded-[28px] border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-semibold text-neutral-950 dark:text-neutral-50">
          Please log in to continue.
        </h2>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
          Sign in to complete your checkout.
        </p>
        <Link
          href="/account/login?intent=checkout&returnTo=%2Fcheckout"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
        >
          Login
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="rounded-[28px] border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-semibold text-neutral-950 dark:text-neutral-50">
          Your cart is empty.
        </h2>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
          Add a few items before continuing to checkout.
        </p>
        <Link
          href="/#featured-products"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  if (availableCartItems.length === 0) {
    return (
      <div className="rounded-[28px] border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-semibold text-neutral-950 dark:text-neutral-50">
          No available products to checkout.
        </h2>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
          Remove unavailable items from your cart before continuing.
        </p>
        <Link
          href="/#featured-products"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_23rem]">
      <div className="space-y-6">
        <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-950 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
            Customer Information
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field
              id="checkout-full-name"
              label="Full Name"
              value={formState.fullName}
              error={errors.fullName}
              onChange={(value) => updateField("fullName", value)}
            />
            <Field
              id="checkout-email"
              label="Email"
              type="email"
              value={formState.email}
              error={errors.email}
              className="md:col-span-2"
              onChange={(value) => updateField("email", value)}
            />
          </div>
        </section>

        <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-950 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
            Payment Details
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field
              id="checkout-cardholder-name"
              label="Cardholder Name"
              value={formState.cardholderName}
              error={errors.cardholderName}
              className="md:col-span-2"
              onChange={(value) => updateField("cardholderName", value)}
            />
            <Field
              id="checkout-card-number"
              label="Card Number"
              value={formState.cardNumber}
              error={errors.cardNumber}
              className="md:col-span-2"
              onChange={(value) => updateField("cardNumber", value)}
            />
            <Field
              id="checkout-expiry-date"
              label="Expiry Date"
              placeholder="MM/YY"
              value={formState.expiryDate}
              error={errors.expiryDate}
              onChange={(value) => updateField("expiryDate", value)}
            />
            <Field
              id="checkout-cvv"
              label="CVV"
              value={formState.cvv}
              error={errors.cvv}
              onChange={(value) => updateField("cvv", value)}
            />
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-950 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
            Order Summary
          </p>
          <div className="mt-5 space-y-4">
            {orderSummary.map((item) => (
              <div
                key={`checkout-item-${item.urlId}`}
                className="flex items-start justify-between gap-4 rounded-[22px] border border-neutral-100 bg-neutral-50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div>
                  <p className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                    {item.category} · Qty {item.quantity}
                  </p>
                  {item.quantity > item.stockQuantity ? (
                    <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-300">
                      Only {item.stockQuantity} left in stock.
                    </p>
                  ) : null}
                </div>
                <p className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                  {item.lineTotal}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-950 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
            Order Total
          </p>
          <div className="mt-5 space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span>{availableCartCount}</span>
            </div>
            <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-base font-semibold text-neutral-950 dark:border-neutral-800 dark:text-neutral-50">
              <span>Total</span>
              <span>{subtotal}</span>
            </div>
          </div>

          {formError ? (
            <p className="mt-5 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              {formError}
            </p>
          ) : null}

          {hasStockIssues ? (
            <p className="mt-5 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              Reduce item quantities to match current stock before checkout.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || hasStockIssues}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Processing Payment..." : "Complete Purchase"}
          </button>
        </section>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[20px] border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[color:var(--color-wsu)] focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-950"
      />
      {error ? (
        <p className="mt-2 text-sm text-red-600 dark:text-red-300">{error}</p>
      ) : null}
    </div>
  );
}
