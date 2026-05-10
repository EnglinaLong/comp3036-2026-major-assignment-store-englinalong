import Link from "next/link";
import cx from "@repo/utils/classes";

export function SummaryItem({
  name,
  count,
  href,
  link,
  isSelected,
  title,
}: {
  name: string;
  count?: number;
  href?: string;
  link?: string;
  isSelected?: boolean;
  title?: string;
}) {
  const finalHref = href ?? link ?? "#";

  return (
    <Link
      href={finalHref}
      title={title}
      className={cx({
        selected: !!isSelected,
      })}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        padding: "10px 12px",
        marginBottom: "8px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        textDecoration: "none",
        color: "inherit",
      }}
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
