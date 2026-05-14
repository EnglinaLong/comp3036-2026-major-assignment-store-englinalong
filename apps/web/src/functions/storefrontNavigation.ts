export function getStorefrontCategoryHref() {
  return "/#featured-products";
}

export function getStorefrontCollectionHref(collectionName?: string) {
  if (!collectionName?.trim()) {
    return "/#collections";
  }

  return `/?collection=${encodeURIComponent(collectionName.trim())}#featured-products`;
}

export function getStorefrontHistoryHref() {
  return "/#featured-products";
}
