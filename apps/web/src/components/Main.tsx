import type { Post } from "@repo/db/data";
import BlogList from "./Blog/List";
import { LeftMenu } from "./Menu/LeftMenu";

export function Main({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  return (
    <main
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: "24px",
        alignItems: "start",
      }}
    >
      <aside>
        <LeftMenu posts={posts} />
      </aside>

      <section>
        <BlogList posts={posts} />
      </section>
    </main>
  );
}

export default Main;