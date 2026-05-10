import Main from "@/components/Main";
import { getPosts } from "@/app/posts";
import { TopMenu } from "@/components/Layout/TopMenu";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const filteredPosts = query
    ? await getPosts({
        active: true,
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
        ],
      })
    : await getPosts({
        active: true,
      });

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ marginBottom: "20px" }}>
        <TopMenu query={q} />
      </div>

      {filteredPosts.length === 0 ? (
        <div>0 Posts</div>
      ) : (
        <Main posts={filteredPosts} />
      )}
    </div>
  );
}
