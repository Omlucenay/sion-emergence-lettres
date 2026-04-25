// store.ts — stockage minimaliste des soumissions sur le système de fichiers.
// Une soumission = un fichier JSON dans storage/submissions/<id>.json.
// Évite la dépendance à Prisma/MySQL qui pose des problèmes sur o2switch.

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type SubmissionRow = {
  id: string;
  type: string;
  status: "pending" | "signed" | "sent";
  formData: string;
  signatureSvg?: string | null;
  signatureName?: string | null;
  signedAt?: string | null;
  signerIp?: string | null;
  signerUa?: string | null;
  pdfHash?: string | null;
  pdfPath?: string | null;
  acceptRgpd: boolean;
  acceptTerms: boolean;
  signerEmail: string;
  emailSentAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

// Résout le dossier de stockage depuis l'env var STORAGE_DIR si défini,
// sinon depuis le répertoire de travail. On évite path.resolve() qui dépend
// du CWD au moment de l'exécution (Passenger ne lance pas forcément depuis
// la racine du projet).
function resolveStorageDir(): string {
  if (process.env.STORAGE_DIR) {
    return path.resolve(process.env.STORAGE_DIR);
  }
  return path.resolve(process.cwd(), "storage/submissions");
}

const STORAGE_DIR = resolveStorageDir();

async function ensureDir(): Promise<void> {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
}

function makeId(): string {
  return crypto.randomBytes(12).toString("hex");
}

function filePath(id: string): string {
  return path.join(STORAGE_DIR, `${id}.json`);
}

export const submissionStore = {
  async create(input: {
    type: string;
    formData: string;
    signerEmail: string;
    acceptRgpd: boolean;
    acceptTerms: boolean;
  }): Promise<SubmissionRow> {
    await ensureDir();
    const now = new Date().toISOString();
    const row: SubmissionRow = {
      id: makeId(),
      type: input.type,
      status: "pending",
      formData: input.formData,
      acceptRgpd: input.acceptRgpd,
      acceptTerms: input.acceptTerms,
      signerEmail: input.signerEmail,
      createdAt: now,
      updatedAt: now,
    };
    await fs.writeFile(filePath(row.id), JSON.stringify(row, null, 2), "utf8");
    return row;
  },

  async findUnique(id: string): Promise<SubmissionRow | null> {
    try {
      const text = await fs.readFile(filePath(id), "utf8");
      return JSON.parse(text) as SubmissionRow;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw err;
    }
  },

  async update(
    id: string,
    patch: Partial<Omit<SubmissionRow, "id" | "createdAt">>,
  ): Promise<SubmissionRow> {
    const existing = await this.findUnique(id);
    if (!existing) throw new Error(`Soumission introuvable : ${id}`);
    const updated: SubmissionRow = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    await fs.writeFile(filePath(id), JSON.stringify(updated, null, 2), "utf8");
    return updated;
  },

  async findMany(opts: { type?: string; limit?: number } = {}): Promise<SubmissionRow[]> {
    await ensureDir();
    let files: string[];
    try {
      files = await fs.readdir(STORAGE_DIR);
    } catch {
      return [];
    }
    const rows: SubmissionRow[] = [];
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const text = await fs.readFile(path.join(STORAGE_DIR, file), "utf8");
        rows.push(JSON.parse(text) as SubmissionRow);
      } catch {
        // ignore les fichiers corrompus
      }
    }
    let filtered = rows;
    if (opts.type) filtered = filtered.filter((r) => r.type === opts.type);
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (opts.limit) filtered = filtered.slice(0, opts.limit);
    return filtered;
  },

  async countByTypeAndStatus(): Promise<Record<string, number>> {
    const all = await this.findMany();
    const counts: Record<string, number> = {};
    for (const row of all) {
      counts[row.type] = (counts[row.type] ?? 0) + 1;
    }
    return counts;
  },
};
