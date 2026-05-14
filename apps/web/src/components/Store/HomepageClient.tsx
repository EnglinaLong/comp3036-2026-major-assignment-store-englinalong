"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Post } from "@repo/db/data";
import { TopMenu } from "@/components/Layout/TopMenu";
import { mergeStorefrontPosts } from "@/functions/storefrontPosts";
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

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

function normalizeCategoryValue(value: string) {
  return value.trim().toLowerCase();
}

function splitNormalizedTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function createProductSearchText(post: Post) {
  const normalizedTags = post.tags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .join(" ");

  return [
    post.title,
    post.category,
    post.description,
    post.content,
    post.tags,
    normalizedTags,
  ]
    .join(" ")
    .toLowerCase();
}

function getHistoryKey(year: number, month: number) {
  return `${year}-${month}`;
}

function getHistoryLabel(year: number, month: number) {
  return `${months[month] ?? "Unknown"} ${year}`;
}

function replaceCollectionQuery(collectionName: string | null) {
  const url = new URL(window.location.href);

  if (collectionName) {
    url.searchParams.set("collection", collectionName);
    url.hash = "featured-products";
  } else {
    url.searchParams.delete("collection");
  }

  window.history.replaceState({}, "", url.toString());
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [selectedHistoryKey, setSelectedHistoryKey] = useState<string | null>(
    null,
  );
  const [storefrontPosts, setStorefrontPosts] = useState(posts);

  useEffect(() => {
    setStorefrontPosts(mergeStorefrontPosts(posts));
  }, [posts]);

  const activeProducts = useMemo(
    () => storefrontPosts.filter((post) => post.active),
    [storefrontPosts],
  );
  const normalizedQuery = normalizeSearchValue(searchQuery);
  const collectionQuery = useMemo(() => {
    const value = searchParams.get("collection");

    if (!value) {
      return null;
    }

    const normalized = normalizeSearchValue(value);
    return normalized || null;
  }, [searchParams]);
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

  useEffect(() => {
    setSelectedCollection(collectionQuery);

    if (collectionQuery !== null) {
      setSelectedCategory(null);
      setSelectedHistoryKey(null);
    }
  }, [collectionQuery]);

  const selectedCategoryLabel = useMemo(
    () =>
      categoryItems.find(
        (item) => normalizeCategoryValue(item.name) === selectedCategory,
      )?.name ?? null,
    [categoryItems, selectedCategory],
  );

  const selectedCollectionLabel = useMemo(
    () =>
      collectionItems.find(
        (item) => normalizeSearchValue(item.name) === selectedCollection,
      )?.name ?? null,
    [collectionItems, selectedCollection],
  );

  const filteredPosts = useMemo(() => {
    return activeProducts.filter((post) => {
      const matchesSearch = normalizedQuery
        ? createProductSearchText(post).includes(normalizedQuery)
        : true;

      const matchesHistory = selectedHistoryKey
        ? getHistoryKey(post.date.getFullYear(), post.date.getMonth() + 1) ===
          selectedHistoryKey
        : true;

      const matchesCategory = selectedCategory
        ? normalizeCategoryValue(post.category) === selectedCategory
        : true;

      const matchesCollection = selectedCollection
        ? splitNormalizedTags(post.tags).some(
            (tag) => normalizeSearchValue(tag) === selectedCollection,
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
    selectedCategory,
    selectedCollection,
    selectedHistoryKey,
  ]);

  const selectedHistoryLabel = useMemo(() => {
    if (!selectedHistoryKey) {
      return null;
    }

    const [year, month] = selectedHistoryKey.split("-").map(Number);

    if (year === undefined || month === undefined) {
      return null;
    }

    return getHistoryLabel(year, month);
  }, [selectedHistoryKey]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-4 sm:px-6 lg:px-8">
      <div>
        <TopMenu searchValue={searchQuery} onSearchChange={setSearchQuery} />
      </div>

      <StoreHomepage
        posts={activeProducts}
        filteredPosts={filteredPosts}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedCategoryLabel={selectedCategoryLabel}
        selectedCollection={selectedCollection}
        selectedCollectionLabel={selectedCollectionLabel}
        selectedHistoryKey={selectedHistoryKey}
        selectedHistoryLabel={selectedHistoryLabel}
        onCategorySelect={(categoryName) => {
          const normalizedCategory = normalizeCategoryValue(categoryName);

          setSelectedCategory((current) =>
            current === normalizedCategory ? null : normalizedCategory,
          );
          setSelectedCollection(null);
          setSelectedHistoryKey(null);
          replaceCollectionQuery(null);
        }}
        onCollectionSelect={(collectionName) => {
          const normalizedCollection = normalizeSearchValue(collectionName);
          const nextCollection =
            selectedCollection === normalizedCollection
              ? null
              : normalizedCollection;

          setSelectedCollection(nextCollection);
          setSelectedCategory(null);
          setSelectedHistoryKey(null);
          replaceCollectionQuery(nextCollection);
        }}
        onHistorySelect={(historyKey) => {
          setSelectedHistoryKey((current) =>
            current === historyKey ? null : historyKey,
          );
          setSelectedCategory(null);
          setSelectedCollection(null);
          replaceCollectionQuery(null);
        }}
        onClearFilters={() => {
          setSelectedCategory(null);
          setSelectedCollection(null);
          setSelectedHistoryKey(null);
          replaceCollectionQuery(null);
        }}
        categoryItems={categoryItems}
        collectionItems={collectionItems}
        historyItems={historyItems}
      />
    </div>
  );
}

export default HomepageClient;
