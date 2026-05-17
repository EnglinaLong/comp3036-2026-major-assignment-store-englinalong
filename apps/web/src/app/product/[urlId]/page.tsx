import { headers } from "next/headers";
import { TopMenu } from "@/components/Layout/TopMenu";
import {
  getPosts,
  getRequestIp,
  hasLikedPost,
  incrementPostViews,
} from "@/app/posts";
import { ProductRouteClient } from "./ProductRouteClient";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const decodedUrlId = decodeURIComponent(urlId);
  const requestHeaders = await headers();
  const initialPost = await incrementPostViews(decodedUrlId);
  const initialLiked = initialPost
    ? await hasLikedPost(initialPost.id, getRequestIp(requestHeaders))
    : false;
  const initialProducts = await getPosts();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_24%,#f7f7f7_100%)] dark:bg-[linear-gradient(180deg,#0f172a_0%,#111827_38%,#020617_100%)]">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <TopMenu />
      </div>

      <ProductRouteClient
        urlId={decodedUrlId}
        initialPost={initialPost}
        initialProducts={initialProducts}
        initialSaved={initialLiked}
      />
    </div>
  );
}
