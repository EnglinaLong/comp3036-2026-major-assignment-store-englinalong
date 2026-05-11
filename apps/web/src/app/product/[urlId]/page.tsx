import { headers } from "next/headers";
import { marked } from "marked";
import { TopMenu } from "@/components/Layout/TopMenu";
import ProductDetailView from "@/components/Store/ProductDetailView";
import { getRequestIp, hasLikedPost, incrementPostViews } from "@/app/posts";
import { normalizeTag } from "@/functions/tags";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const requestHeaders = await headers();
  const post = await incrementPostViews(decodeURIComponent(urlId));

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
          Full Stack Store
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-neutral-950">
          Product not found
        </h1>
        <p className="mt-3 text-neutral-600">
          This product is unavailable right now or no longer exists.
        </p>
      </div>
    );
  }

  const initialLiked = await hasLikedPost(
    post.id,
    getRequestIp(requestHeaders),
  );
  const contentHtml = await marked.parse(post.content);
  const tags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => ({
      label: tag,
      href: `/tags/${normalizeTag(tag)}`,
    }));

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_24%,#f7f7f7_100%)] dark:bg-[linear-gradient(180deg,#0f172a_0%,#111827_38%,#020617_100%)]">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <TopMenu />
      </div>

      <ProductDetailView
        post={post}
        tags={tags}
        contentHtml={contentHtml}
        initialSaved={initialLiked}
      />
    </div>
  );
}
