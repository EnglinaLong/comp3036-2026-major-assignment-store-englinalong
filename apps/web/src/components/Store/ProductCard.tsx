import type { Post } from "@repo/db/data";
import Link from "next/link";
import Image from "next/image";
import { getProductHref } from "@/functions/productHref";
import {
  getProductViewsLabel,
  getWishlistSavesLabel,
} from "@/functions/productStats";
import {
  getStorefrontCategoryHref,
  getStorefrontCollectionHref,
} from "@/functions/storefrontNavigation";

export function ProductCard({ post }: { post: Post }) {
  const productHref = getProductHref(post);
  const collectionTags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-neutral-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.30)]"
      data-testid={`blog-post-${post.id}`}
      data-test-id={`blog-post-${post.id}`}
    >
      <Link href={productHref} className="block">
        <div className="relative overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={1200}
            height={900}
            className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
          <Link
            href={getStorefrontCategoryHref()}
            className="rounded-full bg-neutral-100 px-3 py-1 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          >
            {post.category}
          </Link>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
            Available now
          </span>
        </div>

        <div className="space-y-3">
          <Link
            href={productHref}
            className="block text-2xl font-semibold leading-tight text-neutral-950 transition hover:text-[color:var(--color-wsu)] dark:text-neutral-50"
          >
            {post.title.replace(/!$/, "")}
          </Link>
          <p className="line-clamp-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            {post.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {collectionTags.map((tag) => (
            <Link
              key={tag}
              href={getStorefrontCollectionHref(tag)}
              className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-600 transition hover:border-neutral-300 hover:bg-white hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
            >
              {tag}
            </Link>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{getProductViewsLabel(post.views)}</span>
            <span>{getWishlistSavesLabel(post.likes)}</span>
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
}

export default ProductCard;
