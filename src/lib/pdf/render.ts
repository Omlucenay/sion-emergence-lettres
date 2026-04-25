import { renderToBuffer } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import { AcademyPdf } from "./academy";
import { JoyClubPdf } from "./joy-club";
import { PartnerPdf } from "./partner";
import type { AcademyData, JoyClubData, PartnerData, SubmissionType } from "../schemas";

type RenderArgs = {
  type: SubmissionType;
  data: AcademyData | JoyClubData | PartnerData;
  submissionId: string;
  signatureDataUri?: string;
  signedAt?: string;
  ip?: string;
  hash?: string;
};

export async function renderSubmissionPdf(args: RenderArgs): Promise<Buffer> {
  const { type, data, ...rest } = args;
  let element: ReactElement<DocumentProps>;
  if (type === "academy") {
    element = AcademyPdf({ ...rest, data: data as AcademyData }) as ReactElement<DocumentProps>;
  } else if (type === "joy_club") {
    element = JoyClubPdf({ ...rest, data: data as JoyClubData }) as ReactElement<DocumentProps>;
  } else {
    element = PartnerPdf({ ...rest, data: data as PartnerData }) as ReactElement<DocumentProps>;
  }
  return renderToBuffer(element);
}
