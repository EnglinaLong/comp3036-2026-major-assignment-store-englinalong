import { TopMenu } from "@/components/Layout/TopMenu";
import { StoreHomepage } from "@/components/Store/Homepage";
import { getPosts } from "./posts";

export default async function Page() {
  const activePosts = await getPosts({
    active: true,
  });

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_24%,#f7f7f7_100%)] dark:bg-[linear-gradient(180deg,#0f172a_0%,#111827_38%,#020617_100%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <TopMenu />
        </div>

        {activePosts.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-neutral-300 bg-white px-6 py-16 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-black/20">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
              Full Stack Store
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
              Products are coming soon
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-neutral-600 dark:text-neutral-300">
              There are no available products to show right now. Check back soon
              for new arrivals and featured collections.
            </p>
          </div>
        ) : (
          <StoreHomepage posts={activePosts} />
        )}
      </div>
    </div>
  );
}
