"use client";

export const PAYMENT_SUCCESS_STORAGE_KEY = "storefront-payment-success";

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
