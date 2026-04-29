import { SiteFrame } from "@/components/site-frame";
import { JoyClubForm } from "./form";

export const metadata = { title: "Joy Club · Sion Émergence" };

export default function JoyClubPage() {
  return (
    <SiteFrame withBackLink>
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
          Périscolaire & loisirs · Ouverture septembre 2026
        </p>
        <h1 className="font-display text-4xl md:text-5xl mb-4">
          Lettre d&apos;intention · Joy Club
        </h1>
        <p className="text-[var(--muted)] leading-relaxed mb-12">
          Centre aéré (vacances), garderie du mercredi et soutien scolaire. Cochez les services
          souhaités pour chaque enfant.
        </p>
        <JoyClubForm />
      </div>
    </SiteFrame>
  );
}
