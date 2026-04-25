import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  academySchema,
  joyClubSchema,
  partnerSchema,
  type SubmissionType,
} from "@/lib/schemas";

const bodySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("academy"), data: academySchema }),
  z.object({ type: z.literal("joy_club"), data: joyClubSchema }),
  z.object({ type: z.literal("partner_institutional"), data: partnerSchema }),
  z.object({ type: z.literal("partner_professional"), data: partnerSchema }),
  z.object({ type: z.literal("partner_economic"), data: partnerSchema }),
]);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.format() },
      { status: 422 },
    );
  }

  const { type, data } = parsed.data;

  // Cohérence : pour les partenaires, on aligne le type sur la variante
  const finalType: SubmissionType =
    type === "academy" || type === "joy_club"
      ? type
      : (`partner_${(data as { variant: string }).variant}` as SubmissionType);

  const email =
    "email" in data ? (data as { email: string }).email : "";

  const submission = await prisma.submission.create({
    data: {
      type: finalType,
      formData: JSON.stringify(data),
      signerEmail: email,
      acceptRgpd: Boolean((data as { acceptRgpd?: boolean }).acceptRgpd),
      acceptTerms: Boolean((data as { acceptTerms?: boolean }).acceptTerms),
    },
  });

  return NextResponse.json({ id: submission.id });
}
