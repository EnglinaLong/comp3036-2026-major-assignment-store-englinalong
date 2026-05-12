import { headers } from "next/headers";
import { marked } from "marked";
import { TopMenu } from "@/components/Layout/TopMenu";
import ProductDetailView from "@/components/Store/ProductDetailView";
import {
  getPosts,
  getRequestIp,
  hasLikedPost,
  incrementPostViews,
} from "@/app/posts";
import { getStorefrontProduct } from "@/functions/storefrontProduct";
import { normalizeTag } from "@/functions/tags";
import type { Post } from "@repo/db/data";

function getNormalizedTags(value: string) {
  return value
    .split(",")
    .map((tag) => normalizeTag(tag))
    .filter(Boolean);
}

function getRelatedProducts(products: Post[], currentProduct: Post) {
  const currentTags = new Set(getNormalizedTags(currentProduct.tags));

  const rankedMatches = products
    .filter((product) => product.id !== currentProduct.id)
    .map((product) => {
      const productTags = getNormalizedTags(product.tags);
      const sharedTags = productTags.filter((tag) =>
        currentTags.has(tag),
      ).length;
      const sameCategory = product.category === currentProduct.category ? 1 : 0;
      const score = sameCategory * 3 + sharedTags * 2;

      return { product, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.product.id - b.product.id;
    });

  const matched = rankedMatches
    .filter((item) => item.score > 0)
    .map((item) => item.product);
  const fallback = rankedMatches
    .filter((item) => item.score === 0)
    .map((item) => item.product);

  return [...matched, ...fallback].slice(0, 3);
}

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const requestHeaders = await headers();
  const post = await incrementPostViews(decodeURIComponent(urlId));

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
          Full Stack Store
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-neutral-950">
          Product not found
        </h1>
        <p className="mt-3 text-neutral-600">
          This product is unavailable right now or no longer exists.
        </p>
      </div>
    );
  }

  const initialLiked = await hasLikedPost(
    post.id,
    getRequestIp(requestHeaders),
  );
  const storefrontPost = getStorefrontProduct(post);
  const activeProducts = await getPosts({
    active: true,
  });
  const relatedProducts = getRelatedProducts(activeProducts, post).map((item) =>
    getStorefrontProduct(item),
  );
  const contentHtml = await marked.parse(storefrontPost.content);
  const tags = storefrontPost.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => ({
      label: tag,
      href: `/tags/${normalizeTag(tag)}`,
    }));

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_24%,#f7f7f7_100%)] dark:bg-[linear-gradient(180deg,#0f172a_0%,#111827_38%,#020617_100%)]">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <TopMenu />
      </div>

      <ProductDetailView
        post={storefrontPost}
        tags={tags}
        relatedProducts={relatedProducts}
        contentHtml={contentHtml}
        initialSaved={initialLiked}
      />
    </div>
  );
}
