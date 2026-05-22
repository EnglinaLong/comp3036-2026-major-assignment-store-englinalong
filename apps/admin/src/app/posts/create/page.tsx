import { LoginForm } from "../../../components/LoginForm";
import { PostEditor } from "../../../components/PostEditor";
import { isLoggedIn } from "../../../utils/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CreatePostPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <LoginForm />;
  }

  return (
    <PostEditor
      initialPost={{
        urlId: "",
        title: "",
        category: "",
        description: "",
        content: "",
        imageUrl: "",
        date: new Date(),
        views: 0,
        likes: 0,
        active: true,
        price: 0,
        tags: "",
      }}
    />
  );
}
