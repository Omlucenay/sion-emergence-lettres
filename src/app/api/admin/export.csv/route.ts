import { NextResponse } from "next/server";
import { submissionStore } from "@/lib/store";
import type {
  AcademyData,
  JoyClubData,
  PartnerData,
  SubmissionType,
} from "@/lib/schemas";

export const dynamic = "force-dynamic";

// Colonnes du CSV · pensées pour filtrer / trier dans Excel ou Google Sheets.
const HEADERS = [
  "id",
  "createdAt",
  "type",
  "status",
  // Signataire (commun)
  "signerFirstName",
  "signerLastName",
  "signerEmail",
  "signerPhone",
  // Adresse postale (parents)
  "addressStreet",
  "addressPostalCode",
  "addressCity",
  // Partenaire
  "organizationName",
  "signerRole",
  "partnerVariant",
  "partnerCommitment",
  "partnerProfession",
  "partnerActivity",
  "partnerTerritory",
  // Enfants : 1 ligne par enfant · répété pour chaque enfant via colonnes child1_… child2_…
  "childCount",
  "child1_firstName",
  "child1_lastName",
  "child1_birthDate",
  "child1_age",
  "child1_level",
  "child1_centreAere",
  "child1_garderieMercredi",
  "child1_soutienScolaire",
  "child2_firstName",
  "child2_lastName",
  "child2_birthDate",
  "child2_age",
  "child2_level",
  "child2_centreAere",
  "child2_garderieMercredi",
  "child2_soutienScolaire",
  "child3_firstName",
  "child3_lastName",
  "child3_birthDate",
  "child3_age",
  "child3_level",
  "child3_centreAere",
  "child3_garderieMercredi",
  "child3_soutienScolaire",
  // Signature
  "signedAt",
  "signedCity",
  "signedDate",
  "ip",
  "pdfHash",
] as const;

type Row = Partial<Record<(typeof HEADERS)[number], string>>;

export async function GET() {
  const submissions = await submissionStore.findMany();

  const rows: Row[] = submissions.map((s) => {
    const data = JSON.parse(s.formData) as Record<string, unknown>;
    const type = s.type as SubmissionType;
    const row: Row = {
      id: s.id,
      createdAt: s.createdAt,
      type,
      status: s.status,
      signerEmail: s.signerEmail,
      signedAt: s.signedAt ?? "",
      ip: s.signerIp ?? "",
      pdfHash: s.pdfHash ?? "",
      signedDate: (data.signedDate as string) ?? "",
      signedCity: (data.city as string) ?? "",
    };

    if (type === "academy" || type === "joy_club") {
      const d = data as AcademyData | JoyClubData;
      row.signerFirstName = d.guardianFirstName;
      row.signerLastName = d.guardianLastName;
      row.signerPhone = d.phone;
      row.addressStreet = d.addressStreet;
      row.addressPostalCode = d.addressPostalCode;
      row.addressCity = d.addressCity;
      row.childCount = String(d.children.length);
      d.children.slice(0, 3).forEach((c, idx) => {
        const k = (suffix: string) => `child${idx + 1}_${suffix}` as (typeof HEADERS)[number];
        row[k("firstName")] = c.firstName;
        row[k("lastName")] = c.lastName;
        if (type === "academy") {
          const ac = c as AcademyData["children"][number];
          row[k("birthDate")] = ac.birthDate;
          row[k("level")] = ac.level;
        } else {
          const jc = c as JoyClubData["children"][number];
          row[k("age")] = jc.age;
          row[k("centreAere")] = jc.centreAere ? "oui" : "non";
          row[k("garderieMercredi")] = jc.garderieMercredi ? "oui" : "non";
          row[k("soutienScolaire")] = jc.soutienScolaire ? "oui" : "non";
        }
      });
    } else {
      const d = data as PartnerData;
      row.signerFirstName = d.signerFirstName;
      row.signerLastName = d.signerLastName;
      row.signerRole = d.signerRole;
      row.organizationName = d.organizationName;
      row.partnerVariant = d.variant;
      if (d.variant === "institutional") row.partnerCommitment = d.commitment;
      if (d.variant === "professional") row.partnerProfession = d.profession;
      if (d.variant === "economic") {
        row.partnerActivity = d.activity;
        row.partnerTerritory = d.territory;
      }
    }
    return row;
  });

  const csvLines = [
    HEADERS.join(","),
    ...rows.map((r) =>
      HEADERS.map((h) => {
        const v = String(r[h] ?? "");
        return /[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
      }).join(","),
    ),
  ];

  // BOM UTF-8 pour qu'Excel ouvre les accents correctement
  const csv = "\uFEFF" + csvLines.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sion-lettres-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}
