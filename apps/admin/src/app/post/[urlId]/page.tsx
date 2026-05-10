import { client } from "@repo/db/client";
import { LoginForm } from "../../../components/LoginForm";
import { PostEditor } from "../../../components/PostEditor";
import { isLoggedIn } from "../../../utils/auth";

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
  const post = await client.db.post.findUnique({
    where: {
      urlId,
    },
    select: {
      id: true,
      title: true,
      category: true,
      description: true,
      content: true,
      imageUrl: true,
      tags: true,
    },
  });

  if (!post) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Post not found</h1>
      </main>
    );
  }

  return (
    <PostEditor
      postId={post.id}
      initialPost={{
        title: post.title,
        category: post.category,
        description: post.description,
        content: post.content,
        imageUrl: post.imageUrl,
        tags: post.tags,
      }}
    />
  );
}

