"use client";

import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";
import { useEffect, useState } from "react";
import { LinkList } from "./LinkList";

const BASE_CATEGORIES = ["React", "Node", "Mongo", "DevOps"];

export function CategoryList({ posts }: { posts: Post[] }) {
  const [data, setData] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const result = await categories(posts);

      const merged = BASE_CATEGORIES.map((name) => {
        const existing = result.find((item) => item.name === name);
        return { name, count: existing?.count ?? 0 };
      });

      setData(merged);
    };

    loadCategories();
  }, [posts]);

  return (
    <LinkList title="Categories">
      {data.map((item) => (
        <SummaryItem
          key={item.name}
          name={`Category / ${item.name}`}
          count={item.count}
          isSelected={false}
          href={`/category/${toUrlPath(item.name)}`}
          title={`Category / ${item.name}`}
        />
      ))}
    </LinkList>
  );
}

export default CategoryList;