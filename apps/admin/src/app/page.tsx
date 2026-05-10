import { isLoggedIn } from "../utils/auth";
import { LoginForm } from "../components/LoginForm";
import { ListScreen } from "../components/ListScreen";
import { LogoutButton } from "../components/LogoutButton";
import styles from "./page.module.css";
import { client } from "@repo/db/client";
import type { Post } from "@repo/db/data";

// Disable caching for this page to ensure auth state is always checked
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getAdminPosts(): Promise<Post[]> {
  const dbPosts = await client.db.post.findMany({
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

  return dbPosts.map((post) => ({
    ...post,
    likes: post._count.Likes,
  }));
}

export default async function Home() {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach
  const loggedIn = await isLoggedIn();
  const adminPosts = loggedIn ? await getAdminPosts() : [];

  if (!loggedIn) {
    return (
      <main className={styles.page}>
        <div className={styles.loginShell}>
          <LoginForm />
        </div>
      </main>
    );
  } else {
    return (
      <main className={styles.page}>
        <section className={styles.dashboard}>
          <div className={styles.topBar}>
            <div className={styles.titleBlock}>
              <h1 className={styles.pageTitle}>Admin of Full Stack Blog</h1>
              <p className={styles.pageDescription}>
                Manage your posts from one simple dashboard.
              </p>
            </div>
            <LogoutButton />
          </div>
          <div className={styles.contentCard}>
            <ListScreen initialPosts={adminPosts} />
          </div>
        </section>
      </main>
    );
  }
}
