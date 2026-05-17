"use client";

import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(
      document.documentElement.getAttribute("data-theme") === "dark",
    );
  }, []);

  function handleThemeToggle() {
    const nextIsDarkMode = !isDarkMode;
    const newTheme = nextIsDarkMode ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", newTheme);
    document.cookie = `theme=${newTheme}; path=/`;
    setIsDarkMode(nextIsDarkMode);
  }

  return (
    <button
      type="button"
      onClick={handleThemeToggle}
      className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
    >
      {isDarkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
