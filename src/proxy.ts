import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

// Protège /admin ET /api/admin. L'export CSV vivait sous /api/admin/export.csv et n'était
// jamais couvert par ce middleware (le matcher ne listait que /admin/:path*, et ce guard ne
// vérifiait que le préfixe "/admin") : toute la base de données familles était accessible sans
// authentification par un simple GET. Corrigé sur les deux fronts, et le mode "pas de mot de
// passe = accès libre" (pensé dev only) est retiré : en prod, une variable manquante bloque
// l'accès plutôt que de l'ouvrir.
function timingSafeEqualStrings(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return new NextResponse("Configuration manquante (ADMIN_PASSWORD)", { status: 503 });
  }

  const auth = req.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString();
      const sepIndex = decoded.indexOf(":");
      const user = decoded.slice(0, sepIndex);
      const pass = decoded.slice(sepIndex + 1);
      if (user === "admin" && timingSafeEqualStrings(pass, expected)) {
        return NextResponse.next();
      }
    }
  }
  return new NextResponse("Authentification requise", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Sion Emergence Admin"' },
  });
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
