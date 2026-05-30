import { Main } from "@/components/Main";
import { categorySlug } from "@/functions/categories";
import { getProducts } from "@/app/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name).trim().toLowerCase();
  const filteredProducts = (await getProducts({
    active: true,
  })).filter((product) => categorySlug(product.category) === decodedName);

  return <Main posts={filteredProducts} />;
}
