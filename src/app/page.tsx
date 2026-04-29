import Link from "next/link";
import { SiteFrame } from "@/components/site-frame";

const choices = [
  {
    href: "/academy",
    eyebrow: "École primaire",
    title: "Sion Academy",
    description:
      "Lettre d'intention d'inscription pour la rentrée inaugurale · septembre 2026.",
    audience: "Parents",
  },
  {
    href: "/joy-club",
    eyebrow: "Périscolaire & loisirs",
    title: "Joy Club",
    description:
      "Centre aéré, garderie du mercredi et soutien scolaire · ouverture septembre 2026.",
    audience: "Parents",
  },
  {
    href: "/partenaire",
    eyebrow: "Soutien au projet",
    title: "Partenaire",
    description:
      "Lettre de soutien · institutionnel, professionnel ou acteur économique local.",
    audience: "Partenaires",
  },
];

export default function Home() {
  return (
    <SiteFrame>
      <section className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] mb-4">
          Le Lamentin · Martinique
        </p>
        <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mb-6">
          Lettres d&apos;intention &<br />
          de soutien.
        </h1>
        <p className="text-lg leading-relaxed text-[var(--muted)] max-w-xl mb-12">
          Sion Émergence est un tiers-lieu éducatif et communautaire en construction. Choisissez
          ci-dessous le type de lettre qui vous concerne, remplissez les champs, signez
          en ligne et nous recevons l&apos;original.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-px bg-[#E8E2D8] border border-[#E8E2D8]">
        {choices.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group bg-[var(--paper)] p-8 flex flex-col gap-4 transition-colors hover:bg-[var(--pale)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                {c.eyebrow}
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] border border-[#D8D3CB] px-2 py-1">
                {c.audience}
              </span>
            </div>
            <h2 className="font-display text-3xl leading-tight">{c.title}</h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{c.description}</p>
            <span className="mt-auto text-sm border-b border-[var(--ink)] self-start group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]">
              Commencer →
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-16 pt-8 border-t border-[#E8E2D8] text-xs text-[var(--muted)] max-w-3xl leading-relaxed">
        <p className="mb-2 uppercase tracking-[0.18em] text-[var(--ink)]">Comment ça marche</p>
        <ol className="space-y-1 list-decimal list-inside">
          <li>Vous renseignez les champs nécessaires.</li>
          <li>Vous signez directement à l&apos;écran (souris, doigt ou stylet).</li>
          <li>
            Vous recevez votre lettre signée par email. Une copie nous est transmise
            automatiquement.
          </li>
        </ol>
      </section>
    </SiteFrame>
  );
}
