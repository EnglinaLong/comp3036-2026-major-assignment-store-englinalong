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
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { CART_STORAGE_KEY } from "./CartProvider";
import { clearPaymentSuccessState } from "@/functions/customerOrders";
import { clearCustomerWishlist } from "@/functions/customerWishlist";
import {
  type CustomerProfile,
  normalizeCustomerCreatedAt,
  normalizeCustomerEmail,
  toCustomerProfile as toAuthCustomerProfile,
} from "@/lib/customerAuth";

export const CUSTOMER_ACCOUNT_STORAGE_KEY = "storefront-customer-account";
export const CUSTOMER_SESSION_STORAGE_KEY = "storefront-customer-session";

type StoredCustomerAccount = {
  name: string;
  email: string;
  createdAt: string;
};

type AuthResult =
  | { ok: true; customer: CustomerProfile }
  | { ok: false; error: string };

type CustomerAuthContextValue = {
  account: CustomerProfile | null;
  customer: CustomerProfile | null;
  hasHydrated: boolean;
  register: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthResult>;
  login: (input: { email: string; password: string }) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

function toStoredCustomerProfile(account: StoredCustomerAccount): CustomerProfile {
  return {
    name: account.name,
    email: account.email,
    createdAt: account.createdAt,
  };
}

function isStoredCustomerAccount(value: unknown): value is StoredCustomerAccount {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.name === "string" &&
    candidate.name.trim().length > 0 &&
    typeof candidate.email === "string" &&
    normalizeCustomerEmail(candidate.email).length > 0
  );
}

function readStoredAccount() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(CUSTOMER_ACCOUNT_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown;

    if (!isStoredCustomerAccount(parsedValue)) {
      window.localStorage.removeItem(CUSTOMER_ACCOUNT_STORAGE_KEY);
      return null;
    }

    return {
      ...parsedValue,
      name: parsedValue.name.trim(),
      email: normalizeCustomerEmail(parsedValue.email),
      createdAt: normalizeCustomerCreatedAt(
        (parsedValue as { createdAt?: unknown }).createdAt,
      ),
    };
  } catch {
    window.localStorage.removeItem(CUSTOMER_ACCOUNT_STORAGE_KEY);
    return null;
  }
}

async function waitForSessionCustomer() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const session = await getSession();
    const customer = toAuthCustomerProfile({
      name: session?.user?.name,
      email: session?.user?.email,
      createdAt: session?.user?.createdAt,
    });

    if (customer) {
      return customer;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 150));
  }

  return null;
}

function clearCustomerClientState() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(CUSTOMER_ACCOUNT_STORAGE_KEY);
  window.localStorage.removeItem(CUSTOMER_SESSION_STORAGE_KEY);
  window.localStorage.removeItem(CART_STORAGE_KEY);
  clearCustomerWishlist();
  clearPaymentSuccessState();
}

export function CustomerAuthProvider({ children }: PropsWithChildren) {
  const { data: session, status } = useSession();
  const [storedAccount, setStoredAccount] = useState<StoredCustomerAccount | null>(
    null,
  );
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const account = readStoredAccount();
    setStoredAccount(account);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CUSTOMER_SESSION_STORAGE_KEY);
    }
    setHasLoadedStorage(true);
  }, []);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    const sessionCustomer = toAuthCustomerProfile({
      name: session?.user?.name,
      email: session?.user?.email,
      createdAt: session?.user?.createdAt,
    });

    setCustomer(sessionCustomer);

    if (sessionCustomer) {
      setStoredAccount(sessionCustomer);
    } else if (typeof window !== "undefined") {
      window.localStorage.removeItem(CUSTOMER_SESSION_STORAGE_KEY);
    }
  }, [session, status]);

  const hasHydrated = hasLoadedStorage && status !== "loading";

  useEffect(() => {
    if (typeof window === "undefined" || !hasLoadedStorage) {
      return;
    }

    if (!storedAccount) {
      window.localStorage.removeItem(CUSTOMER_ACCOUNT_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      CUSTOMER_ACCOUNT_STORAGE_KEY,
      JSON.stringify(storedAccount),
    );
  }, [hasLoadedStorage, storedAccount]);

  useEffect(() => {
    if (typeof window === "undefined" || !hasLoadedStorage) {
      return;
    }

    if (!customer) {
      window.localStorage.removeItem(CUSTOMER_SESSION_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      CUSTOMER_SESSION_STORAGE_KEY,
      JSON.stringify({ email: customer.email }),
    );
  }, [customer, hasLoadedStorage]);

  const register = useCallback<CustomerAuthContextValue["register"]>(
    async ({ name, email, password }) => {
      const trimmedName = name.trim();
      const normalizedEmail = normalizeCustomerEmail(email);

      if (!trimmedName || !normalizedEmail || !password) {
        return {
          ok: false,
          error: "Enter your name, email, and password to create an account.",
        };
      }

      const response = await fetch("/api/account/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: normalizedEmail,
          password,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; customer?: CustomerProfile | null }
        | null;

      if (!response.ok) {
        return {
          ok: false,
          error:
            payload?.error ||
            "Unable to create your account right now. Please try again.",
        };
      }

      const loginResult = await signIn("credentials", {
        redirect: false,
        email: normalizedEmail,
        password,
      });

      const nextCustomer = await waitForSessionCustomer();

      if (!nextCustomer) {
        return {
          ok: false,
          error:
            !loginResult || loginResult.error
              ? "Your account was created, but we could not sign you in."
              : "Your account was created, but we could not confirm your session.",
        };
      }

      clearPaymentSuccessState();
      setCustomer(nextCustomer);
      setStoredAccount(nextCustomer);

      return {
        ok: true,
        customer: nextCustomer,
      };
    },
    [],
  );

  const login = useCallback<CustomerAuthContextValue["login"]>(
    async ({ email, password }) => {
      const normalizedEmail = normalizeCustomerEmail(email);

      if (!normalizedEmail || !password) {
        return {
          ok: false,
          error: "Enter your email and password to log in.",
        };
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: normalizedEmail,
        password,
      });

      if (!result || result.error) {
        return {
          ok: false,
          error: "Incorrect email or password. Please try again.",
        };
      }

      const nextCustomer = await waitForSessionCustomer();

      if (!nextCustomer) {
        return {
          ok: false,
          error: "We could not confirm your account session. Please try again.",
        };
      }

      clearPaymentSuccessState();
      setCustomer(nextCustomer);
      setStoredAccount(nextCustomer);

      return {
        ok: true,
        customer: nextCustomer,
      };
    },
    [],
  );

  const logout = useCallback(async () => {
    clearCustomerClientState();
    setCustomer(null);
    setStoredAccount(null);
    await signOut({
      redirect: false,
    });
    clearCustomerClientState();
  }, []);

  const value = useMemo<CustomerAuthContextValue>(
    () => ({
      account: storedAccount ? toStoredCustomerProfile(storedAccount) : null,
      customer,
      hasHydrated,
      register,
      login,
      logout,
    }),
    [customer, hasHydrated, login, logout, register, storedAccount],
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);

  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }

  return context;
}
