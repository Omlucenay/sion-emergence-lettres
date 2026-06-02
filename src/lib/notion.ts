// notion.ts — pousse chaque soumission signée dans la base Notion
// Base : https://www.notion.so/1b178d6f97f0465b95826b34f7a71ef4

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = "1b178d6f97f0465b95826b34f7a71ef4";

const TYPE_MAP: Record<string, string> = {
  academy: "Academy",
  joy_club: "Joy Club",
  partner_institutional: "Partenaire Institutionnel",
  partner_professional: "Partenaire Professionnel",
  partner_economic: "Partenaire Économique",
};

const STATUT_MAP: Record<string, string> = {
  pending: "En attente",
  signed: "Signée",
  sent: "Envoyée",
};

export async function pushToNotion(row: {
  signataire: string;
  email: string;
  type: string;
  statut: string;
  dateSubmission: string; // ISO date
  dateSignature?: string; // ISO date
  reference: string;
  lienPdf?: string;
}): Promise<void> {
  if (!NOTION_TOKEN) {
    console.warn("[notion] NOTION_TOKEN absent — push ignoré");
    return;
  }

  const properties: Record<string, unknown> = {
    Signataire: { title: [{ text: { content: row.signataire } }] },
    Email: { email: row.email },
    Type: { select: { name: TYPE_MAP[row.type] ?? row.type } },
    Statut: { select: { name: STATUT_MAP[row.statut] ?? row.statut } },
    "Date soumission": { date: { start: row.dateSubmission.slice(0, 10) } },
    Référence: { rich_text: [{ text: { content: row.reference } }] },
  };

  if (row.dateSignature) {
    properties["Date signature"] = { date: { start: row.dateSignature.slice(0, 10) } };
  }
  if (row.lienPdf) {
    properties["Lien PDF"] = { url: row.lienPdf };
  }

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DB_ID },
      properties,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[notion] Erreur push :", res.status, err);
  } else {
    console.log("[notion] Push OK pour", row.reference);
  }
}
