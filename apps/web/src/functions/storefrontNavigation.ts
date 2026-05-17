export function getStorefrontCategoryHref() {
  return "/#featured-products";
}

export function getStorefrontCollectionHref(collectionName?: string) {
  if (!collectionName?.trim()) {
    return "/#collections";
  }

  return `/?collection=${encodeURIComponent(
    collectionName.trim().toLowerCase().replace(/\s+/g, "-"),
  )}#featured-products`;
}

export function getStorefrontHistoryHref() {
  return "/#featured-products";
}
