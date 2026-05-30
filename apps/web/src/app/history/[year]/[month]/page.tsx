import { Main } from "@/components/Main";
import { getProducts } from "@/app/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const filteredProducts = (await getProducts({
    active: true,
  })).filter((product) => {

    const date = new Date(product.date);
    const productYear = date.getFullYear().toString();
    const productMonth = (date.getMonth() + 1).toString();

    return productYear === year && productMonth === month;
  });

  return <Main posts={filteredProducts} />;
}
