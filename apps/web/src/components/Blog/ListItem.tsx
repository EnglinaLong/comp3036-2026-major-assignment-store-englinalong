import type { Post } from "@repo/db/data";
import Link from "next/link";
import { getProductHref } from "@/functions/productHref";
import { normalizeTag } from "@/functions/tags";
import { categorySlug } from "../../functions/categories";

function formatDate(date: Date | string) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-GB", { month: "short" });
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
}

export function BlogListItem({ post }: { post: Post }) {
  const tags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const postHref = getProductHref(post);

  const categoryHref = categorySlug(post.category);
  const displayTitle = post.title.replace(/!$/, "");

  return (
    <article
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      data-testid={`blog-post-${post.id}`}
      data-test-id={`blog-post-${post.id}`}
    >
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>{formatDate(post.date)}</span>

        <Link href={`/category/${categoryHref}`} className="hover:underline">
          {post.category}
        </Link>
      </div>

      <Link
        href={postHref}
        className="block text-3xl font-bold leading-tight text-black hover:underline"
      >
        {displayTitle}
      </Link>

      <img
        src={post.imageUrl}
        alt={displayTitle}
        className="w-full max-w-[640px] rounded-xl object-cover"
      />

      <p className="text-base leading-7 text-gray-700">{post.description}</p>

      <div className="flex flex-wrap gap-3 text-sm">
        {tags.map((tag) => {
          const tagSlug = normalizeTag(tag);

          return (
            <Link
              key={tag}
              href={`/tags/${tagSlug}`}
              className="text-gray-600 hover:underline"
            >
              #{tag}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 text-sm text-gray-500">
        <span>{post.views} views</span>
        <span>{post.likes} likes</span>
      </div>
    </article>
  );
}

export default BlogListItem;
