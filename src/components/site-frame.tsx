import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export function SiteFrame({
  children,
  withBackLink,
}: {
  children: ReactNode;
  withBackLink?: boolean;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <header className="border-b border-[#E8E2D8] bg-white/60">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-sion-emergence.png"
              alt="Sion Émergence"
              width={56}
              height={56}
              priority
              className="h-12 w-12 md:h-14 md:w-14 object-contain"
            />
            <span className="hidden md:inline text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
              Tiers-lieu éducatif & communautaire
            </span>
          </Link>
          {withBackLink ? (
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] hover:text-[var(--ink)]"
            >
              ← Retour
            </Link>
          ) : null}
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-10 py-12 md:py-20">
        {children}
      </main>
      <footer className="border-t border-[#E8E2D8] mt-16">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 text-xs text-[var(--muted)] flex flex-wrap gap-4 justify-between">
          <span>© Sion Émergence — Le Lamentin, Martinique</span>
          <span>
            Olivier-Marie LUCENAY & Karla LUCENAY · cofondateurs ·{" "}
            <a className="underline" href="mailto:om.lucenay@gmail.com">
              om.lucenay@gmail.com
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
