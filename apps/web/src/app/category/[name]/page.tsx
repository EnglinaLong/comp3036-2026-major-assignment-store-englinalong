import { Main } from "@/components/Main";
import { categorySlug } from "@/functions/categories";
import { getPosts } from "@/app/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name).trim().toLowerCase();
  const filteredPosts = (await getPosts({
    active: true,
  })).filter((post) => categorySlug(post.category) === decodedName);

  return <Main posts={filteredPosts} />;
}
