import Link from "next/link";
import type { Post } from "@repo/db/data";
import { categories, categorySlug } from "@/functions/categories";
import { history } from "@/functions/history";
import { getProductHref } from "@/functions/productHref";
import { normalizeTag, tags } from "@/functions/tags";
import { SummaryItem } from "@/components/Menu/SummaryItem";
import ProductCard from "./ProductCard";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function StoreHomepage({ posts }: { posts: Post[] }) {
  const featuredProducts = posts.slice(0, 6);
  const categoryItems = categories(posts);
  const collectionItems = await tags(posts);
  const historyItems = history(posts);
  const spotlightItems = featuredProducts.slice(0, 3);

  return (
    <div className="space-y-14 pb-14">
      <section className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_35%,#fee2e2_100%)] px-6 py-10 shadow-[0_25px_80px_rgba(127,29,29,0.12)] ring-1 ring-black/5 sm:px-8 lg:px-10 lg:py-12 dark:bg-[linear-gradient(135deg,#1f2937_0%,#111827_45%,#3f1d2e_100%)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.35)] dark:ring-white/10">
        <div className="bg-[color:var(--color-wsu)]/10 absolute -right-24 top-12 h-64 w-64 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-600 dark:border-white/10 dark:bg-neutral-900/70 dark:text-neutral-300">
              Full Stack Store
            </span>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl dark:text-neutral-50">
                Discover products built for your next big idea
              </h1>
              <p className="max-w-2xl text-base leading-8 text-neutral-700 sm:text-lg dark:text-neutral-300">
                Shop curated products, browse by collection, and explore the
                latest arrivals in one polished storefront.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#featured-products"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-wsu)] px-6 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:bg-[color:var(--color-wsu-light)]"
              >
                Shop Products
              </a>
              <a
                href="#shop-by-category"
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white/80 px-6 py-3 font-medium text-neutral-900 transition hover:-translate-y-0.5 hover:border-neutral-400 hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-100 dark:hover:border-neutral-500 dark:hover:bg-neutral-900"
              >
                Browse Categories
              </a>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-1">
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-3">
              <div className="rounded-[24px] bg-white/85 p-5 shadow-sm ring-1 ring-black/5 dark:bg-neutral-900/80 dark:ring-white/10">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Available products
                </p>
                <p className="mt-2 text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
                  {posts.length}
                </p>
              </div>
              <div className="rounded-[24px] bg-white/85 p-5 shadow-sm ring-1 ring-black/5 dark:bg-neutral-900/80 dark:ring-white/10">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Categories
                </p>
                <p className="mt-2 text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
                  {categoryItems.length}
                </p>
              </div>
              <div className="rounded-[24px] bg-white/85 p-5 shadow-sm ring-1 ring-black/5 dark:bg-neutral-900/80 dark:ring-white/10">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Collections
                </p>
                <p className="mt-2 text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
                  {collectionItems.length}
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-900/70">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
                Store highlights
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                {spotlightItems.map((item) => (
                  <Link
                    key={item.id}
                    href={getProductHref(item)}
                    className="rounded-[20px] border border-black/5 bg-white/90 p-4 transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-neutral-950/90"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                      {item.category}
                    </p>
                    <p className="mt-2 line-clamp-2 text-base font-semibold text-neutral-950 dark:text-neutral-50">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="shop-by-category" className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
              Browse the store
            </p>
            <h2 className="text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
              Shop by Category
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            Find products faster with category shortcuts designed for a cleaner
            storefront browsing experience.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categoryItems.map((item) => (
            <Link
              key={item.name}
              href={`/category/${categorySlug(item.name)}`}
              className="hover:border-[color:var(--color-wsu)]/20 group rounded-[24px] border border-black/10 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)] dark:border-white/10 dark:bg-neutral-900 dark:shadow-[0_18px_40px_rgba(0,0,0,0.30)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                Category
              </p>
              <p className="mt-3 text-2xl font-semibold text-neutral-950 transition group-hover:text-[color:var(--color-wsu)] dark:text-neutral-50">
                {item.name}
              </p>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                {item.count} products available
              </p>
              <p className="mt-4 text-sm font-medium text-[color:var(--color-wsu)]">
                Shop category
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="collections"
        className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]"
      >
        <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
                Curated picks
              </p>
              <h2 className="text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
                Collections
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-300">
              Explore products by collection to find matching styles, themes,
              and curated picks.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {collectionItems.map((item) => (
              <Link
                key={item.name}
                href={`/tags/${normalizeTag(item.name)}`}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 transition hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-white hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
                title={`Collection / ${item.name}`}
              >
                <span>{item.name}</span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300">
                  {item.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-[linear-gradient(180deg,#ffffff_0%,#fafaf9_100%)] p-6 shadow-sm dark:border-white/10 dark:bg-[linear-gradient(180deg,#111827_0%,#0f172a_100%)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
            Latest arrivals
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
            New in Store
          </h2>
          <div className="mt-5 space-y-3">
            {historyItems.map((item) => {
              const label = `${months[item.month]}, ${item.year}`;

              return (
                <SummaryItem
                  key={`${item.year}-${item.month}`}
                  name={label}
                  count={item.count}
                  href={`/history/${item.year}/${item.month}`}
                  title={label}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section id="featured-products" className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
              Featured selection
            </p>
            <h2 className="text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
              Featured Products
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            A polished product grid for your storefront demo, featuring
            available items customers can explore right now.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {featuredProducts.map((post) => (
            <ProductCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default StoreHomepage;
