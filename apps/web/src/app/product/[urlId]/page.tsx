import { headers } from "next/headers";
import Link from "next/link";
import { marked } from "marked";
import { TopMenu } from "@/components/Layout/TopMenu";
import ProductDetailView from "@/components/Store/ProductDetailView";
import {
  getPosts,
  getRequestIp,
  hasLikedPost,
  incrementPostViews,
} from "@/app/posts";
import { slugifyTitle } from "@/functions/productHref";
import { getStorefrontCollectionHref } from "@/functions/storefrontNavigation";
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

function matchesProductRoute(post: Pick<Post, "title" | "urlId">, urlId: string) {
  return post.urlId === urlId || slugifyTitle(post.title) === urlId;
}

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const decodedUrlId = decodeURIComponent(urlId);
  const requestHeaders = await headers();
  const post = await incrementPostViews(decodedUrlId);

  if (!post) {
    const matchingInactiveProduct = (await getPosts()).find(
      (candidate) =>
        matchesProductRoute(candidate, decodedUrlId) && candidate.active === false,
    );

    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_24%,#f7f7f7_100%)] dark:bg-[linear-gradient(180deg,#0f172a_0%,#111827_38%,#020617_100%)]">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <TopMenu />
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-dashed border-neutral-300 bg-white px-6 py-14 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-black/20">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
              Full Stack Store
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
              {matchingInactiveProduct
                ? "This product is currently unavailable."
                : "Product not found"}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-neutral-600 dark:text-neutral-300">
              {matchingInactiveProduct
                ? "This product has been hidden from the storefront for now. Browse other available products in the store."
                : "This product is unavailable right now or no longer exists."}
            </p>
            <div className="mt-6">
              <Link
                href="/#featured-products"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const initialLiked = await hasLikedPost(
    post.id,
    getRequestIp(requestHeaders),
  );
  const activeProducts = await getPosts({
    active: true,
  });
  const relatedProducts = getRelatedProducts(activeProducts, post);
  const contentHtml = await marked.parse(post.content);
  const tags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => ({
      label: tag,
      href: getStorefrontCollectionHref(tag),
    }));

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_24%,#f7f7f7_100%)] dark:bg-[linear-gradient(180deg,#0f172a_0%,#111827_38%,#020617_100%)]">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <TopMenu />
      </div>

      <ProductDetailView
        post={post}
        tags={tags}
        relatedProducts={relatedProducts}
        contentHtml={contentHtml}
        initialSaved={initialLiked}
      />
    </div>
  );
}
