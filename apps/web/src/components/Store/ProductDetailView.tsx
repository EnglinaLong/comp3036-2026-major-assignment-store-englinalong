"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@repo/db/data";
import { useCart } from "@/components/Store/CartProvider";
import { getProductHref } from "@/functions/productHref";
import {
  getDefaultProductPrice,
  getProductPrice,
  getProductPriceSupportingText,
} from "@/functions/productPrice";
import {
  getProductViewsLabel,
  getWishlistSavesLabel,
} from "@/functions/productStats";
import {
  isProductWishlisted,
  setProductWishlisted,
} from "@/functions/customerWishlist";

export default function ProductDetailView({
  post,
  tags,
  relatedProducts,
  contentHtml,
  initialSaved,
}: {
  post: Post;
  tags: { label: string; href: string }[];
  relatedProducts: Post[];
  contentHtml: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [savedCount, setSavedCount] = useState(post.likes);
  const [cartAdded, setCartAdded] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { addToCart } = useCart();
  const displayPost = post;
  const displayRelatedProducts = relatedProducts;

  function handleSaveToggle() {
    setSaved((current) => {
      const next = !current;
      setSavedCount((count) => Math.max(0, count + (next ? 1 : -1)));
      setProductWishlisted(displayPost.urlId, next);
      return next;
    });
  }

  useEffect(() => {
    if (!cartAdded) return;

    const timeoutId = window.setTimeout(() => {
      setCartAdded(false);
    }, 1600);

    return () => window.clearTimeout(timeoutId);
  }, [cartAdded]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    setSavedCount(displayPost.likes);
  }, [displayPost.likes]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    setSaved(isProductWishlisted(displayPost.urlId));
  }, [displayPost.urlId, hydrated]);

  function handleAddToCart() {
    addToCart(displayPost);
    setCartAdded(true);
  }

  const productPrice = hydrated
    ? getProductPrice(displayPost)
    : getDefaultProductPrice(displayPost);

  if (!displayPost.active) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-dashed border-neutral-300 bg-white px-6 py-14 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-black/20">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
            Full Stack Store
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
            This product is currently unavailable.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-neutral-600 dark:text-neutral-300">
            Please browse other available products.
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

  return (
    <article
      data-testid={`product-detail-${displayPost.id}`}
      data-test-id={`product-detail-${displayPost.id}`}
      className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <a
          href="/#featured-products"
          className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
        >
          Back to Products
        </a>

        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
          <span>{getProductViewsLabel(displayPost.views)}</span>
          <span>{getWishlistSavesLabel(savedCount)}</span>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-neutral-900 dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <div className="relative">
            <Image
              src={displayPost.imageUrl}
              alt={displayPost.title}
              width={1400}
              height={1200}
              className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[540px]"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8 dark:border-white/10 dark:bg-neutral-900 dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              {displayPost.category}
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              Available Now
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl dark:text-neutral-50">
              {displayPost.title.replace(/!$/, "")}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-300">
              {displayPost.description}
            </p>
          </div>

          <div className="rounded-[24px] bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_100%)] p-5 ring-1 ring-black/5 dark:bg-[linear-gradient(135deg,#1f2937_0%,#111827_100%)] dark:ring-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
              Price
            </p>
            <p className="mt-2 text-4xl font-semibold text-neutral-950 dark:text-neutral-50">
              {productPrice}
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              {getProductPriceSupportingText(displayPost)}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
            >
              {cartAdded ? "Added to Cart" : "Add to Cart"}
            </button>

            <button
              type="button"
              data-testid="save-product-button"
              data-test-id="save-product-button"
              onClick={handleSaveToggle}
              aria-pressed={saved}
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 font-medium text-neutral-900 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
            >
              {saved ? "Saved to Wishlist" : "Save to Wishlist"}
            </button>
          </div>

          <div className="space-y-3 border-t border-neutral-100 pt-6 dark:border-neutral-800">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
              Collections
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-700 transition hover:border-neutral-300 hover:bg-white hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8 dark:border-white/10 dark:bg-neutral-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.30)]">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
            Product Details
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
            Product Overview
          </h2>
        </div>

        <div
          data-testid="content-markdown"
          data-test-id="content-markdown"
          className="prose prose-neutral dark:prose-invert mt-6 max-w-none leading-8"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </section>

      {displayRelatedProducts.length > 0 ? (
        <section className="space-y-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
              More to explore
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
              You may also like
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {displayRelatedProducts.map((relatedProduct) => {
              const productHref = getProductHref(relatedProduct);
              const relatedProductPrice = hydrated
                ? getProductPrice(relatedProduct)
                : getDefaultProductPrice(relatedProduct);

              return (
                <article
                  key={`related-product-${relatedProduct.urlId}`}
                  className="flex h-full flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-neutral-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.30)]"
                >
                  <Link href={productHref} className="block">
                    <div className="relative overflow-hidden">
                      <Image
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.title}
                        width={1200}
                        height={900}
                        className="h-52 w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                        {relatedProduct.category}
                      </span>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        Available Now
                      </span>
                    </div>

                    <div className="space-y-3">
                      <Link
                        href={productHref}
                        className="block text-xl font-semibold leading-tight text-neutral-950 transition hover:text-[color:var(--color-wsu)] dark:text-neutral-50"
                      >
                        {relatedProduct.title.replace(/!$/, "")}
                      </Link>
                      <p className="line-clamp-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                        {relatedProduct.description}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                          Price
                        </p>
                        <p className="mt-1 text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                          {relatedProductPrice}
                        </p>
                      </div>

                      <Link
                        href={productHref}
                        className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-4 py-2 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </article>
  );
}
