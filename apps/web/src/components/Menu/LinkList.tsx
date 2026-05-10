import type { PropsWithChildren } from "react";

export function LinkList({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <section
      style={{
        marginBottom: "28px",
      }}
    >
      <h2
        style={{
          fontSize: "16px",
          fontWeight: 700,
          marginBottom: "12px",
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default LinkList;