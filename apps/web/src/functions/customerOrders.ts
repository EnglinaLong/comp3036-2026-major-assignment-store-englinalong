"use client";

import type { CartItem } from "@/components/Store/CartProvider";

export const CUSTOMER_ORDERS_STORAGE_KEY = "storefront-customer-orders";
export const PAYMENT_SUCCESS_STORAGE_KEY = "storefront-payment-success";

export type CustomerOrder = {
  id: string;
  date: string;
  status: "Paid";
  total: string;
  itemCount: number;
  items: CartItem[];
  shipping: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  payment: {
    cardholderName: string;
    last4: string;
  };
};

type PaymentSuccessState = {
  orderId: string;
  total: string;
};

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function readCustomerOrders() {
  const storage = getStorage();

  if (!storage) {
    return [] as CustomerOrder[];
  }

  const rawValue = storage.getItem(CUSTOMER_ORDERS_STORAGE_KEY);

  if (!rawValue) {
    return [] as CustomerOrder[];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as CustomerOrder[];

    return parsedValue.filter(
      (order) =>
        typeof order.id === "string" &&
        typeof order.date === "string" &&
        order.status === "Paid" &&
        typeof order.total === "string" &&
        typeof order.itemCount === "number" &&
        Array.isArray(order.items),
    );
  } catch {
    storage.removeItem(CUSTOMER_ORDERS_STORAGE_KEY);
    return [] as CustomerOrder[];
  }
}

export function saveCustomerOrder(order: CustomerOrder) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const currentOrders = readCustomerOrders();
  storage.setItem(
    CUSTOMER_ORDERS_STORAGE_KEY,
    JSON.stringify([order, ...currentOrders]),
  );
}

export function setPaymentSuccessState(state: PaymentSuccessState) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(PAYMENT_SUCCESS_STORAGE_KEY, JSON.stringify(state));
}

export function readPaymentSuccessState() {
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

    if (
      typeof parsedValue.orderId !== "string" ||
      typeof parsedValue.total !== "string"
    ) {
      storage.removeItem(PAYMENT_SUCCESS_STORAGE_KEY);
      return null;
    }

    return parsedValue;
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
