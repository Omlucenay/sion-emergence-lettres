import { z } from "zod";

// ============================================================
// Helpers de validation
// ============================================================

const phoneRegex = /^(?:\+?\d{1,3}[\s.-]?)?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}$/;
const phoneNormalized = (v: string) => v.replace(/[\s.-]/g, "");

export const phoneSchema = z
  .string()
  .min(10, "Le téléphone doit comporter 10 chiffres")
  .refine((v) => phoneRegex.test(v), "Numéro de téléphone invalide")
  .refine(
    (v) => phoneNormalized(v).replace(/^\+\d{1,3}/, "").length === 10,
    "Le téléphone doit comporter 10 chiffres",
  );

export const postalCodeSchema = z
  .string()
  .regex(/^\d{5}$/, "Code postal invalide (5 chiffres)");

export const emailSchema = z
  .string()
  .min(1, "Email requis")
  .email("Email invalide");

// Niveaux scolaires Sion Academy (école primaire CP → CM2)
export const academyLevels = ["CP", "CE1", "CE2", "CM1", "CM2"] as const;
export const academyLevelSchema = z.enum(academyLevels, {
  message: "Niveau requis",
});

// ============================================================
// Sion Academy · Lettre d'intention parents (école primaire)
// ============================================================

export const childAcademySchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  birthDate: z.string().min(1, "Date de naissance requise"),
  level: academyLevelSchema,
});

export const academySchema = z.object({
  guardianFirstName: z.string().min(1, "Prénom requis"),
  guardianLastName: z.string().min(1, "Nom requis"),
  addressStreet: z.string().min(3, "Numéro et voie requis"),
  addressPostalCode: postalCodeSchema,
  addressCity: z.string().min(1, "Ville requise"),
  phone: phoneSchema,
  email: emailSchema,
  children: z.array(childAcademySchema).min(1, "Au moins un enfant"),
  city: z.string().min(2, "Ville requise"),
  signedDate: z.string().min(1, "Date requise"),
  acceptRgpd: z.literal(true, { message: "Acceptation RGPD requise" }),
  acceptTerms: z.literal(true, { message: "Acceptation requise" }),
});

export type AcademyData = z.infer<typeof academySchema>;
export type AcademyLevel = z.infer<typeof academyLevelSchema>;

// ============================================================
// Joy Club · Lettre d'intention parents (périscolaire)
// ============================================================

export const childJoyClubSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  age: z.string().min(1, "Âge requis"),
  centreAere: z.boolean(),
  garderieMercredi: z.boolean(),
  soutienScolaire: z.boolean(),
});

export const joyClubSchema = z.object({
  guardianFirstName: z.string().min(1, "Prénom requis"),
  guardianLastName: z.string().min(1, "Nom requis"),
  addressStreet: z.string().min(3, "Numéro et voie requis"),
  addressPostalCode: postalCodeSchema,
  addressCity: z.string().min(1, "Ville requise"),
  phone: phoneSchema,
  email: emailSchema,
  children: z.array(childJoyClubSchema).min(1, "Au moins un enfant"),
  city: z.string().min(2, "Ville requise"),
  signedDate: z.string().min(1, "Date requise"),
  acceptRgpd: z.literal(true, { message: "Acceptation RGPD requise" }),
  acceptTerms: z.literal(true, { message: "Acceptation requise" }),
});

export type JoyClubData = z.infer<typeof joyClubSchema>;

// ============================================================
// Partenaire · 3 variantes
// ============================================================

export const partnerVariantSchema = z.enum([
  "institutional",
  "professional",
  "economic",
]);

export type PartnerVariant = z.infer<typeof partnerVariantSchema>;

const partnerCommon = {
  variant: partnerVariantSchema,
  city: z.string().min(2, "Ville requise"),
  signedDate: z.string().min(1, "Date requise"),
  signerFirstName: z.string().min(1, "Prénom requis"),
  signerLastName: z.string().min(1, "Nom requis"),
  signerRole: z.string().min(2, "Fonction requise"),
  organizationName: z.string().min(2, "Structure requise"),
  email: emailSchema,
  acceptRgpd: z.literal(true, { message: "Acceptation RGPD requise" }),
  acceptTerms: z.literal(true, { message: "Acceptation requise" }),
};

export const partnerInstitutionalSchema = z.object({
  ...partnerCommon,
  variant: z.literal("institutional"),
  commitment: z
    .string()
    .min(5, "Précisez votre engagement (ex. relais d'info, mise en réseau…)"),
});

export const partnerProfessionalSchema = z.object({
  ...partnerCommon,
  variant: z.literal("professional"),
  profession: z.string().min(2, "Profession requise"),
  practiceContext: z.string().min(5, "Cadre et lieu d'exercice"),
  observation: z.string().min(5, "Constat de votre pratique"),
  availability: z
    .string()
    .min(5, "Précisez vos disponibilités (orienter, intervenir…)"),
});

export const partnerEconomicSchema = z.object({
  ...partnerCommon,
  variant: z.literal("economic"),
  activity: z.string().min(2, "Activité requise"),
  territory: z.string().min(2, "Territoire requis"),
  partnership: z
    .string()
    .min(5, "Précisez la nature du partenariat envisagé"),
});

export const partnerSchema = z.discriminatedUnion("variant", [
  partnerInstitutionalSchema,
  partnerProfessionalSchema,
  partnerEconomicSchema,
]);

export type PartnerData = z.infer<typeof partnerSchema>;

// ============================================================
// Type unifié
// ============================================================

export type SubmissionType =
  | "academy"
  | "joy_club"
  | "partner_institutional"
  | "partner_professional"
  | "partner_economic";

export const submissionTypeLabels: Record<SubmissionType, string> = {
  academy: "Sion Academy · Lettre d'intention parents",
  joy_club: "Joy Club · Lettre d'intention parents",
  partner_institutional: "Soutien partenaire · Institutionnel/associatif",
  partner_professional: "Soutien partenaire · Professionnel",
  partner_economic: "Soutien partenaire · Acteur économique",
};

// ============================================================
// Signature
// ============================================================

export const signatureSchema = z.object({
  signatureSvg: z.string().min(50, "Signature requise"),
  signatureName: z.string().min(2, "Nom du signataire requis"),
});

export type SignatureData = z.infer<typeof signatureSchema>;

// ============================================================
// Helpers d'affichage
// ============================================================

export function fullName(firstName?: string, lastName?: string) {
  return [firstName, lastName].filter(Boolean).join(" ");
}

export function formatAddress(street?: string, postalCode?: string, city?: string) {
  return [street, [postalCode, city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
}
