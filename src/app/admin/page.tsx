import { submissionStore } from "@/lib/store";
import { SiteFrame } from "@/components/site-frame";
import { submissionTypeLabels, fullName, type SubmissionType } from "@/lib/schemas";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const sp = await searchParams;

  const [submissions, totalByType] = await Promise.all([
    submissionStore.findMany({ type: sp.type, limit: 200 }),
    submissionStore.countByTypeAndStatus(),
  ]);

  return (
    <SiteFrame>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] mb-3">Admin</p>
        <h1 className="font-display text-4xl md:text-5xl mb-8">Lettres reçues</h1>

        <div className="flex flex-wrap gap-2 mb-8 text-xs">
          <FilterChip href="/admin" label="Toutes" current={!sp.type} />
          {(Object.keys(submissionTypeLabels) as SubmissionType[]).map((t) => (
            <FilterChip
              key={t}
              href={`/admin?type=${t}`}
              label={`${submissionTypeLabels[t]} (${totalByType[t] ?? 0})`}
              current={sp.type === t}
            />
          ))}
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.12em] text-[var(--muted)] border-b border-[#E8E2D8]">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Signataire</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Statut</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[var(--muted)]">
                    Aucune lettre pour le moment.
                  </td>
                </tr>
              ) : null}
              {submissions.map((s) => {
                const data = JSON.parse(s.formData) as Record<string, unknown>;
                const name =
                  s.signatureName ??
                  (fullName(
                    data.guardianFirstName as string | undefined,
                    data.guardianLastName as string | undefined,
                  ) ||
                    fullName(
                      data.signerFirstName as string | undefined,
                      data.signerLastName as string | undefined,
                    ) ||
                    "—");
                return (
                  <tr key={s.id} className="border-b border-[#F1ECE3] last:border-0">
                    <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">
                      {new Date(s.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs uppercase tracking-[0.1em]">
                        {shortType(s.type as SubmissionType)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{name}</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">{s.signerEmail}</td>
                    <td className="py-3 pr-4">
                      <StatusPill status={s.status} />
                    </td>
                    <td className="py-3 text-right">
                      {s.status !== "pending" ? (
                        <a
                          href={`/api/pdf/${s.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs underline hover:text-[var(--accent)]"
                        >
                          Télécharger PDF
                        </a>
                      ) : (
                        <span className="text-xs text-[var(--muted)]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-xs text-[var(--muted)]">
          <a href="/api/admin/export.csv" className="underline">
            Exporter en CSV
          </a>
        </p>
      </div>
    </SiteFrame>
  );
}

function FilterChip({
  href,
  label,
  current,
}: {
  href: string;
  label: string;
  current: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1 border ${
        current
          ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
          : "border-[#D8D3CB] hover:border-[var(--ink)]"
      }`}
    >
      {label}
    </Link>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-[#F4F1EC] text-[var(--muted)]",
    signed: "bg-[#FFF3E0] text-[#A35A1F]",
    sent: "bg-[#E0F2EA] text-[#205C42]",
  };
  const label =
    status === "pending" ? "En attente" : status === "signed" ? "Signée" : "Envoyée";
  return (
    <span className={`text-[10px] uppercase tracking-[0.12em] px-2 py-1 ${map[status] ?? ""}`}>
      {label}
    </span>
  );
}

function shortType(t: SubmissionType) {
  if (t === "academy") return "Academy";
  if (t === "joy_club") return "Joy Club";
  if (t === "partner_institutional") return "Partenaire · Institutionnel";
  if (t === "partner_professional") return "Partenaire · Professionnel";
  return "Partenaire · Économique";
}
