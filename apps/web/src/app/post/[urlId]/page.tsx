import { headers } from "next/headers";
import PostDetailClient from "./PostDetailClient";
import { getRequestIp, hasLikedPost, incrementPostViews } from "@/app/posts";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const requestHeaders = await headers();
  const post = await incrementPostViews(decodeURIComponent(urlId));

  if (!post) {
    return <div>Article not found</div>;
  }

  const liked = await hasLikedPost(post.id, getRequestIp(requestHeaders));

  const tags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => ({
      label: tag,
      href: `/tags/${slugify(tag)}`,
    }));

  return <PostDetailClient post={post} tags={tags} initialLiked={liked} />;
}
