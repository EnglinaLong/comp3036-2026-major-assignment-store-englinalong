"use client";

import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";

    setTheme(currentTheme);
  }, []);

  function handleThemeToggle() {
    const newTheme = theme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    document.cookie = `theme=${newTheme}; path=/`;

    setTheme(newTheme);
  }

  return (
    <button type="button" onClick={handleThemeToggle}>
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}