import type { Post } from "@repo/db/data";

const POST_OVERRIDES_STORAGE_KEY = "admin-post-overrides";
const CREATED_POSTS_STORAGE_KEY = "admin-created-posts";

function normalizeStoredPost(post: Post) {
  return {
    ...post,
    date: new Date(post.date),
  };
}

export function mergeStorefrontPosts(posts: Post[]) {
  if (typeof window === "undefined") {
    return posts;
  }

  const storedCreatedPosts = window.localStorage.getItem(
    CREATED_POSTS_STORAGE_KEY,
  );
  const storedPostOverrides = window.localStorage.getItem(
    POST_OVERRIDES_STORAGE_KEY,
  );

  try {
    const postOverrides = storedPostOverrides
      ? (JSON.parse(storedPostOverrides) as Record<string, Partial<Post>>)
      : {};
    const createdPosts = storedCreatedPosts
      ? (JSON.parse(storedCreatedPosts) as Post[]).map(normalizeStoredPost)
      : [];

    const mergedPosts = [
      ...createdPosts.filter(
        (createdPost) =>
          !posts.some((post) => post.urlId === createdPost.urlId),
      ),
      ...posts,
    ];

    return mergedPosts.map((post) => {
      const override = postOverrides[post.urlId];
      const overrideDate = override?.date;

      return {
        ...post,
        ...override,
        active: override?.active ?? post.active,
        date: overrideDate ? new Date(overrideDate) : new Date(post.date),
      };
    });
  } catch {
    window.localStorage.removeItem(CREATED_POSTS_STORAGE_KEY);
    window.localStorage.removeItem(POST_OVERRIDES_STORAGE_KEY);
    return posts;
  }
}
