"use client";

export const CUSTOMER_WISHLIST_STORAGE_KEY = "storefront-customer-wishlist";
export const CUSTOMER_WISHLIST_EVENT = "storefront-customer-wishlist:change";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function normalizeWishlistEntries(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return Array.from(
    new Set(
      value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0),
    ),
  );
}

function notifyWishlistChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(CUSTOMER_WISHLIST_EVENT));
}

export function readCustomerWishlist() {
  const storage = getStorage();

  if (!storage) {
    return [] as string[];
  }

  const rawValue = storage.getItem(CUSTOMER_WISHLIST_STORAGE_KEY);

  if (!rawValue) {
    return [] as string[];
  }

  try {
    return normalizeWishlistEntries(JSON.parse(rawValue));
  } catch {
    storage.removeItem(CUSTOMER_WISHLIST_STORAGE_KEY);
    return [] as string[];
  }
}

export function isProductWishlisted(urlId: string) {
  return readCustomerWishlist().includes(urlId);
}

export function setProductWishlisted(urlId: string, wished: boolean) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const currentWishlist = readCustomerWishlist();
  const nextWishlist = wished
    ? Array.from(new Set([...currentWishlist, urlId]))
    : currentWishlist.filter((entry) => entry !== urlId);

  storage.setItem(
    CUSTOMER_WISHLIST_STORAGE_KEY,
    JSON.stringify(nextWishlist),
  );
  notifyWishlistChanged();
}

export function clearCustomerWishlist() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(CUSTOMER_WISHLIST_STORAGE_KEY);
  notifyWishlistChanged();
}

export function subscribeToCustomerWishlist(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  function handleStorage(event: StorageEvent) {
    if (
      event.key !== null &&
      event.key !== CUSTOMER_WISHLIST_STORAGE_KEY
    ) {
      return;
    }

    callback();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CUSTOMER_WISHLIST_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CUSTOMER_WISHLIST_EVENT, callback);
  };
}
