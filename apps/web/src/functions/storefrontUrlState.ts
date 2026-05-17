import { normalizeCategoryValue, normalizeSearchValue } from "./storefrontSearch";

export const FEATURED_PRODUCTS_HASH = "featured-products";

export type StorefrontUrlState = {
  searchQuery: string;
  selectedCategory: string | null;
  selectedCollection: string | null;
  selectedHistoryKey: string | null;
};

function cleanQueryValue(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

function encodeCollectionValue(value: string) {
  return value.trim().replace(/\s+/g, "-").toLowerCase();
}

function decodeCollectionValue(value: string) {
  return value.replace(/-/g, " ");
}

export function readStorefrontUrlState(searchParams: URLSearchParams) {
  return {
    searchQuery: cleanQueryValue(searchParams.get("q")) ?? "",
    selectedCategory:
      cleanQueryValue(searchParams.get("category"))?.toLowerCase() ?? null,
    selectedCollection:
      cleanQueryValue(searchParams.get("collection"))
        ? normalizeSearchValue(
            decodeCollectionValue(searchParams.get("collection") ?? ""),
          )
        : null,
    selectedHistoryKey: cleanQueryValue(searchParams.get("history")) ?? null,
  } satisfies StorefrontUrlState;
}

export function updateStorefrontUrlState(
  pathname: string,
  searchParams: URLSearchParams,
  nextState: Partial<StorefrontUrlState>,
) {
  const nextParams = new URLSearchParams(searchParams.toString());
  const currentState = readStorefrontUrlState(searchParams);
  const resolvedState: StorefrontUrlState = {
    ...currentState,
    ...nextState,
  };

  if (resolvedState.searchQuery) {
    nextParams.set("q", resolvedState.searchQuery);
  } else {
    nextParams.delete("q");
  }

  if (resolvedState.selectedCategory) {
    nextParams.set(
      "category",
      normalizeCategoryValue(resolvedState.selectedCategory),
    );
  } else {
    nextParams.delete("category");
  }

  if (resolvedState.selectedCollection) {
    nextParams.set(
      "collection",
      encodeCollectionValue(resolvedState.selectedCollection),
    );
  } else {
    nextParams.delete("collection");
  }

  if (resolvedState.selectedHistoryKey) {
    nextParams.set("history", resolvedState.selectedHistoryKey);
  } else {
    nextParams.delete("history");
  }

  const queryString = nextParams.toString();
  const hasActiveState = queryString.length > 0;

  return `${pathname}${queryString ? `?${queryString}` : ""}${
    hasActiveState ? `#${FEATURED_PRODUCTS_HASH}` : ""
  }`;
}
