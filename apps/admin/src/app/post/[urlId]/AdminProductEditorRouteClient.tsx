"use client";

import { useEffect, useMemo, useState } from "react";
import type { Post } from "@repo/db/data";
import {
  mergeLocalProducts,
  subscribeToLocalProductState,
} from "@repo/ui/local-product-state";
import { PostEditor } from "../../../components/PostEditor";

export function AdminProductEditorRouteClient({
  urlId,
  initialPosts,
}: {
  urlId: string;
  initialPosts: Post[];
}) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    setHasHydrated(true);

    return subscribeToLocalProductState(() => {
      setRevision((current) => current + 1);
    });
  }, []);

  const mergedPosts = useMemo(() => {
    if (!hasHydrated) {
      return initialPosts;
    }

    return mergeLocalProducts(initialPosts);
  }, [hasHydrated, initialPosts, revision]);

  const matchedPost = useMemo(
    () => mergedPosts.find((post) => post.urlId === urlId) ?? null,
    [mergedPosts, urlId],
  );

  if (!matchedPost) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Product not found</h1>
      </main>
    );
  }

  const isLocalOnly = !initialPosts.some(
    (post) => post.id === matchedPost.id || post.urlId === matchedPost.urlId,
  );

  return (
    <PostEditor
      postId={matchedPost.id}
      isLocalOnly={isLocalOnly}
      initialPost={{
        urlId: matchedPost.urlId,
        title: matchedPost.title,
        category: matchedPost.category,
        description: matchedPost.description,
        content: matchedPost.content,
        imageUrl: matchedPost.imageUrl,
        date: matchedPost.date,
        views: matchedPost.views,
        likes: matchedPost.likes,
        active: matchedPost.active,
        tags: matchedPost.tags,
      }}
    />
  );
}
