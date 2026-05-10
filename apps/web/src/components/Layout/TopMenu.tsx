"use client";

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

export function TopMenu({ query }: { query?: string }) {
  const router = useRouter();
  const [search, setSearch] = useState(query ?? "");

  const handleSearch = debounce((value: string) => {
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  });

  return (
    <div className="flex items-center gap-x-6">
      <form action="#" method="GET" className="grid flex-1 grid-cols-1">
        <input
          value={search}
          onChange={(event) => {
            const value = event.target.value;
            setSearch(value);
            handleSearch(value);
          }}
          name="q"
          placeholder="Search"
        />
      </form>

      <div className="flex items-center gap-x-6">
        <ThemeSwitch />
      </div>
    </div>
  );
}

export default TopMenu;