import { SiteFrame } from "@/components/site-frame";
import { AcademyForm } from "./form";

export const metadata = { title: "Sion Academy · Sion Émergence" };

export default function AcademyPage() {
  return (
    <SiteFrame withBackLink>
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
          École primaire hors contrat · Rentrée septembre 2026
        </p>
        <h1 className="font-display text-4xl md:text-5xl mb-4">
          Lettre d&apos;intention · Sion Academy
        </h1>
        <p className="text-[var(--muted)] leading-relaxed mb-12">
          Manifestez votre intérêt pour inscrire votre enfant à Sion Academy. Cette lettre est
          une intention, non un engagement ferme : l&apos;inscription définitive fera
          l&apos;objet d&apos;un dossier distinct.
        </p>
        <AcademyForm />
      </div>
    </SiteFrame>
  );
}
