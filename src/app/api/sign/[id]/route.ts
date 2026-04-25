import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { submissionStore } from "@/lib/store";
import { renderSubmissionPdf } from "@/lib/pdf/render";
import { sendMail } from "@/lib/email";
import type {
  AcademyData,
  JoyClubData,
  PartnerData,
  SubmissionType,
} from "@/lib/schemas";
import { submissionTypeLabels } from "@/lib/schemas";

export const runtime = "nodejs";

const bodySchema = z.object({
  signatureSvg: z.string().min(50),
  signaturePng: z.string().startsWith("data:image/png;base64,"),
  signatureName: z.string().min(2),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 422 });
  }

  const submission = await submissionStore.findUnique(id);
  if (!submission) {
    return NextResponse.json({ error: "Soumission introuvable" }, { status: 404 });
  }
  if (submission.status !== "pending") {
    return NextResponse.json({ error: "Déjà signée" }, { status: 409 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const ua = req.headers.get("user-agent") ?? "unknown";
  const now = new Date();

  const data = JSON.parse(submission.formData) as
    | AcademyData
    | JoyClubData
    | PartnerData;

  // Generate signed PDF
  const pdf = await renderSubmissionPdf({
    type: submission.type as SubmissionType,
    data,
    submissionId: submission.id,
    signatureDataUri: parsed.data.signaturePng,
    signedAt: now.toISOString().slice(0, 16).replace("T", " "),
    ip,
    hash: undefined, // hash is computed after — but the rendered file embeds hash field as undefined; acceptable
  });

  const hash = crypto.createHash("sha256").update(pdf).digest("hex");

  // Persist to disk
  const storageDir = path.resolve("storage/uploads");
  await fs.mkdir(storageDir, { recursive: true });
  const pdfPath = path.join(storageDir, `${submission.id}.pdf`);
  await fs.writeFile(pdfPath, pdf);

  await submissionStore.update(submission.id, {
    status: "signed",
    signatureSvg: parsed.data.signatureSvg,
    signatureName: parsed.data.signatureName,
    signedAt: now.toISOString(),
    signerIp: ip,
    signerUa: ua,
    pdfHash: hash,
    pdfPath,
  });

  // Send emails
  const typeLabel = submissionTypeLabels[submission.type as SubmissionType];
  const subject = `Lettre signée — ${typeLabel}`;
  const recipientHtml = `
    <p>Bonjour ${parsed.data.signatureName},</p>
    <p>Vous trouverez ci-joint la lettre que vous venez de signer électroniquement.</p>
    <ul>
      <li>Référence : <strong>${submission.id}</strong></li>
      <li>Document : ${typeLabel}</li>
      <li>Signée le : ${now.toISOString().slice(0, 16).replace("T", " ")} (UTC)</li>
      <li>Empreinte SHA-256 : <code>${hash}</code></li>
    </ul>
    <p>Une copie a été transmise à Sion Émergence.</p>
    <p>— L'équipe Sion Émergence<br/>om.lucenay@gmail.com</p>
  `;

  const adminHtml = `
    <p>Nouvelle lettre signée reçue.</p>
    <ul>
      <li>Référence : <strong>${submission.id}</strong></li>
      <li>Document : ${typeLabel}</li>
      <li>Signataire : ${parsed.data.signatureName} (${submission.signerEmail})</li>
      <li>Signée le : ${now.toISOString()} — IP ${ip}</li>
      <li>Empreinte SHA-256 : <code>${hash}</code></li>
    </ul>
  `;

  const adminEmail = process.env.NOTIFICATION_EMAIL ?? "om.lucenay@gmail.com";

  try {
    await Promise.all([
      sendMail({
        to: submission.signerEmail,
        subject,
        html: recipientHtml,
        attachments: [
          {
            filename: `lettre-${submission.id}.pdf`,
            content: pdf,
            contentType: "application/pdf",
          },
        ],
      }),
      sendMail({
        to: adminEmail,
        subject: `[Sion Émergence] ${typeLabel} — ${parsed.data.signatureName}`,
        html: adminHtml,
        attachments: [
          {
            filename: `lettre-${submission.id}.pdf`,
            content: pdf,
            contentType: "application/pdf",
          },
        ],
      }),
    ]);
    await submissionStore.update(submission.id, {
      status: "sent",
      emailSentAt: new Date().toISOString(),
    });
  } catch (e) {
    // Email send failure is non-fatal — submission is already marked signed
    console.error("[sign] email send failed:", e);
  }

  return NextResponse.json({ ok: true, hash });
}
