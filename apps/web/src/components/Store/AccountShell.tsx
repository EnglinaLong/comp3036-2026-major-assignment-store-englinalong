import type { PropsWithChildren } from "react";
import { TopMenu } from "@/components/Layout/TopMenu";

export function AccountShell({
  title,
  children,
}: PropsWithChildren<{
  title: string;
}>) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_24%,#f7f7f7_100%)] dark:bg-[linear-gradient(180deg,#0f172a_0%,#111827_38%,#020617_100%)]">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <TopMenu />
      </div>

      <main className="mx-auto flex w-full max-w-4xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-neutral-950 dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <h1 className="text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
            {title}
          </h1>
          <div className="mt-8">{children}</div>
        </section>
      </main>
    </div>
  );
}
