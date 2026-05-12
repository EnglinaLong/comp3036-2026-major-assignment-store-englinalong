"use client";

import { useMemo, useState } from "react";
import type { Post } from "@repo/db/data";
import { TopMenu } from "@/components/Layout/TopMenu";
import { getStorefrontProduct } from "@/functions/storefrontProduct";
import StoreHomepage from "./Homepage";

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
  const normalizedQuery = normalizeSearchValue(searchQuery);
  const storefrontPosts = useMemo(
    () => posts.map((post) => getStorefrontProduct(post)),
    [posts],
  );

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) {
      return storefrontPosts;
    }

    return storefrontPosts.filter((post) =>
      createProductSearchText(post).includes(normalizedQuery),
    );
  }, [normalizedQuery, storefrontPosts]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-4 sm:px-6 lg:px-8">
      <div>
        <TopMenu searchValue={searchQuery} onSearchChange={setSearchQuery} />
      </div>

      <StoreHomepage
        posts={storefrontPosts}
        filteredPosts={filteredPosts}
        searchQuery={searchQuery}
        categoryItems={categoryItems}
        collectionItems={collectionItems}
        historyItems={historyItems}
      />
    </div>
  );
}

export default HomepageClient;
