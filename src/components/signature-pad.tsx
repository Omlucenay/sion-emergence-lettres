"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";

export type SignatureResult = {
  svg: string;
  pngDataUri: string;
};

export function SignaturePadCanvas({
  onChange,
}: {
  onChange: (result: SignatureResult | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);
      padRef.current?.clear();
      setEmpty(true);
      onChange(null);
    };

    const pad = new SignaturePad(canvas, {
      penColor: "#1A1A1A",
      backgroundColor: "rgba(255,255,255,0)",
      minWidth: 0.6,
      maxWidth: 2.2,
    });
    padRef.current = pad;

    const handleEnd = () => {
      if (pad.isEmpty()) {
        setEmpty(true);
        onChange(null);
        return;
      }
      setEmpty(false);
      const svg = pad.toSVG();
      const pngDataUri = pad.toDataURL("image/png");
      onChange({ svg, pngDataUri });
    };
    pad.addEventListener("endStroke", handleEnd);

    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      pad.removeEventListener("endStroke", handleEnd);
      pad.off();
    };
  }, [onChange]);

  function clear() {
    padRef.current?.clear();
    setEmpty(true);
    onChange(null);
  }

  return (
    <div className="space-y-3">
      <div className="relative bg-white border border-[#D8D3CB]" style={{ aspectRatio: "3 / 1" }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
        />
        {empty ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[var(--muted)] text-sm">
            Tracez votre signature ici (souris, doigt ou stylet)
          </div>
        ) : null}
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{empty ? "Aucune signature" : "Signature enregistrée"}</span>
        <button
          type="button"
          onClick={clear}
          className="underline hover:text-[var(--ink)]"
          disabled={empty}
        >
          Effacer
        </button>
      </div>
    </div>
  );
}
