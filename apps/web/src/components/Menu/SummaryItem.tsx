import Link from "next/link";
import type { CSSProperties } from "react";
import cx from "@repo/utils/classes";

export function SummaryItem({
  name,
  count,
  href,
  link,
  isSelected,
  title,
  onClick,
}: {
  name: string;
  count?: number;
  href?: string;
  link?: string;
  isSelected?: boolean;
  title?: string;
  onClick?: () => void;
}) {
  const finalHref = href ?? link ?? "#";
  const sharedStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    marginBottom: "8px",
    borderRadius: "8px",
    textDecoration: "none",
    width: "100%",
  } satisfies CSSProperties;
  const sharedClassName = cx(
    "w-full rounded-lg border text-left transition",
    "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-800",
    isSelected
      ? "border-[color:var(--color-wsu)]/40 bg-[color:var(--color-wsu)]/10 text-[color:var(--color-wsu)] shadow-[0_8px_24px_rgba(152,30,50,0.12)] dark:border-[color:var(--color-wsu)]/50 dark:bg-[color:var(--color-wsu)]/15"
      : undefined,
  );

  if (onClick) {
    return (
      <button
        type="button"
        title={title}
        onClick={onClick}
        className={sharedClassName}
        style={sharedStyle}
      >
        <span>{name}</span>
        {typeof count === "number" ? (
          <span data-test-id="post-count" data-testid="post-count">
            {count}
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <Link
      href={finalHref}
      title={title}
      className={sharedClassName}
      style={sharedStyle}
    >
      <span>{name}</span>
      {typeof count === "number" ? (
        <span data-test-id="post-count" data-testid="post-count">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

export default SummaryItem;
