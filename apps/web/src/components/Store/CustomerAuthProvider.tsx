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

export const CUSTOMER_ACCOUNT_STORAGE_KEY = "storefront-customer-account";
export const CUSTOMER_SESSION_STORAGE_KEY = "storefront-customer-session";

type StoredCustomerAccount = {
  name: string;
  email: string;
  password: string;
};

export type CustomerProfile = {
  name: string;
  email: string;
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
  }) => AuthResult;
  login: (input: { email: string; password: string }) => AuthResult;
  logout: () => void;
};

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function toCustomerProfile(account: StoredCustomerAccount): CustomerProfile {
  return {
    name: account.name,
    email: account.email,
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
    normalizeEmail(candidate.email).length > 0 &&
    typeof candidate.password === "string" &&
    candidate.password.length > 0
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
      email: normalizeEmail(parsedValue.email),
    };
  } catch {
    window.localStorage.removeItem(CUSTOMER_ACCOUNT_STORAGE_KEY);
    return null;
  }
}

function readStoredSession(account: StoredCustomerAccount | null) {
  if (typeof window === "undefined" || !account) {
    return null;
  }

  const rawValue = window.localStorage.getItem(CUSTOMER_SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as { email?: unknown };

    if (normalizeEmail(String(parsedValue.email ?? "")) !== account.email) {
      window.localStorage.removeItem(CUSTOMER_SESSION_STORAGE_KEY);
      return null;
    }

    return toCustomerProfile(account);
  } catch {
    window.localStorage.removeItem(CUSTOMER_SESSION_STORAGE_KEY);
    return null;
  }
}

export function CustomerAuthProvider({ children }: PropsWithChildren) {
  const [storedAccount, setStoredAccount] = useState<StoredCustomerAccount | null>(
    null,
  );
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const account = readStoredAccount();
    setStoredAccount(account);
    setCustomer(readStoredSession(account));
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydrated) {
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
  }, [hasHydrated, storedAccount]);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydrated) {
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
  }, [customer, hasHydrated]);

  const register = useCallback<
    CustomerAuthContextValue["register"]
  >(({ name, email, password }) => {
    const trimmedName = name.trim();
    const normalizedEmail = normalizeEmail(email);

    if (!trimmedName || !normalizedEmail || !password) {
      return {
        ok: false,
        error: "Enter your name, email, and password to create an account.",
      };
    }

    if (storedAccount) {
      return {
        ok: false,
        error: "An account with this email already exists. Please log in.",
      };
    }

    const nextAccount: StoredCustomerAccount = {
      name: trimmedName,
      email: normalizedEmail,
      password,
    };
    const nextCustomer = toCustomerProfile(nextAccount);

    setStoredAccount(nextAccount);
    setCustomer(nextCustomer);

    return {
      ok: true,
      customer: nextCustomer,
    };
  }, [storedAccount]);

  const login = useCallback<CustomerAuthContextValue["login"]>(
    ({ email, password }) => {
      const normalizedEmail = normalizeEmail(email);

      if (!storedAccount) {
        return {
          ok: false,
          error: "Create an account first before logging in.",
        };
      }

      if (
        storedAccount.email !== normalizedEmail ||
        storedAccount.password !== password
      ) {
        return {
          ok: false,
          error: "Incorrect email or password. Please try again.",
        };
      }

      const nextCustomer = toCustomerProfile(storedAccount);
      setCustomer(nextCustomer);

      return {
        ok: true,
        customer: nextCustomer,
      };
    },
    [storedAccount],
  );

  const logout = useCallback(() => {
    setCustomer(null);
  }, []);

  const value = useMemo<CustomerAuthContextValue>(
    () => ({
      account: storedAccount ? toCustomerProfile(storedAccount) : null,
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
