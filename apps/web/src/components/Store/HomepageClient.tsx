"use client";

import { useMemo, useState } from "react";
import type { Post } from "@repo/db/data";
import { TopMenu } from "@/components/Layout/TopMenu";
import { getStorefrontProduct } from "@/functions/storefrontProduct";
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

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
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
  return `${months[month]} ${year}`;
}

export function HomepageClient({
  posts,
  categoryItems,
  collectionItems,
  historyItems,
}: {
  posts: Post[];
  categoryItems: { name: string; count: number }[];
  collectionItems: { name: string; count: number }[];
  historyItems: { year: number; month: number; count: number }[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHistoryKey, setSelectedHistoryKey] = useState<string | null>(
    null,
  );
  const normalizedQuery = normalizeSearchValue(searchQuery);
  const storefrontPosts = useMemo(
    () => posts.map((post) => getStorefrontProduct(post)),
    [posts],
  );

  const filteredPosts = useMemo(() => {
    return storefrontPosts.filter((post) => {
      const matchesSearch = normalizedQuery
        ? createProductSearchText(post).includes(normalizedQuery)
        : true;

      const matchesHistory = selectedHistoryKey
        ? getHistoryKey(post.date.getFullYear(), post.date.getMonth() + 1) ===
          selectedHistoryKey
        : true;

      return matchesSearch && matchesHistory;
    });
  }, [normalizedQuery, selectedHistoryKey, storefrontPosts]);

  const selectedHistoryLabel = useMemo(() => {
    if (!selectedHistoryKey) {
      return null;
    }

    const [year, month] = selectedHistoryKey.split("-").map(Number);
    return getHistoryLabel(year, month);
  }, [selectedHistoryKey]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-4 sm:px-6 lg:px-8">
      <div>
        <TopMenu searchValue={searchQuery} onSearchChange={setSearchQuery} />
      </div>

      <StoreHomepage
        posts={storefrontPosts}
        filteredPosts={filteredPosts}
        searchQuery={searchQuery}
        selectedHistoryKey={selectedHistoryKey}
        selectedHistoryLabel={selectedHistoryLabel}
        onHistorySelect={(historyKey) =>
          setSelectedHistoryKey((current) =>
            current === historyKey ? null : historyKey,
          )
        }
        categoryItems={categoryItems}
        collectionItems={collectionItems}
        historyItems={historyItems}
      />
    </div>
  );
}

export default HomepageClient;
