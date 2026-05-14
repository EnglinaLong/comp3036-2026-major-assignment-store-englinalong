import type { Post } from "@repo/db/data";

export function slugifyTitle(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function getProductHref(post: Pick<Post, "title" | "urlId">) {
  return `/product/${slugifyTitle(post.title)}`;
}
