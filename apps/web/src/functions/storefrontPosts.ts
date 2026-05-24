import { useMemo } from "react";
import type { Post } from "@repo/db/data";

function dedupeStorefrontPosts(posts: Post[]) {
  const uniquePosts = new Map<string, Post>();

  for (const post of posts) {
    uniquePosts.set(post.urlId, post);
  }

  return Array.from(uniquePosts.values());
}

export function mergeStorefrontPosts(posts: Post[], includeLocal: boolean = true) {
  void includeLocal;
  // Without local products, just normalize dates from posts
  return dedupeStorefrontPosts(posts).map((post) => ({
    ...post,
    date: new Date(post.date),
  }));
}

export function useMergedStorefrontPosts(posts: Post[]) {
  return useMemo(
    () => mergeStorefrontPosts(posts, false),
    [posts],
  );
}
