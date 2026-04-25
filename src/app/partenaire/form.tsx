"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  partnerSchema,
  type PartnerData,
  type PartnerVariant,
} from "@/lib/schemas";
import { FormSection, Input, Row, Textarea, ConsentBlock } from "@/components/form-bits";

const variants: Array<{ id: PartnerVariant; title: string; subtitle: string }> = [
  {
    id: "institutional",
    title: "Institutionnel ou associatif",
    subtitle: "Collectivité, association, structure publique ou parapublique.",
  },
  {
    id: "professional",
    title: "Professionnel",
    subtitle: "Éducation, santé, social, culture — exercice individuel ou en structure.",
  },
  {
    id: "economic",
    title: "Acteur économique",
    subtitle: "Producteur local, artisan, entreprise, restauration, transformation.",
  },
];

export function PartnerForm() {
  const router = useRouter();
  const [variant, setVariant] = useState<PartnerVariant | null>(null);

  if (!variant) {
    return (
      <div>
        <FormSection eyebrow="Étape 1 / 3" title="Quel est votre profil ?">
          <div className="grid md:grid-cols-3 gap-4">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariant(v.id)}
                className="text-left border border-[#D8D3CB] p-5 hover:border-[var(--accent)] hover:bg-[var(--paper)] transition-colors"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent)] mb-2">
                  Variante {variants.indexOf(v) + 1}
                </p>
                <p className="font-display text-xl mb-2">{v.title}</p>
                <p className="text-sm text-[var(--muted)]">{v.subtitle}</p>
              </button>
            ))}
          </div>
        </FormSection>
      </div>
    );
  }

  return (
    <PartnerVariantForm
      variant={variant}
      onBack={() => setVariant(null)}
      onSubmitted={(id) => router.push(`/signature/${id}`)}
    />
  );
}

function PartnerVariantForm({
  variant,
  onBack,
  onSubmitted,
}: {
  variant: PartnerVariant;
  onBack: () => void;
  onSubmitted: (id: string) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  type FormValues = PartnerData & { variant: PartnerVariant };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      variant,
      city: "",
      signedDate: today,
      signerFirstName: "",
      signerLastName: "",
      signerRole: "",
      organizationName: "",
      email: "",
      acceptRgpd: false as never,
      acceptTerms: false as never,
      ...(variant === "institutional" ? { commitment: "" } : {}),
      ...(variant === "professional"
        ? { profession: "", practiceContext: "", observation: "", availability: "" }
        : {}),
      ...(variant === "economic" ? { activity: "", territory: "", partnership: "" } : {}),
    } as FormValues,
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: `partner_${variant}`, data: values }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur lors de l'envoi");
      onSubmitted(json.id);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Erreur inconnue");
      setSubmitting(false);
    }
  }

  // Cast errors to permissive shape
  const e = errors as Record<string, { message?: string } | undefined>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <button
        type="button"
        onClick={onBack}
        className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] hover:text-[var(--ink)] mb-6"
      >
        ← Changer de profil
      </button>

      <FormSection eyebrow="Étape 2 / 3" title="Signataire">
        <Row>
          <Input
            label="Prénom"
            placeholder="Ex. Marie"
            {...register("signerFirstName")}
            error={e.signerFirstName?.message}
          />
          <Input
            label="Nom de famille"
            placeholder="Ex. DUPONT"
            {...register("signerLastName")}
            error={e.signerLastName?.message}
          />
        </Row>
        <Row>
          <Input
            label="Fonction"
            placeholder="Ex. Directrice"
            {...register("signerRole")}
            error={e.signerRole?.message}
          />
          <Input
            label="Courriel"
            type="email"
            {...register("email")}
            error={e.email?.message}
          />
        </Row>
        <Input
          label="Structure / Organisation"
          {...register("organizationName")}
          error={e.organizationName?.message}
        />
      </FormSection>

      {variant === "institutional" ? (
        <FormSection eyebrow="Étape 3 / 3" title="Engagement">
          <Textarea
            label="Nous nous engageons à…"
            placeholder="Ex. relais d'information, mise en réseau, accueil d'ateliers…"
            {...register("commitment" as keyof FormValues)}
            error={e.commitment?.message}
          />
        </FormSection>
      ) : null}

      {variant === "professional" ? (
        <FormSection eyebrow="Étape 3 / 3" title="Pratique professionnelle">
          <Row>
            <Input
              label="Profession"
              placeholder="Ex. Psychologue, enseignant, médecin…"
              {...register("profession" as keyof FormValues)}
              error={e.profession?.message}
            />
            <Input
              label="Cadre & lieu d'exercice"
              placeholder="Ex. en cabinet libéral à Fort-de-France"
              {...register("practiceContext" as keyof FormValues)}
              error={e.practiceContext?.message}
            />
          </Row>
          <Textarea
            label="Dans ma pratique, je constate…"
            placeholder="Ex. besoin d'une pédagogie active, accompagnement des familles…"
            {...register("observation" as keyof FormValues)}
            error={e.observation?.message}
          />
          <Textarea
            label="Je me tiens disponible pour…"
            placeholder="Ex. orienter des familles, intervenir en formation, comité consultatif…"
            {...register("availability" as keyof FormValues)}
            error={e.availability?.message}
          />
        </FormSection>
      ) : null}

      {variant === "economic" ? (
        <FormSection eyebrow="Étape 3 / 3" title="Activité & partenariat">
          <Row>
            <Input
              label="Activité"
              placeholder="Ex. production maraîchère, transformation, artisanat…"
              {...register("activity" as keyof FormValues)}
              error={e.activity?.message}
            />
            <Input
              label="Territoire"
              placeholder="Ex. Le Lamentin et environs"
              {...register("territory" as keyof FormValues)}
              error={e.territory?.message}
            />
          </Row>
          <Textarea
            label="Intention de partenariat"
            placeholder="Ex. fourniture de produits locaux au service traiteur, accueil d'ateliers, transmission de savoir-faire…"
            {...register("partnership" as keyof FormValues)}
            error={e.partnership?.message}
          />
        </FormSection>
      ) : null}

      <FormSection title="Lieu, date & consentements">
        <Row>
          <Input label="Fait à" {...register("city")} error={e.city?.message} />
          <Input
            label="Le"
            type="date"
            {...register("signedDate")}
            error={e.signedDate?.message}
          />
        </Row>
        <ConsentBlock
          termsProps={register("acceptTerms")}
          rgpdProps={register("acceptRgpd")}
          termsError={e.acceptTerms?.message}
          rgpdError={e.acceptRgpd?.message}
        />
      </FormSection>

      {serverError ? (
        <p className="field-error mb-4" role="alert">
          {serverError}
        </p>
      ) : null}

      <button type="submit" className="btn" disabled={submitting}>
        {submitting ? "Préparation…" : "Continuer vers la signature →"}
      </button>
    </form>
  );
}
