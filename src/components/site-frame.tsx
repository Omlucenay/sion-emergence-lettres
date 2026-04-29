import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

const VITRINE_URL = "https://sion-emergence.fr";

const footerColumns = [
  {
    title: "Explorer",
    links: [
      { label: "Le projet", href: VITRINE_URL },
      { label: "Sion Academy", href: VITRINE_URL },
      { label: "Joy Club", href: VITRINE_URL },
      { label: "Parent Lab", href: VITRINE_URL },
      { label: "Dispositifs", href: VITRINE_URL },
    ],
  },
  {
    title: "Nous rejoindre",
    links: [
      { label: "Lettres d'intention", href: "/" },
      { label: "Partenaires", href: VITRINE_URL },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "contact@sion-emergence.fr", href: "mailto:contact@sion-emergence.fr" },
      { label: "Le Lamentin, Martinique", href: VITRINE_URL },
    ],
  },
];

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
          <a href={VITRINE_URL} className="flex items-center gap-3">
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
          </a>
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
      <footer className="bg-[var(--ink)] text-[var(--paper)] mt-16">
        <div className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-14 mb-12 md:mb-14">
            <div>
              <a href={VITRINE_URL} className="inline-block mb-6">
                <Image
                  src="/logo-sion-emergence.png"
                  alt="Sion Émergence"
                  width={140}
                  height={140}
                  className="bg-[var(--paper)] rounded-2xl p-3 h-28 w-28 md:h-32 md:w-32 object-contain shadow-2xl"
                />
              </a>
              <p className="font-display text-2xl md:text-3xl leading-tight mb-4">
                Une enfance qui<br />
                <em className="text-[var(--warm)]">a du sens.</em>
              </p>
              <p className="text-sm leading-relaxed text-white/70 max-w-xs">
                Un lieu vivant où les enfants grandissent et les familles se retrouvent, au cœur de la Martinique.
              </p>
            </div>
            {footerColumns.map((col) => (
              <div key={col.title}>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-5">
                  {col.title}
                </p>
                <ul className="space-y-2.5 text-sm text-white/80">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-between items-center gap-4 pt-7 border-t border-white/10">
            <p className="text-xs text-white/50">
              © 2026 Sion Émergence · Association loi 1901 · Le Lamentin · Martinique
            </p>
            <p className="font-display italic text-lg text-[var(--warm)]/90">
              Là où l&apos;éducation rejoint la vie
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
