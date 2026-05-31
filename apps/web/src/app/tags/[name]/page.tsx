import Main from "@/components/Main";
import { getProducts } from "@/app/posts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const tagName = decodeURIComponent(name).trim().toLowerCase();
  const filteredProducts = (await getProducts({
    active: true,
  })).filter((product) => {

    const productTags = product.tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"));

    return productTags.includes(tagName);
  });

  return <Main posts={filteredProducts} />;
}
