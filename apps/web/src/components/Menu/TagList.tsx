import { type Post } from "@repo/db/data";
import { normalizeTag, tags } from "@/functions/tags";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

export async function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  const data = await tags(posts);

  return (
    <LinkList title="Tags">
      {data.map((item) => {
        const slug = normalizeTag(item.name);
        const label = `Tag / ${item.name}`;

        return (
          <SummaryItem
            key={slug}
            name={label}
            count={item.count}
            href={`/tags/${slug}`}
            isSelected={selectedTag === slug}
            title={label}
          />
        );
      })}
    </LinkList>
  );
}

export default TagList;