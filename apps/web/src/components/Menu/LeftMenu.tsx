import type { Post } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu({ posts }: { posts: Post[] }) {
  return (
    <aside
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <CategoryList posts={posts} />
      <HistoryList posts={posts} />
      <TagList posts={posts} />
    </aside>
  );
}

export default LeftMenu;