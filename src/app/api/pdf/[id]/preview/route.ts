import { NextResponse } from "next/server";
import { submissionStore } from "@/lib/store";
import { renderSubmissionPdf } from "@/lib/pdf/render";
import type { SubmissionType, AcademyData, JoyClubData, PartnerData } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const submission = await submissionStore.findUnique(id);
  if (!submission) return new NextResponse("Not found", { status: 404 });

  const data = JSON.parse(submission.formData) as
    | AcademyData
    | JoyClubData
    | PartnerData;

  const pdf = await renderSubmissionPdf({
    type: submission.type as SubmissionType,
    data,
    submissionId: submission.id,
  });

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="lettre-preview-${submission.id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
