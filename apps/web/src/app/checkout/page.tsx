import { TopMenu } from "@/components/Layout/TopMenu";
import { CheckoutClient } from "@/components/Store/CheckoutClient";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_24%,#f7f7f7_100%)] dark:bg-[linear-gradient(180deg,#0f172a_0%,#111827_38%,#020617_100%)]">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <TopMenu />
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-wsu)]">
            Checkout
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
            Complete your order
          </h1>
        </div>

        <CheckoutClient />
      </main>
    </div>
  );
}
