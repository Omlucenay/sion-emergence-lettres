"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignaturePadCanvas, type SignatureResult } from "@/components/signature-pad";

export function SignatureClient({
  submissionId,
  defaultName,
}: {
  submissionId: string;
  defaultName: string;
}) {
  const router = useRouter();
  const [signature, setSignature] = useState<SignatureResult | null>(null);
  const [name, setName] = useState(defaultName);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onConfirm() {
    if (!signature) {
      setError("Tracez d'abord votre signature.");
      return;
    }
    if (name.trim().length < 2) {
      setError("Confirmez votre nom complet.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/sign/${submissionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signatureSvg: signature.svg,
          signaturePng: signature.pngDataUri,
          signatureName: name.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur lors de la signature");
      router.push(`/confirmation/${submissionId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="label" htmlFor="signature-name">
          Nom complet du signataire
        </label>
        <input
          id="signature-name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Prénom NOM"
        />
      </div>

      <div>
        <p className="label">Votre signature manuscrite</p>
        <SignaturePadCanvas onChange={setSignature} />
      </div>

      <div className="bg-[var(--pale)] p-4 text-xs text-[var(--muted)] leading-relaxed">
        <p className="font-semibold text-[var(--ink)] mb-1">Signature électronique simple</p>
        <p>
          En validant, vous reconnaissez avoir lu et approuvé le contenu de la lettre. Votre
          signature, l&apos;horodatage, votre adresse IP et l&apos;empreinte SHA-256 du document
          seront enregistrés à des fins probatoires (art. 1366-1367 Code civil — règlement
          eIDAS, signature simple).
        </p>
      </div>

      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onConfirm}
        disabled={submitting}
        className="btn"
      >
        {submitting ? "Génération…" : "Signer & envoyer la lettre"}
      </button>
    </div>
  );
}
