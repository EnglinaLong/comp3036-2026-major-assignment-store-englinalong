"use client";
import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import type { Post } from "@repo/db/data";
import ProductDetailView from "@/components/Store/ProductDetailView";
import { slugifyTitle } from "@/functions/productHref";
import { getStorefrontCollectionHref } from "@/functions/storefrontNavigation";
import { useMergedStorefrontPosts } from "@/functions/storefrontPosts";

function matchesProductRoute(post: Pick<Post, "title" | "urlId">, urlId: string) {
  return post.urlId === urlId || slugifyTitle(post.title) === urlId;
}

function mergeProductByIdentity(baseProduct: Post, products: Post[]) {
  const mergedProduct =
    products.find((product) => product.urlId === baseProduct.urlId) ??
    products.find((product) => product.id === baseProduct.id);

  if (!mergedProduct) {
    return baseProduct;
  }

  return {
    ...mergedProduct,
    id: baseProduct.id,
    urlId: baseProduct.urlId,
  };
}

function ProductUnavailableState({
  unavailable,
}: {
  unavailable: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-dashed border-neutral-300 bg-white px-6 py-14 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-black/20">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
          Full Stack Store
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
          {unavailable ? "This product is currently unavailable." : "Product not found"}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-neutral-600 dark:text-neutral-300">
          {unavailable
            ? "Please browse other available products."
            : "This product is unavailable right now or no longer exists."}
        </p>
        <div className="mt-6">
          <a
            href="/#featured-products"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
          >
            Back to Products
          </a>
        </div>
      </div>
    </div>
  );
}

export function ProductRouteClient({
  urlId,
  initialPost,
  initialProducts,
  initialSaved,
}: {
  urlId: string;
  initialPost: Post | null;
  initialProducts: Post[];
  initialSaved: boolean;
}) {
  const [hydrated, setHydrated] = useState(false);
  const mergedProducts = useMergedStorefrontPosts(initialProducts);
  const serverProduct = useMemo(() => {
    if (initialPost && matchesProductRoute(initialPost, urlId)) {
      return initialPost;
    }

    return (
      initialProducts.find((product) => matchesProductRoute(product, urlId)) ?? null
    );
  }, [initialPost, initialProducts, urlId]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const matchedProduct = useMemo(() => {
    if (serverProduct) {
      return hydrated
        ? mergeProductByIdentity(serverProduct, mergedProducts)
        : serverProduct;
    }

    if (!hydrated) {
      return null;
    }

    return mergedProducts.find((product) => matchesProductRoute(product, urlId)) ?? null;
  }, [hydrated, mergedProducts, serverProduct, urlId]);

  if (!matchedProduct) {
    return <ProductUnavailableState unavailable={false} />;
  }

  if (!matchedProduct.active) {
    return <ProductUnavailableState unavailable />;
  }

  const contentHtml = marked.parse(matchedProduct.content) as string;
  const tags = matchedProduct.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => ({
      label: tag,
      href: getStorefrontCollectionHref(tag),
    }));

  return (
    <ProductDetailView
      post={matchedProduct}
      tags={tags}
      contentHtml={contentHtml}
      initialSaved={serverProduct?.urlId === matchedProduct.urlId ? initialSaved : false}
    />
  );
}
