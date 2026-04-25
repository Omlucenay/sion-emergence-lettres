import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { submissionStore } from "@/lib/store";
import { renderSubmissionPdf } from "@/lib/pdf/render";
import type { AcademyData, JoyClubData, PartnerData, SubmissionType } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Returns the *signed* PDF (regenerated from stored data + stored signature).
// The canonical archived copy is also written to /storage/uploads at signing time;
// this route serves a fresh render so links keep working even after restores.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const submission = await submissionStore.findUnique(id);
  if (!submission) return new NextResponse("Not found", { status: 404 });
  if (submission.status === "pending") {
    return new NextResponse("Lettre non signée", { status: 409 });
  }

  // Try to serve the archived file first (immutable, hash-anchored)
  if (submission.pdfPath) {
    try {
      const file = await fs.readFile(path.resolve(submission.pdfPath));
      return new NextResponse(new Uint8Array(file), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="lettre-${submission.id}.pdf"`,
          "Cache-Control": "private, max-age=3600",
        },
      });
    } catch {
      // fall through to regeneration
    }
  }

  const data = JSON.parse(submission.formData) as
    | AcademyData
    | JoyClubData
    | PartnerData;

  const pdf = await renderSubmissionPdf({
    type: submission.type as SubmissionType,
    data,
    submissionId: submission.id,
    signatureDataUri: submission.signatureSvg
      ? svgToDataUri(submission.signatureSvg)
      : undefined,
    signedAt: submission.signedAt?.slice(0, 16).replace("T", " "),
    ip: submission.signerIp ?? undefined,
    hash: submission.pdfHash ?? undefined,
  });

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="lettre-${submission.id}.pdf"`,
    },
  });
}

function svgToDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
