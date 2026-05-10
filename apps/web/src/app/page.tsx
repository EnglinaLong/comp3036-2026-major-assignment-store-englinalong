import { Main } from "@/components/Main";
import { TopMenu } from "@/components/Layout/TopMenu";
import { getPosts } from "./posts";

export default async function Page() {
  const activePosts = await getPosts({
    active: true,
  });

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ marginBottom: "20px" }}>
        <TopMenu />
      </div>

      <Main posts={activePosts} />
    </div>
  );
}
