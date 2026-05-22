import { client } from "@repo/db/client";
import { getSeededPostDate } from "@repo/db/data";
import { LoginForm } from "../../../components/LoginForm";
import { isLoggedIn } from "../../../utils/auth";
import { AdminProductEditorRouteClient } from "./AdminProductEditorRouteClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type UpdatePostPageProps = {
  params: Promise<{
    urlId: string;
  }>;
};

export default async function UpdatePostPage({
  params,
}: UpdatePostPageProps) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <LoginForm />;
  }

  const { urlId } = await params;
  const posts = await client.db.product.findMany({
    orderBy: {
      id: "asc",
    },
    include: {
      _count: {
        select: {
          Likes: true,
        },
      },
    },
  });
  const initialPosts = posts.map((post) => ({
    ...post,
    date: getSeededPostDate(post) ?? post.date,
    likes: post._count.Likes,
  }));

  return (
    <AdminProductEditorRouteClient
      urlId={urlId}
      initialPosts={initialPosts}
    />
  );
}

