"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Post } from "@repo/db/data";
import { useCustomerAuth } from "./CustomerAuthProvider";
import {
  readCustomerWishlist,
  setProductWishlisted,
  subscribeToCustomerWishlist,
} from "@/functions/customerWishlist";
import { getProductHref } from "@/functions/productHref";
import { getProductPrice } from "@/functions/productPrice";
import { useMergedStorefrontPosts } from "@/functions/storefrontPosts";

export function WishlistClient({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const { customer, hasHydrated } = useCustomerAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const storefrontPosts = useMergedStorefrontPosts(initialPosts);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!customer) {
      router.replace("/account/login?returnTo=%2Faccount%2Fwishlist");
      return;
    }

    setWishlistIds(readCustomerWishlist());

    return subscribeToCustomerWishlist(() => {
      setWishlistIds(readCustomerWishlist());
    });
  }, [customer, hasHydrated, router]);

  const wishlistedProducts = useMemo(
    () =>
      wishlistIds
        .map((urlId) => storefrontPosts.find((post) => post.urlId === urlId))
        .filter((post): post is Post => Boolean(post)),
    [storefrontPosts, wishlistIds],
  );

  if (!hasHydrated || !customer) {
    return (
      <div className="rounded-[24px] border border-black/10 bg-neutral-50 p-5 text-center dark:border-white/10 dark:bg-neutral-900">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Loading your wishlist...
        </p>
      </div>
    );
  }

  if (wishlistedProducts.length === 0) {
    return (
      <div className="rounded-[24px] border border-black/10 bg-neutral-50 p-6 text-center dark:border-white/10 dark:bg-neutral-900">
        <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">
          No wishlist items yet
        </h2>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
          Saved products will appear here for quick access later.
        </p>
        <Link
          href="/#featured-products"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {wishlistedProducts.map((product) => (
        <section
          key={product.urlId}
          className="rounded-[24px] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-950"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
                Wishlist
              </p>
              <Link
                href={getProductHref(product)}
                className="block text-xl font-semibold text-neutral-950 transition hover:text-[color:var(--color-wsu)] dark:text-neutral-50"
              >
                {product.title}
              </Link>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {product.category}
              </p>
              {!product.active ? (
                <p className="text-sm text-amber-600 dark:text-amber-300">
                  This product is currently unavailable.
                </p>
              ) : null}
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                {getProductPrice(product)}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={getProductHref(product)}
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-5 py-3 font-medium text-white transition hover:bg-[color:var(--color-wsu-light)]"
            >
              View Product
            </Link>
            <button
              type="button"
              onClick={() => setProductWishlisted(product.urlId, false)}
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
            >
              Remove
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}
