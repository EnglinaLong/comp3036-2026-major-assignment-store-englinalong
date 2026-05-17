import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  redirect(`/product/${encodeURIComponent(urlId)}`);
}
