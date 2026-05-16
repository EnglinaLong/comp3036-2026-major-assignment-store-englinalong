import { AccountShell } from "@/components/Store/AccountShell";
import { WishlistClient } from "@/components/Store/WishlistClient";
import { getPosts } from "@/app/posts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WishlistPage() {
  const initialPosts = await getPosts();

  return (
    <AccountShell title="Wishlist">
      <WishlistClient initialPosts={initialPosts} />
    </AccountShell>
  );
}
