import { headers } from "next/headers";
import { TopMenu } from "@/components/Layout/TopMenu";
import {
  getProductByUrlId,
  getProducts,
  getRequestIp,
  hasLikedProduct,
  incrementProductViews,
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
  const existingProduct = await getProductByUrlId(decodedUrlId);
  const initialProduct = existingProduct?.active
    ? await incrementProductViews(decodedUrlId)
    : existingProduct;
  const initialLiked = initialProduct
    ? await hasLikedProduct(initialProduct.id, getRequestIp(requestHeaders))
    : false;
  const initialProducts = await getProducts({
    active: true,
  });

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_24%,#f7f7f7_100%)] dark:bg-[linear-gradient(180deg,#0f172a_0%,#111827_38%,#020617_100%)]">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <TopMenu />
      </div>

      <ProductRouteClient
        urlId={decodedUrlId}
        initialPost={initialProduct}
        initialProducts={initialProducts}
        initialSaved={initialLiked}
      />
    </div>
  );
}
