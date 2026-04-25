import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SiteFrame } from "@/components/site-frame";
import { SignatureClient } from "./signature-client";
import { submissionTypeLabels, fullName, type SubmissionType } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export default async function SignaturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission) notFound();

  const data = JSON.parse(submission.formData) as Record<string, unknown>;
  const previewName =
    fullName(
      data.guardianFirstName as string | undefined,
      data.guardianLastName as string | undefined,
    ) ||
    fullName(
      data.signerFirstName as string | undefined,
      data.signerLastName as string | undefined,
    ) ||
    "";

  return (
    <SiteFrame withBackLink>
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
          Étape finale · Signature électronique
        </p>
        <h1 className="font-display text-4xl md:text-5xl mb-3">
          Signez votre lettre
        </h1>
        <p className="text-[var(--muted)] leading-relaxed mb-8">
          Document : <span className="text-[var(--ink)]">{submissionTypeLabels[submission.type as SubmissionType]}</span>.
          Tracez votre signature ci-dessous, confirmez votre nom, puis validez. Vous recevrez la
          lettre signée par email.
        </p>

        <a
          href={`/api/pdf/${submission.id}/preview`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[var(--accent)] underline mb-8"
        >
          📄 Prévisualiser la lettre (PDF)
        </a>

        <SignatureClient submissionId={submission.id} defaultName={previewName} />
      </div>
    </SiteFrame>
  );
}
