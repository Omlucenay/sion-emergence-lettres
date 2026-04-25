import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // o2switch + Passenger : on lance Next.js via server.js (mode start standard)
  // PDF rendering uses Node fs/crypto — API routes restent sur Node runtime (défaut)
};

export default nextConfig;
