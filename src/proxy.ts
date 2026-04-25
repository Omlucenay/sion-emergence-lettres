import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.next(); // pas de mdp = libre (dev only)

  const auth = req.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString();
      const [user, pass] = decoded.split(":");
      if (user === "admin" && pass === expected) return NextResponse.next();
    }
  }
  return new NextResponse("Authentification requise", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Sion Emergence Admin"' },
  });
}

export const config = { matcher: ["/admin/:path*"] };
