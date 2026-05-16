import Link from "next/link";

export function AuthBrandCard({
  alternateHref,
  alternateLabel,
}: {
  alternateHref: string;
  alternateLabel: string;
}) {
  return (
    <aside className="flex min-h-full flex-col justify-center rounded-[30px] border border-black/10 bg-neutral-50/95 px-6 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-neutral-900/95 dark:shadow-[0_18px_50px_rgba(0,0,0,0.2)] sm:px-7">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--color-wsu)]/15 bg-white shadow-sm dark:bg-neutral-950">
          <div className="grid grid-cols-2 gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-wsu)]" />
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-wsu)]" />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-wsu)]">
            WELCOME BACK
          </p>
          <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Sign in or create your account to continue shopping.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href={alternateHref}
          className="inline-flex items-center text-sm font-medium text-[color:var(--color-wsu)] transition hover:text-[color:var(--color-wsu-light)]"
        >
          {alternateLabel}
        </Link>
      </div>
    </aside>
  );
}
