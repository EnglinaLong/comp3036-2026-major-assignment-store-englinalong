import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const trimmedQuery = q.trim();

  redirect(
    trimmedQuery
      ? `/?q=${encodeURIComponent(trimmedQuery)}#featured-products`
      : "/",
  );
}
