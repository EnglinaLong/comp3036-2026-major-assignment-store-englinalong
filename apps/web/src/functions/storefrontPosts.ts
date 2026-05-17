import { useEffect, useMemo, useState } from "react";
import type { Post } from "@repo/db/data";
import {
  mergeLocalProducts,
  subscribeToLocalProductState,
} from "@repo/ui/local-product-state";

export function mergeStorefrontPosts(posts: Post[]) {
  return mergeLocalProducts(posts);
}

export function useMergedStorefrontPosts(posts: Post[]) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    setHasHydrated(true);

    return subscribeToLocalProductState(() => {
      setRevision((current) => current + 1);
    });
  }, []);

  return useMemo(() => {
    if (!hasHydrated) {
      return posts;
    }

    return mergeStorefrontPosts(posts);
  }, [hasHydrated, posts, revision]);
}
