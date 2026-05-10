import { type Post } from "@repo/db/data";

export function history(posts: Pick<Post, "date" | "active">[]) {
  const counts = new Map<string, { year: number; month: number; count: number }>();

  for (const post of posts) {
    if (!post.active) continue;

    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const key = `${year}-${month}`;

    if (counts.has(key)) {
      counts.get(key)!.count += 1;
    } else {
      counts.set(key, {
        year,
        month,
        count: 1,
      });
    }
  }

  return Array.from(counts.values()).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });
}
