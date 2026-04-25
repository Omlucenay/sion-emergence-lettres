import { SiteFrame } from "@/components/site-frame";
import { PartnerForm } from "./form";

export const metadata = { title: "Lettre de soutien — Sion Émergence" };

export default function PartenairePage() {
  return (
    <SiteFrame withBackLink>
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
          Soutien au tiers-lieu Sion Émergence
        </p>
        <h1 className="font-display text-4xl md:text-5xl mb-4">Lettre de soutien</h1>
        <p className="text-[var(--muted)] leading-relaxed mb-12">
          Choisissez la variante qui correspond à votre profil, complétez les champs et signez.
          Votre lettre signée nous est transmise immédiatement, avec une copie pour vous.
        </p>
        <PartnerForm />
      </div>
    </SiteFrame>
  );
}
