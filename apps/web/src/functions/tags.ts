export function normalizeTag(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export async function tags(posts: { tags: string; active: boolean }[]) {
  const counts = new Map<string, { name: string; count: number }>();

  for (const post of posts) {
    if (!post.active) continue;

    const splitTags = post.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    for (const tag of splitTags) {
      const normalized = normalizeTag(tag);
      const existing = counts.get(normalized);

      if (existing) {
        existing.count += 1;
      } else {
        counts.set(normalized, { name: tag, count: 1 });
      }
    }
  }

  return Array.from(counts.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}