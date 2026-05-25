"use client";

import type { CustomerOrder, CustomerOrderItem, OrderStatus } from "@/lib/orders";
import { normalizeCustomerEmail } from "@/lib/customerAuth";

export const PAYMENT_SUCCESS_STORAGE_KEY = "storefront-payment-success";

export type PaymentSuccessState = {
  customerEmail: string;
  orderId: string;
  total: string;
  status: OrderStatus;
  items: CustomerOrderItem[];
};

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function setPaymentSuccessState(state: PaymentSuccessState) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const customerEmail = normalizeCustomerEmail(state.customerEmail);

  if (!customerEmail) {
    storage.removeItem(PAYMENT_SUCCESS_STORAGE_KEY);
    return;
  }

  storage.setItem(
    PAYMENT_SUCCESS_STORAGE_KEY,
    JSON.stringify({
      ...state,
      customerEmail,
    }),
  );
}

export function readPaymentSuccessState(customerEmail?: string | null) {
  const storage = getStorage();

  if (!storage) {
    return null as PaymentSuccessState | null;
  }

  const rawValue = storage.getItem(PAYMENT_SUCCESS_STORAGE_KEY);

  if (!rawValue) {
    return null as PaymentSuccessState | null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as PaymentSuccessState;
    const normalizedCustomerEmail = normalizeCustomerEmail(customerEmail ?? "");
    const storedCustomerEmail = normalizeCustomerEmail(
      parsedValue.customerEmail ?? "",
    );

    if (
      typeof parsedValue.customerEmail !== "string" ||
      typeof parsedValue.orderId !== "string" ||
      typeof parsedValue.total !== "string" ||
      typeof parsedValue.status !== "string" ||
      !Array.isArray(parsedValue.items)
    ) {
      storage.removeItem(PAYMENT_SUCCESS_STORAGE_KEY);
      return null;
    }

    if (!normalizedCustomerEmail || storedCustomerEmail !== normalizedCustomerEmail) {
      return null;
    }

    return {
      ...parsedValue,
      customerEmail: storedCustomerEmail,
    };
  } catch {
    storage.removeItem(PAYMENT_SUCCESS_STORAGE_KEY);
    return null;
  }
}

export function clearPaymentSuccessState() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(PAYMENT_SUCCESS_STORAGE_KEY);
}

export function toFallbackCustomerOrder(
  successState: PaymentSuccessState,
): CustomerOrder {
  return {
    databaseId: 0,
    id: successState.orderId,
    date: new Date().toISOString(),
    status: successState.status,
    total: successState.total,
    itemCount: successState.items.reduce((total, item) => total + item.quantity, 0),
    items: successState.items,
    shipping: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
    },
    payment: {
      cardholderName: "",
      last4: "",
    },
  };
}
