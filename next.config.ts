import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build standalone : nécessaire pour o2switch (Passenger / Application Node.js)
  output: "standalone",
  // PDF rendering uses Node fs/crypto — keep API routes on Node runtime (default)
};

export default nextConfig;
