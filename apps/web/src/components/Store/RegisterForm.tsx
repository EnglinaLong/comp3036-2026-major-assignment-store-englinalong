"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthBrandCard } from "./AuthBrandCard";
import { useCustomerAuth } from "./CustomerAuthProvider";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customer, hasHydrated, register } = useCustomerAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const returnTo = searchParams.get("returnTo") || "/account";
  const intent = searchParams.get("intent");

  function navigateTo(target: string) {
    router.refresh();
    router.replace(target);
  }

  if (!hasHydrated) {
    return (
      <div className="rounded-[24px] border border-black/10 bg-neutral-50 p-5 text-sm text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
        Loading account tools...
      </div>
    );
  }

  if (customer) {
    return (
      <div className="rounded-[24px] border border-[color:var(--color-wsu)]/15 bg-[color:var(--color-wsu)]/5 p-5">
        <p className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
          You&apos;re already signed in.
        </p>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          Continue to your account or return to shopping.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/account"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
          >
            View Account
          </Link>
          <Link
            href={returnTo}
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:items-stretch">
      <form
        className="space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();

          const result = await register({
            name,
            email,
            password,
          });

          if (!result.ok) {
            setError(result.error);
            return;
          }

          setError(null);
          navigateTo(intent === "checkout" ? returnTo : "/account");
        }}
      >
        <div className="grid gap-2">
          <label
            htmlFor="register-name"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
          >
            Full name
          </label>
          <input
            id="register-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-[20px] border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[color:var(--color-wsu)] focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:bg-neutral-950"
          />
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="register-email"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
          >
            Email
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-[20px] border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[color:var(--color-wsu)] focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:bg-neutral-950"
          />
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="register-password"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
          >
            Password
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-[20px] border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[color:var(--color-wsu)] focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:bg-neutral-950"
          />
        </div>

        {error ? (
          <p className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
        >
          Create Account
        </button>
      </form>

      <AuthBrandCard
        alternateHref={`/account/login${intent === "checkout" ? `?intent=checkout&returnTo=${encodeURIComponent(returnTo)}` : ""}`}
        alternateLabel="Already have an account? Log in"
      />
    </div>
  );
}
