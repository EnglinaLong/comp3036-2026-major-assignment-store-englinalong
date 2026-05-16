"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Post } from "@repo/db/data";
import { TopMenu } from "@/components/Layout/TopMenu";
import {
  matchesProductSearch,
  normalizeCategoryValue,
  normalizeSearchValue,
  splitNormalizedTags,
} from "@/functions/storefrontSearch";
import {
  readStorefrontUrlState,
  updateStorefrontUrlState,
  type StorefrontUrlState,
} from "@/functions/storefrontUrlState";
import { useMergedStorefrontPosts } from "@/functions/storefrontPosts";
import StoreHomepage from "./Homepage";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type FilterOption = { name: string; count: number };

function getHistoryKey(year: number, month: number) {
  return `${year}-${month}`;
}

function getHistoryLabel(year: number, month: number) {
  return `${months[month] ?? "Unknown"} ${year}`;
}

function buildCategoryItems(posts: Post[]) {
  const counts = new Map<string, FilterOption>();

  for (const post of posts) {
    const trimmedCategory = post.category.trim();

    if (!trimmedCategory) continue;

    const normalized = normalizeCategoryValue(trimmedCategory);
    const existing = counts.get(normalized);

    if (existing) {
      existing.count += 1;
    } else {
      counts.set(normalized, { name: trimmedCategory, count: 1 });
    }
  }

  return Array.from(counts.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function buildCollectionItems(posts: Post[]) {
  const counts = new Map<string, FilterOption>();

  for (const post of posts) {
    for (const tag of splitNormalizedTags(post.tags)) {
      const normalized = normalizeSearchValue(tag);
      const existing = counts.get(normalized);

      if (existing) {
        existing.count += 1;
      } else {
        counts.set(normalized, { name: tag, count: 1 });
      }
    }
  }

  return Array.from(counts.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function readWindowUrlState() {
  if (typeof window === "undefined") {
    return {
      searchQuery: "",
      selectedCategory: null,
      selectedCollection: null,
      selectedHistoryKey: null,
    } satisfies StorefrontUrlState;
  }

  return readStorefrontUrlState(new URLSearchParams(window.location.search));
}

export function HomepageClient({
  posts,
  categoryItems: _categoryItems,
  collectionItems: _collectionItems,
  historyItems: _historyItems,
}: {
  posts: Post[];
  categoryItems: { name: string; count: number }[];
  collectionItems: { name: string; count: number }[];
  historyItems: { year: number; month: number; count: number }[];
}) {
  const searchParams = useSearchParams();
  const initialUrlState = useMemo(
    () => readStorefrontUrlState(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );
  const [searchQuery, setSearchQuery] = useState(initialUrlState.searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialUrlState.selectedCategory,
  );
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    initialUrlState.selectedCollection,
  );
  const [selectedHistoryKey, setSelectedHistoryKey] = useState<string | null>(
    initialUrlState.selectedHistoryKey,
  );
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(
    initialUrlState.searchQuery,
  );
  const storefrontPosts = useMergedStorefrontPosts(posts);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  useEffect(() => {
    function handlePopState() {
      const nextUrlState = readWindowUrlState();
      setSearchQuery(nextUrlState.searchQuery);
      setDebouncedSearchQuery(nextUrlState.searchQuery);
      setSelectedCategory(nextUrlState.selectedCategory);
      setSelectedCollection(nextUrlState.selectedCollection);
      setSelectedHistoryKey(nextUrlState.selectedHistoryKey);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const activeProducts = useMemo(
    () => storefrontPosts.filter((post) => post.active),
    [storefrontPosts],
  );
  const categoryItems = useMemo(
    () => buildCategoryItems(activeProducts),
    [activeProducts],
  );
  const collectionItems = useMemo(
    () => buildCollectionItems(activeProducts),
    [activeProducts],
  );
  const historyItems = useMemo(() => {
    const counts = new Map<string, { year: number; month: number; count: number }>();

    for (const post of activeProducts) {
      const year = post.date.getFullYear();
      const month = post.date.getMonth() + 1;
      const key = getHistoryKey(year, month);
      const existing = counts.get(key);

      if (existing) {
        existing.count += 1;
      } else {
        counts.set(key, { year, month, count: 1 });
      }
    }

    return Array.from(counts.values()).sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [activeProducts]);
  const deferredSearchQuery = useDeferredValue(searchQuery.trim());
  const normalizedQuery = normalizeSearchValue(deferredSearchQuery);
  const sanitizedCategory = useMemo(() => {
    if (!selectedCategory) {
      return null;
    }

    return categoryItems.some(
      (item) => normalizeCategoryValue(item.name) === selectedCategory,
    )
      ? selectedCategory
      : null;
  }, [categoryItems, selectedCategory]);
  const sanitizedCollection = useMemo(() => {
    if (!selectedCollection) {
      return null;
    }

    return collectionItems.some(
      (item) => normalizeSearchValue(item.name) === selectedCollection,
    )
      ? selectedCollection
      : null;
  }, [collectionItems, selectedCollection]);
  const sanitizedHistoryKey = useMemo(() => {
    if (!selectedHistoryKey) {
      return null;
    }

    return historyItems.some(
      (item) => getHistoryKey(item.year, item.month) === selectedHistoryKey,
    )
      ? selectedHistoryKey
      : null;
  }, [historyItems, selectedHistoryKey]);

  const selectedCategoryLabel = useMemo(
    () =>
      categoryItems.find(
        (item) => normalizeCategoryValue(item.name) === sanitizedCategory,
      )?.name ?? null,
    [categoryItems, sanitizedCategory],
  );
  const selectedCollectionLabel = useMemo(
    () =>
      collectionItems.find(
        (item) => normalizeSearchValue(item.name) === sanitizedCollection,
      )?.name ?? null,
    [collectionItems, sanitizedCollection],
  );
  const selectedHistoryLabel = useMemo(() => {
    if (!sanitizedHistoryKey) {
      return null;
    }

    const [year, month] = sanitizedHistoryKey.split("-").map(Number);

    if (year === undefined || month === undefined) {
      return null;
    }

    return getHistoryLabel(year, month);
  }, [sanitizedHistoryKey]);

  const filteredPosts = useMemo(() => {
    return activeProducts.filter((post) => {
      const matchesSearch = normalizedQuery
        ? matchesProductSearch(post, normalizedQuery)
        : true;

      const matchesHistory = sanitizedHistoryKey
        ? getHistoryKey(post.date.getFullYear(), post.date.getMonth() + 1) ===
          sanitizedHistoryKey
        : true;

      const matchesCategory = sanitizedCategory
        ? normalizeCategoryValue(post.category) === sanitizedCategory
        : true;

      const matchesCollection = sanitizedCollection
        ? splitNormalizedTags(post.tags).some(
            (tag) => normalizeSearchValue(tag) === sanitizedCollection,
          )
        : true;

      return (
        matchesSearch &&
        matchesHistory &&
        matchesCategory &&
        matchesCollection
      );
    });
  }, [
    activeProducts,
    normalizedQuery,
    sanitizedCategory,
    sanitizedCollection,
    sanitizedHistoryKey,
  ]);

  useEffect(() => {
    const nextUrl = updateStorefrontUrlState(
      window.location.pathname,
      new URLSearchParams(window.location.search),
      {
        searchQuery: debouncedSearchQuery,
        selectedCategory: sanitizedCategory,
        selectedCollection: sanitizedCollection,
        selectedHistoryKey: sanitizedHistoryKey,
      },
    );

    const nextRelativeUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextUrl === nextRelativeUrl) {
      return;
    }

    window.history.replaceState(window.history.state, "", nextUrl);
  }, [
    debouncedSearchQuery,
    sanitizedCategory,
    sanitizedCollection,
    sanitizedHistoryKey,
  ]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-4 sm:px-6 lg:px-8">
      <div>
        <TopMenu searchValue={searchQuery} onSearchChange={setSearchQuery} />
      </div>

      <StoreHomepage
        posts={activeProducts}
        availableProductCount={activeProducts.length}
        filteredPosts={filteredPosts}
        searchQuery={deferredSearchQuery}
        selectedCategory={sanitizedCategory}
        selectedCategoryLabel={selectedCategoryLabel}
        selectedCollection={sanitizedCollection}
        selectedCollectionLabel={selectedCollectionLabel}
        selectedHistoryKey={sanitizedHistoryKey}
        selectedHistoryLabel={selectedHistoryLabel}
        onCategorySelect={(categoryName) => {
          const normalizedCategory = normalizeCategoryValue(categoryName);

          setSelectedCategory((current) =>
            current === normalizedCategory ? null : normalizedCategory,
          );
          setSelectedCollection(null);
          setSelectedHistoryKey(null);
        }}
        onCollectionSelect={(collectionName) => {
          const normalizedCollection = normalizeSearchValue(collectionName);

          setSelectedCategory(null);
          setSelectedCollection((current) =>
            current === normalizedCollection ? null : normalizedCollection,
          );
          setSelectedHistoryKey(null);
        }}
        onHistorySelect={(historyKey) => {
          setSelectedCategory(null);
          setSelectedCollection(null);
          setSelectedHistoryKey((current) =>
            current === historyKey ? null : historyKey,
          );
        }}
        onClearFilters={() => {
          setSelectedCategory(null);
          setSelectedCollection(null);
          setSelectedHistoryKey(null);
        }}
        categoryItems={categoryItems}
        collectionItems={collectionItems}
        historyItems={historyItems}
      />
    </div>
  );
}

export default HomepageClient;
