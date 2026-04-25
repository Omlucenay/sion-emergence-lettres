"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { academySchema, academyLevels, type AcademyData } from "@/lib/schemas";
import { FormSection, Input, Row, ConsentBlock, Select } from "@/components/form-bits";

export function AcademyForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AcademyData>({
    resolver: zodResolver(academySchema),
    defaultValues: {
      guardianFirstName: "",
      guardianLastName: "",
      addressStreet: "",
      addressPostalCode: "",
      addressCity: "",
      phone: "",
      email: "",
      city: "Le Lamentin",
      signedDate: today,
      children: [
        { firstName: "", lastName: "", birthDate: "", level: "CP" },
      ],
      acceptRgpd: false as never,
      acceptTerms: false as never,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "children" });

  async function onSubmit(values: AcademyData) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "academy", data: values }),
      });
      const text = await res.text();
      let parsed: { id?: string; error?: string; detail?: string } | null = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        // Non-JSON response — usually a 500 with HTML. Garde le brut.
      }
      if (!res.ok) {
        const msg =
          parsed?.error ??
          parsed?.detail ??
          text.slice(0, 200) ??
          `Erreur ${res.status}`;
        throw new Error(msg);
      }
      if (!parsed?.id) throw new Error("Réponse invalide du serveur");
      router.push(`/signature/${parsed.id}`);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Erreur inconnue");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormSection eyebrow="Étape 1 / 2" title="Responsable légal">
        <Row>
          <Input
            label="Prénom"
            placeholder="Ex. Marie"
            {...register("guardianFirstName")}
            error={errors.guardianFirstName}
          />
          <Input
            label="Nom de famille"
            placeholder="Ex. DUPONT"
            {...register("guardianLastName")}
            error={errors.guardianLastName}
          />
        </Row>
        <Input
          label="N° et voie"
          placeholder="Ex. 12 rue des Hibiscus"
          {...register("addressStreet")}
          error={errors.addressStreet}
        />
        <Row>
          <Input
            label="Code postal"
            placeholder="Ex. 97232"
            inputMode="numeric"
            maxLength={5}
            {...register("addressPostalCode")}
            error={errors.addressPostalCode}
          />
          <Input
            label="Ville"
            placeholder="Ex. Le Lamentin"
            {...register("addressCity")}
            error={errors.addressCity}
          />
        </Row>
        <Row>
          <Input
            label="Téléphone"
            type="tel"
            inputMode="tel"
            placeholder="06 XX XX XX XX"
            maxLength={14}
            {...register("phone")}
            error={errors.phone}
            hint="10 chiffres (espaces autorisés)"
          />
          <Input
            label="Courriel"
            type="email"
            placeholder="vous@exemple.com"
            {...register("email")}
            error={errors.email}
          />
        </Row>
      </FormSection>

      <FormSection title="Enfant(s) concerné(s)">
        {fields.map((f, i) => (
          <div key={f.id} className="border-l-2 border-[var(--accent-soft)] pl-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                Enfant {i + 1}
              </span>
              {fields.length > 1 ? (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-xs text-[var(--muted)] hover:text-[var(--ink)] underline"
                >
                  Retirer
                </button>
              ) : null}
            </div>
            <Row>
              <Input
                label="Prénom"
                {...register(`children.${i}.firstName` as const)}
                error={errors.children?.[i]?.firstName}
              />
              <Input
                label="Nom de famille"
                {...register(`children.${i}.lastName` as const)}
                error={errors.children?.[i]?.lastName}
              />
            </Row>
            <Row>
              <Input
                label="Date de naissance"
                type="date"
                {...register(`children.${i}.birthDate` as const)}
                error={errors.children?.[i]?.birthDate}
              />
              <Select
                label="Niveau visé à la rentrée"
                {...register(`children.${i}.level` as const)}
                error={errors.children?.[i]?.level}
              >
                {academyLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </Select>
            </Row>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            append({ firstName: "", lastName: "", birthDate: "", level: "CP" })
          }
          className="btn btn-secondary"
        >
          + Ajouter un enfant
        </button>
      </FormSection>

      <FormSection title="Lieu, date & consentements">
        <Row>
          <Input label="Fait à" {...register("city")} error={errors.city} />
          <Input
            label="Le"
            type="date"
            {...register("signedDate")}
            error={errors.signedDate}
          />
        </Row>
        <ConsentBlock
          termsProps={register("acceptTerms")}
          rgpdProps={register("acceptRgpd")}
          termsError={errors.acceptTerms?.message as string | undefined}
          rgpdError={errors.acceptRgpd?.message as string | undefined}
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
