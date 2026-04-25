import { notFound } from "next/navigation";
import { submissionStore } from "@/lib/store";
import { SiteFrame } from "@/components/site-frame";
import { submissionTypeLabels, type SubmissionType } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await submissionStore.findUnique(id);
  if (!submission) notFound();

  return (
    <SiteFrame>
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
          Confirmation
        </p>
        <h1 className="font-display text-4xl md:text-5xl mb-6">
          Merci, votre lettre est signée.
        </h1>
        <p className="text-[var(--muted)] leading-relaxed mb-10">
          Une copie vient de vous être envoyée à <strong>{submission.signerEmail}</strong>.
          Sion Émergence l&apos;a également bien reçue.
        </p>

        <dl className="card mb-10 grid sm:grid-cols-2 gap-5">
          <div>
            <dt className="label">Référence</dt>
            <dd className="font-mono text-sm break-all">{submission.id}</dd>
          </div>
          <div>
            <dt className="label">Document</dt>
            <dd>{submissionTypeLabels[submission.type as SubmissionType]}</dd>
          </div>
          <div>
            <dt className="label">Signée le</dt>
            <dd>{submission.signedAt ? new Date(submission.signedAt).toLocaleString("fr-FR") : "—"}</dd>
          </div>
          <div>
            <dt className="label">Empreinte SHA-256</dt>
            <dd className="font-mono text-[10px] break-all">{submission.pdfHash ?? "—"}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-3">
          <a href={`/api/pdf/${submission.id}`} target="_blank" rel="noreferrer" className="btn">
            Télécharger la lettre signée
          </a>
          <a href="https://sion-emergence.fr" className="btn btn-secondary">
            Retour à l&apos;accueil
          </a>
        </div>

        <p className="mt-10 text-xs text-[var(--muted)] leading-relaxed">
          Cette signature électronique simple a valeur probatoire (art. 1366-1367 du Code civil
          français — règlement eIDAS). En cas de question, écrivez à{" "}
          <a className="underline" href="mailto:om.lucenay@gmail.com">
            om.lucenay@gmail.com
          </a>
          .
        </p>
      </div>
    </SiteFrame>
  );
}
