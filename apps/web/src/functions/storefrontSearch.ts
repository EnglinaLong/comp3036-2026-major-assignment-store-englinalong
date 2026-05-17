import type { Post } from "@repo/db/data";

export function normalizeSearchValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function compactSearchValue(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function normalizeCategoryValue(value: string) {
  return value.trim().toLowerCase();
}

export function splitNormalizedTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function createProductSearchText(post: Post) {
  const searchableFields = [
    post.title,
    post.description,
    post.content,
    post.category,
    post.tags,
    ...splitNormalizedTags(post.tags),
  ];

  const normalizedFields = searchableFields
    .map(normalizeSearchValue)
    .filter(Boolean);
  const compactFields = searchableFields.map(compactSearchValue).filter(Boolean);

  return [...normalizedFields, ...compactFields].join(" ");
}

export function matchesProductSearch(post: Post, query: string) {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return true;
  }

  return createProductSearchText(post).includes(normalizedQuery);
}

export function filterProductsBySearch(posts: Post[], query: string) {
  return posts.filter((post) => matchesProductSearch(post, query));
}
