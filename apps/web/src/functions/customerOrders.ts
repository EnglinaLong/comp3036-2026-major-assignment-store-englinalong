"use client";

import type { CustomerOrder } from "@/lib/orders";

export const CUSTOMER_ORDERS_STORAGE_KEY = "storefront-customer-orders";
export const PAYMENT_SUCCESS_STORAGE_KEY = "storefront-payment-success";

type PaymentSuccessState = {
  orderId: string;
  total: string;
};

function parseDatabaseOrderId(orderId: string) {
  const match = /^ORD-(\d+)$/.exec(orderId);

  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function dedupeOrdersById(orders: CustomerOrder[]) {
  const uniqueOrders = new Map<string, CustomerOrder>();

  for (const order of orders) {
    uniqueOrders.set(order.id, order);
  }

  return Array.from(uniqueOrders.values());
}

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

    return dedupeOrdersById(
      parsedValue
      .map((order) => {
        const databaseId =
          typeof order.databaseId === "number" && Number.isSafeInteger(order.databaseId)
            ? order.databaseId
            : typeof order.id === "string"
              ? parseDatabaseOrderId(order.id)
              : null;

        if (databaseId === null) {
          return null;
        }

        return {
          ...order,
          databaseId,
        };
      })
      .filter(
        (order): order is CustomerOrder =>
          order !== null &&
          typeof order.id === "string" &&
          typeof order.date === "string" &&
          order.status === "Paid" &&
          typeof order.total === "string" &&
          typeof order.itemCount === "number" &&
          Array.isArray(order.items) &&
          order.shipping !== null &&
          typeof order.shipping === "object" &&
          order.payment !== null &&
          typeof order.payment === "object",
      ),
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
    JSON.stringify(dedupeOrdersById([order, ...currentOrders])),
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
