"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce<T extends (...args: string[]) => void>(fn: T, delay = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function TopMenu({
  query,
  placeholder = "Search products",
}: {
  query?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(query ?? "");

  const handleSearch = debounce((value: string) => {
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  });

  return (
    <header className="sticky top-4 z-20 rounded-[28px] border border-black/10 bg-white/85 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:border-white/10 dark:bg-neutral-950/85 dark:shadow-[0_18px_50px_rgba(0,0,0,0.35)] dark:supports-[backdrop-filter]:bg-neutral-950/75">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-wsu)]">
                Full Stack Store
              </div>
              <div className="truncate text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                Everyday products for modern projects
              </div>
            </Link>

            <div className="lg:hidden">
              <ThemeSwitch />
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            <Link
              href="/#store-top"
              className="rounded-full px-4 py-2 transition hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
            >
              Home
            </Link>
            <a
              href="/#featured-products"
              className="rounded-full px-4 py-2 transition hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
            >
              Products
            </a>
            <a
              href="/#shop-by-category"
              className="rounded-full px-4 py-2 transition hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
            >
              Categories
            </a>
            <a
              href="/#collections"
              className="rounded-full px-4 py-2 transition hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
            >
              Collections
            </a>
          </nav>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <form action="#" method="GET" className="grid flex-1 grid-cols-1">
            <input
              value={search}
              onChange={(event) => {
                const value = event.target.value;
                setSearch(value);
                handleSearch(value);
              }}
              name="q"
              placeholder={placeholder}
              className="w-full rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm text-neutral-900 outline-none transition focus:border-[color:var(--color-wsu)] focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:focus:bg-neutral-950"
            />
          </form>

          <div className="hidden md:flex md:items-center">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopMenu;
