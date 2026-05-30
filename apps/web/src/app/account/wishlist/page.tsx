import { AccountShell } from "@/components/Store/AccountShell";
import { WishlistClient } from "@/components/Store/WishlistClient";
import { getProducts } from "@/app/posts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WishlistPage() {
  const initialProducts = await getProducts({
    active: true,
  });

  return (
    <AccountShell title="Wishlist">
      <WishlistClient initialPosts={initialProducts} />
    </AccountShell>
  );
}
