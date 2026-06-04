"use client";

import type { Post } from "@repo/db/data";
import {
  normalizeCategoryValue,
  normalizeSearchValue,
} from "@/functions/storefrontSearch";
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

export function StoreHomepage({
  availableProductCount,
  filteredPosts,
  searchQuery,
  selectedCategory,
  selectedCategoryLabel,
  selectedCollection,
  selectedCollectionLabel,
  selectedHistoryKey,
  selectedHistoryLabel,
  onCategorySelect,
  onCollectionSelect,
  onHistorySelect,
  onClearFilters,
  categoryItems,
  collectionItems,
  historyItems,
}: {
  availableProductCount: number;
  filteredPosts: Post[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedCategoryLabel: string | null;
  selectedCollection: string | null;
  selectedCollectionLabel: string | null;
  selectedHistoryKey: string | null;
  selectedHistoryLabel: string | null;
  onCategorySelect: (categoryName: string) => void;
  onCollectionSelect: (collectionName: string) => void;
  onHistorySelect: (historyKey: string) => void;
  onClearFilters: () => void;
  categoryItems: { name: string; count: number }[];
  collectionItems: { name: string; count: number }[];
  historyItems: { year: number; month: number; count: number }[];
}) {
  const featuredProducts = filteredPosts;
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasCategoryFilter = Boolean(selectedCategoryLabel);
  const hasCollectionFilter = Boolean(selectedCollectionLabel);
  const hasHistoryFilter = Boolean(selectedHistoryLabel);
  const visibleProductCount = filteredPosts.length;

  const filterStatusText = hasSearchQuery
    ? `Showing results for: ${searchQuery.trim()}`
    : hasCategoryFilter
      ? `Showing ${selectedCategoryLabel} products`
      : hasCollectionFilter
        ? `Showing products tagged: ${selectedCollectionLabel}`
        : hasHistoryFilter
          ? `Showing products from ${selectedHistoryLabel}`
          : "Showing all products";

  const productCountLabel = `${visibleProductCount} ${
    visibleProductCount === 1 ? "product" : "products"
  }`;
  const categoryCountText = `Showing ${visibleProductCount} ${
    selectedCategoryLabel ?? ""
  } ${visibleProductCount === 1 ? "product" : "products"}`;
  const collectionCountText = `Showing ${visibleProductCount} ${
    visibleProductCount === 1 ? "product" : "products"
  } tagged: ${selectedCollectionLabel ?? ""}`;
  const historyCountText = `Showing ${productCountLabel} from ${selectedHistoryLabel}`;
  const featuredCountText = hasCategoryFilter
    ? `${categoryCountText}${hasSearchQuery ? ` for "${searchQuery.trim()}"` : ""}`
    : hasCollectionFilter
      ? `${collectionCountText}${hasSearchQuery ? ` for "${searchQuery.trim()}"` : ""}`
      : hasHistoryFilter
      ? `${historyCountText}${hasSearchQuery ? ` for "${searchQuery.trim()}"` : ""}`
      : hasSearchQuery
      ? `Showing ${productCountLabel} for "${searchQuery.trim()}"`
      : `Showing all ${availableProductCount} products`;

  return (
    <div className="space-y-14 pb-14">
      <section
        id="store-top"
        className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_35%,#fee2e2_100%)] px-6 py-10 shadow-[0_25px_80px_rgba(127,29,29,0.12)] ring-1 ring-black/5 sm:px-8 lg:px-10 lg:py-12 dark:bg-[linear-gradient(135deg,#1f2937_0%,#111827_45%,#3f1d2e_100%)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.35)] dark:ring-white/10"
      >
        <div className="bg-[color:var(--color-wsu)]/10 absolute -right-24 top-12 h-64 w-64 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-1">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-600 dark:border-white/10 dark:bg-neutral-900/70 dark:text-neutral-300">
              Full Stack Store
            </span>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl dark:text-neutral-50">
                Build your next project faster
              </h1>
              <p className="max-w-2xl text-base leading-8 text-neutral-700 sm:text-lg dark:text-neutral-300">
                Explore curated full stack resources, UI kits, templates, and
                developer tools in one modern storefront.
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

            <div
              data-testid="homepage-hero-stats"
              className="grid gap-4 sm:grid-cols-3"
            >
              <div
                data-testid="homepage-available-products-stat"
                className="rounded-[24px] bg-white/85 p-5 shadow-sm ring-1 ring-black/5 dark:bg-neutral-900/80 dark:ring-white/10"
              >
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Available products
                </p>
                <p className="mt-2 text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
                  {availableProductCount}
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
          </div>
        </div>
      </section>

      <section id="shop-by-category" className="scroll-mt-32 space-y-5">
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

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {categoryItems.map((item) => {
            const isSelected =
              selectedCategory === normalizeCategoryValue(item.name);

            return (
            <button
              key={item.name}
              type="button"
              onClick={() => onCategorySelect(item.name)}
              className={`group rounded-[20px] border bg-white px-4 py-3.5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)] dark:bg-neutral-900 dark:shadow-[0_18px_40px_rgba(0,0,0,0.30)] ${
                isSelected
                  ? "border-[color:var(--color-wsu)] bg-[color:var(--color-wsu)]/5 shadow-[0_18px_40px_rgba(152,30,50,0.12)] dark:border-[color:var(--color-wsu)] dark:bg-[color:var(--color-wsu)]/10"
                  : "border-black/10 hover:border-[color:var(--color-wsu)]/20 dark:border-white/10"
              }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                Category
              </p>
              <p className="mt-2 text-xl font-semibold leading-tight text-neutral-950 transition group-hover:text-[color:var(--color-wsu)] dark:text-neutral-50">
                {item.name}
              </p>
              <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-300">
                {item.count} products available
              </p>
              <p className="mt-3 text-sm font-medium text-[color:var(--color-wsu)]">
                {isSelected ? "Category selected" : "Shop category"}
              </p>
            </button>
            );
          })}
        </div>
      </section>

      <section
        id="collections"
        className="grid scroll-mt-32 gap-6 xl:grid-cols-[1.4fr_0.6fr]"
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
            {collectionItems.map((item) => {
              const isSelected =
                selectedCollection === normalizeSearchValue(item.name);

              return (
              <button
                key={item.name}
                type="button"
                onClick={() => onCollectionSelect(item.name)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-[color:var(--color-wsu)] bg-[color:var(--color-wsu)]/10 text-[color:var(--color-wsu)] dark:border-[color:var(--color-wsu)] dark:bg-[color:var(--color-wsu)]/15"
                    : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-white hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
                }`}
                title={`Collection / ${item.name}`}
              >
                <span>{item.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isSelected
                      ? "bg-white/80 text-[color:var(--color-wsu)] dark:bg-neutral-900 dark:text-neutral-100"
                      : "bg-white text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300"
                  }`}
                >
                  {item.count}
                </span>
              </button>
              );
            })}
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
              const historyKey = `${item.year}-${item.month}`;

              return (
                <SummaryItem
                  key={`${item.year}-${item.month}`}
                  name={label}
                  count={item.count}
                  isSelected={selectedHistoryKey === historyKey}
                  onClick={() => onHistorySelect(historyKey)}
                  title={label}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section id="featured-products" className="scroll-mt-32 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
              {hasSearchQuery ? "Search results" : "Featured selection"}
            </p>
            <h2 className="text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
              {hasSearchQuery ? "Search Results" : "Featured Products"}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            {hasSearchQuery
              ? "Matching products appear here as you search by product name, summary, details, category, or collection."
              : "A polished product grid for your storefront demo, featuring available items customers can explore right now."}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-[color:var(--color-wsu)]">
              {filterStatusText}
            </p>
            {hasCategoryFilter || hasCollectionFilter || hasHistoryFilter ? (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex w-fit items-center rounded-full border border-[color:var(--color-wsu)]/20 bg-[color:var(--color-wsu)]/5 px-4 py-2 text-sm font-medium text-[color:var(--color-wsu)] transition hover:border-[color:var(--color-wsu)]/35 hover:bg-[color:var(--color-wsu)]/10"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {featuredCountText}
          </p>

          {featuredProducts.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white px-6 py-14 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
              <p className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                No products found
              </p>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                Search by product name, summary, details, category, or collection.
              </p>
            </div>
          ) : (
              <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {featuredProducts.map((post) => (
                <ProductCard key={`featured-product-${post.urlId}`} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StoreHomepage;
