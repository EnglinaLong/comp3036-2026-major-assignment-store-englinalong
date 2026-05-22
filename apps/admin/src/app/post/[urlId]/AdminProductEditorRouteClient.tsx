"use client";

import { useMemo } from "react";
import type { Post } from "@repo/db/data";
import { PostEditor } from "../../../components/PostEditor";

export function AdminProductEditorRouteClient({
  urlId,
  initialPosts,
}: {
  urlId: string;
  initialPosts: Post[];
}) {
  const matchedPost = useMemo(
    () => initialPosts.find((post) => post.urlId === urlId) ?? null,
    [initialPosts, urlId],
  );

  if (!matchedPost) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Product not found</h1>
      </main>
    );
  }

  return (
    <PostEditor
      postId={matchedPost.id}
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
        price: matchedPost.price,
        tags: matchedPost.tags,
      }}
    />
  );
}
