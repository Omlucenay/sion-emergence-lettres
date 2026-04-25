"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, forwardRef, type InputHTMLAttributes } from "react";
import { joyClubSchema, type JoyClubData } from "@/lib/schemas";
import { FormSection, Input, Row, ConsentBlock } from "@/components/form-bits";

export function JoyClubForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JoyClubData>({
    resolver: zodResolver(joyClubSchema),
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
        {
          firstName: "",
          lastName: "",
          age: "",
          centreAere: false,
          garderieMercredi: false,
          soutienScolaire: false,
        },
      ],
      acceptRgpd: false as never,
      acceptTerms: false as never,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "children" });

  async function onSubmit(values: JoyClubData) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "joy_club", data: values }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur lors de l'envoi");
      router.push(`/signature/${json.id}`);
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
            {...register("guardianFirstName")}
            error={errors.guardianFirstName}
          />
          <Input
            label="Nom de famille"
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
            inputMode="numeric"
            maxLength={5}
            {...register("addressPostalCode")}
            error={errors.addressPostalCode}
          />
          <Input
            label="Ville"
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
            hint="10 chiffres"
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

      <FormSection title="Enfant(s) & services souhaités">
        {fields.map((f, i) => (
          <div
            key={f.id}
            className="border-l-2 border-[var(--accent-soft)] pl-5 space-y-4 pb-4"
          >
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
            <Input
              label="Âge"
              {...register(`children.${i}.age` as const)}
              error={errors.children?.[i]?.age}
            />
            <div>
              <p className="label">Services souhaités</p>
              <div className="grid sm:grid-cols-3 gap-3 mt-1">
                <ServiceCheckbox
                  label="Centre aéré (vacances)"
                  {...register(`children.${i}.centreAere` as const)}
                />
                <ServiceCheckbox
                  label="Garderie du mercredi"
                  {...register(`children.${i}.garderieMercredi` as const)}
                />
                <ServiceCheckbox
                  label="Soutien scolaire"
                  {...register(`children.${i}.soutienScolaire` as const)}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            append({
              firstName: "",
              lastName: "",
              age: "",
              centreAere: false,
              garderieMercredi: false,
              soutienScolaire: false,
            })
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

const ServiceCheckbox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: string }
>(function ServiceCheckbox({ label, ...rest }, ref) {
  return (
    <label className="flex items-center gap-2 border border-[#D8D3CB] px-3 py-2 cursor-pointer hover:border-[var(--accent)]">
      <input ref={ref} type="checkbox" className="checkbox" {...rest} />
      <span className="text-sm">{label}</span>
    </label>
  );
});
