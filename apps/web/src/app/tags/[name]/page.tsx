import Main from "@/components/Main";
import { getPosts } from "@/app/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const tagName = decodeURIComponent(name).trim().toLowerCase();
  const filteredPosts = (await getPosts({
    active: true,
  })).filter((post) => {

    const postTags = post.tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"));

    return postTags.includes(tagName);
  });

  return <Main posts={filteredPosts} />;
}
