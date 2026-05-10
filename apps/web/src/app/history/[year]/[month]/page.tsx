import { Main } from "@/components/Main";
import { getPosts } from "@/app/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const filteredPosts = (await getPosts({
    active: true,
  })).filter((post) => {

    const date = new Date(post.date);
    const postYear = date.getFullYear().toString();
    const postMonth = (date.getMonth() + 1).toString();

    return postYear === year && postMonth === month;
  });

  return <Main posts={filteredPosts} />;
}
