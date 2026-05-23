import { useEffect, useState } from "react";
import type { Post } from "@repo/db/data";
import {
  mergeLocalProducts,
  subscribeToLocalProductState,
} from "@repo/ui/local-product-state";

function dedupeStorefrontPosts(posts: Post[]) {
  const uniquePosts = new Map<string, Post>();

  for (const post of posts) {
    uniquePosts.set(post.urlId, post);
  }

  return Array.from(uniquePosts.values());
}

export function mergeStorefrontPosts(posts: Post[], includeLocal: boolean = true) {
  if (includeLocal) {
    return dedupeStorefrontPosts(mergeLocalProducts(posts));
  }
  // Without local products, just normalize dates from posts
  return dedupeStorefrontPosts(posts).map((post) => ({
    ...post,
    date: new Date(post.date),
  }));
}

function postsAreEqual(a: Post[], b: Post[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const aPost = a[i];
    const bPost = b[i];
    if (!aPost || !bPost) return false;
    if (aPost.id !== bPost.id) return false;
    if (aPost.urlId !== bPost.urlId) return false;
    if (aPost.title !== bPost.title) return false;
    if (aPost.content !== bPost.content) return false;
    if (aPost.description !== bPost.description) return false;
    if (aPost.imageUrl !== bPost.imageUrl) return false;
    if (aPost.category !== bPost.category) return false;
    if (aPost.views !== bPost.views) return false;
    if (aPost.likes !== bPost.likes) return false;
    if (aPost.tags !== bPost.tags) return false;
    if (aPost.active !== bPost.active) return false;
    if (aPost.price !== bPost.price) return false;
    if (aPost.supportingText !== bPost.supportingText) return false;
    if (new Date(aPost.date).getTime() !== new Date(bPost.date).getTime()) {
      return false;
    }
  }
  return true;
}

export function useMergedStorefrontPosts(posts: Post[]) {
  const [mergedPosts, setMergedPosts] = useState(() =>
    mergeStorefrontPosts(posts, false),
  );
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    function syncMergedPosts(includeLocal: boolean) {
      const nextPosts = mergeStorefrontPosts(posts, includeLocal);

      setMergedPosts((currentPosts) =>
        postsAreEqual(currentPosts, nextPosts) ? currentPosts : nextPosts,
      );
    }

    syncMergedPosts(hasMounted);

    if (!hasMounted) {
      return;
    }

    return subscribeToLocalProductState(() => {
      syncMergedPosts(true);
    });
  }, [hasMounted, posts]);

  return mergedPosts;
}
