import type { Post } from "@repo/db/data";
import { mergeLocalProducts } from "@repo/ui/local-product-state";

export function mergeStorefrontPosts(posts: Post[]) {
  return mergeLocalProducts(posts);
}
